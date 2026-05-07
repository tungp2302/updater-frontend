import { NextResponse } from "next/server";

import { getAppBaseUrl } from "@/lib/server/env";
import { createStripeCheckoutSession } from "@/lib/server/stripe";

export async function POST(request: Request) {
  try {
    const appBaseUrl = getAppBaseUrl(request);
    const session = await createStripeCheckoutSession(appBaseUrl);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout session creation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
