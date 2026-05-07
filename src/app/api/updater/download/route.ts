import { NextResponse } from "next/server";

import { supabaseSelect } from "@/lib/server/supabase";

type RequestBody = {
  email?: string;
  sessionId?: string;
};

type PurchaseRow = {
  checkout_session_id: string;
  email: string;
  payment_status: string;
};

type SignedUrlResponse = {
  signedURL?: string;
  signedUrl?: string;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function createSignedUpdaterUrl(): Promise<string> {
  const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = requiredEnv("UPDATER_ZIP_BUCKET");
  const objectPath = requiredEnv("UPDATER_ZIP_OBJECT_PATH");
  const expiresInSeconds = Number(process.env.UPDATER_ZIP_SIGNED_URL_TTL_SECONDS || 300);
  const safePath = objectPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  const response = await fetch(`${supabaseUrl}/storage/v1/object/sign/${bucket}/${safePath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expiresIn: Number.isFinite(expiresInSeconds) ? Math.max(60, expiresInSeconds) : 300,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to create signed updater URL");
  }

  const payload = text ? (JSON.parse(text) as SignedUrlResponse) : {};
  const signedPath = payload.signedURL || payload.signedUrl;

  if (!signedPath) {
    throw new Error("Supabase did not return a signed URL");
  }

  if (signedPath.startsWith("http://") || signedPath.startsWith("https://")) {
    return signedPath;
  }

  return `${supabaseUrl}${signedPath}`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as RequestBody | null;
    const email = payload?.email ? normalizeEmail(payload.email) : "";
    const sessionId = payload?.sessionId?.trim() || "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Checkout session ID is required" }, { status: 400 });
    }

    const rows = await supabaseSelect<PurchaseRow[]>(
      "purchases",
      new URLSearchParams({
        checkout_session_id: `eq.${sessionId}`,
        email: `eq.${email}`,
        limit: "1",
        select: "checkout_session_id,email,payment_status",
      }),
    );
    const purchase = rows[0];

    if (!purchase) {
      return NextResponse.json(
        {
          error: "No matching paid checkout found for this email and session",
        },
        { status: 403 },
      );
    }

    const status = (purchase.payment_status || "").toLowerCase();

    if (status !== "paid" && status !== "complete") {
      return NextResponse.json(
        {
          error: "Payment is not confirmed yet",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      ok: true,
      url: await createSignedUpdaterUrl(),
    });
  } catch (error) {
    console.error("Download authorization failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Download authorization failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
