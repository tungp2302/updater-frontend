import { NextResponse } from "next/server";

import { LICENSE_MAX_DEVICES } from "@/lib/server/env";
import { supabaseInsert, supabaseSelect, supabaseUpdate } from "@/lib/server/supabase";

type EntitlementRow = {
  active: boolean;
  email: string;
  last_checkout_session_id: string | null;
  max_devices: number;
  stripe_customer_id: string | null;
  updated_at: string;
};

type DeviceActivationRow = {
  device_id: string;
  email: string;
  first_seen_at: string;
  last_seen_at: string;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

async function getRequestBody(request: Request): Promise<{ deviceId?: string; email?: string }> {
  const parsed = (await request.json().catch(() => null)) as
    | { deviceId?: unknown; email?: unknown }
    | null;

  return {
    deviceId: typeof parsed?.deviceId === "string" ? parsed.deviceId.trim() : undefined,
    email: typeof parsed?.email === "string" ? parsed.email.trim() : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const { deviceId, email } = await getRequestBody(request);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const entitlementRows = await supabaseSelect<EntitlementRow[]>(
      "entitlements",
      new URLSearchParams({
        email: `eq.${normalizedEmail}`,
        limit: "1",
        select: "email,active,max_devices,last_checkout_session_id,stripe_customer_id,updated_at",
      }),
    );
    const entitlement = entitlementRows[0];

    if (!entitlement || !entitlement.active) {
      return NextResponse.json(
        {
          allowed: false,
          reason: "no_active_purchase",
          remainingSlots: 0,
        },
        { status: 403 },
      );
    }

    const activationRows = await supabaseSelect<DeviceActivationRow[]>(
      "device_activations",
      new URLSearchParams({
        email: `eq.${normalizedEmail}`,
        select: "device_id,email,first_seen_at,last_seen_at",
      }),
    );
    const registeredDevice = deviceId
      ? activationRows.find((row) => row.device_id === deviceId)
      : undefined;

    if (deviceId && registeredDevice && registeredDevice.email !== normalizedEmail) {
      return NextResponse.json(
        {
          allowed: false,
          reason: "device_assigned_elsewhere",
          remainingSlots: Math.max(entitlement.max_devices - activationRows.length, 0),
        },
        { status: 403 },
      );
    }

    if (deviceId && !registeredDevice && activationRows.length >= entitlement.max_devices) {
      return NextResponse.json(
        {
          allowed: false,
          reason: "device_limit_reached",
          remainingSlots: 0,
        },
        { status: 403 },
      );
    }

    if (deviceId) {
      if (registeredDevice) {
        await supabaseUpdate(
          "device_activations",
          {
            last_seen_at: new Date().toISOString(),
          },
          new URLSearchParams({ device_id: `eq.${deviceId}` }),
        );
      } else {
        await supabaseInsert("device_activations", {
          device_id: deviceId,
          email: normalizedEmail,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        });
      }
    }

    const usedSlots = deviceId && !registeredDevice ? activationRows.length + 1 : activationRows.length;

    return NextResponse.json({
      allowed: true,
      email: normalizedEmail,
      maxDevices: entitlement.max_devices ?? LICENSE_MAX_DEVICES,
      remainingSlots: Math.max(entitlement.max_devices - usedSlots, 0),
      slotsUsed: usedSlots,
    });
  } catch (error) {
    console.error("Updater validation failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Updater validation failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
