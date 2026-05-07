import { NextResponse } from "next/server";

import { LICENSE_MAX_DEVICES, getStripeWebhookEnv } from "@/lib/server/env";
import { verifyStripeWebhookSignature } from "@/lib/server/stripe";
import { supabaseUpsert } from "@/lib/server/supabase";

type StripeCheckoutSession = {
  amount_total?: number | null;
  created?: number;
  customer?: string | { id: string } | null;
  customer_details?: {
    email?: string | null;
  } | null;
  currency?: string | null;
  id: string;
  metadata?: {
    email?: string | null;
  } | null;
  payment_status?: string | null;
  status?: string | null;
};

type StripeWebhookEvent = {
  data: {
    object: StripeCheckoutSession;
  };
  id: string;
  type: string;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getCustomerId(customer: StripeCheckoutSession["customer"]): string | null {
  if (!customer) {
    return null;
  }

  return typeof customer === "string" ? customer : customer.id;
}

export async function POST(request: Request) {
  try {
    const env = getStripeWebhookEnv();
    const signatureHeader = request.headers.get("stripe-signature");

    if (!signatureHeader) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const payload = await request.text();
    verifyStripeWebhookSignature(payload, signatureHeader, env.stripeWebhookSecret);

    const event = JSON.parse(payload) as StripeWebhookEvent;

    await supabaseUpsert(
      "stripe_events",
      {
        event_id: event.id,
        event_type: event.type,
        payload: event,
      },
      "event_id",
    );

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const email = normalizeEmail(session.customer_details?.email || session.metadata?.email || "");

    if (!email) {
      throw new Error("Stripe checkout session is missing a customer email");
    }

    const customerId = getCustomerId(session.customer);

    await supabaseUpsert(
      "purchases",
      {
        amount_total: session.amount_total ?? null,
        checkout_session_id: session.id,
        currency: session.currency ?? null,
        email,
        payment_status: session.payment_status ?? session.status ?? "unknown",
        stripe_customer_id: customerId,
      },
      "checkout_session_id",
    );

    await supabaseUpsert(
      "accounts",
      {
        email_norm: email,
        entitlement_active: true,
        max_devices: LICENSE_MAX_DEVICES,
        updated_at: new Date().toISOString(),
      },
      "email_norm",
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stripe webhook processing failed",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
