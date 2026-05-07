import crypto from "node:crypto";

import { getStripeCheckoutEnv } from "./env";

export type StripeCheckoutSessionResult = {
  id: string;
  url: string;
};

type StripeCheckoutApiResponse = {
  id?: string;
  url?: string;
  error?: {
    message?: string;
  };
};

function parseStripeSignatureHeader(signatureHeader: string): { timestamp: number; signatures: string[] } {
  const entries = signatureHeader
    .split(",")
    .map((part) => part.trim())
    .map((part) => part.split("=", 2))
    .filter(([key, value]) => key && value);

  const timestampEntry = entries.find(([key]) => key === "t");
  const signatureEntries = entries.filter(([key]) => key === "v1").map(([, value]) => value);
  const timestamp = timestampEntry ? Number(timestampEntry[1]) : Number.NaN;

  if (!Number.isInteger(timestamp) || timestamp <= 0 || signatureEntries.length === 0) {
    throw new Error("Invalid Stripe signature header");
  }

  return { timestamp, signatures: signatureEntries };
}

export function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds = 300,
): void {
  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > toleranceSeconds) {
    throw new Error("Stripe webhook signature is too old");
  }

  const verified = signatures.some((candidateSignature) => {
    const candidateBuffer = Buffer.from(candidateSignature, "hex");

    return (
      candidateBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(candidateBuffer, expectedBuffer)
    );
  });

  if (!verified) {
    throw new Error("Stripe webhook signature verification failed");
  }
}

export async function createStripeCheckoutSession(appBaseUrl: string): Promise<StripeCheckoutSessionResult> {
  const env = getStripeCheckoutEnv();
  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${appBaseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appBaseUrl}/?checkout=cancelled`,
    "line_items[0][price]": env.stripePriceId,
    "line_items[0][quantity]": "1",
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const responseText = await response.text();
  const parsed = responseText ? (JSON.parse(responseText) as StripeCheckoutApiResponse) : {};

  if (!response.ok) {
    throw new Error(parsed.error?.message || `Stripe checkout session request failed with status ${response.status}`);
  }

  if (!parsed.id || !parsed.url) {
    throw new Error("Stripe checkout session response was missing a checkout URL");
  }

  return {
    id: parsed.id,
    url: parsed.url,
  };
}
