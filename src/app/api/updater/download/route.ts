import { NextResponse } from "next/server";

import { createSignedUpdaterUrl } from "@/lib/server/updater-download";
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

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
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
