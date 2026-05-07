import { NextResponse } from "next/server";

import { LICENSE_MAX_DEVICES } from "@/lib/server/env";
import { supabaseSelect, supabaseUpdate, supabaseInsert } from "@/lib/server/supabase";

type ValidateAccessRow = {
  account_id: string | null;
  active_device_count: number | null;
  allowed: boolean;
  max_devices: number | null;
  message: string | null;
  reason_code: string | null;
};

type RequestBody = {
  appVersion?: string;
  deviceId?: string;
  email?: string;
};

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

async function getRequestBody(request: Request): Promise<RequestBody> {
  const parsed = (await request.json().catch(() => null)) as
    | { appVersion?: unknown; deviceId?: unknown; email?: unknown }
    | null;

  return {
    appVersion: typeof parsed?.appVersion === "string" ? parsed.appVersion.trim() : undefined,
    deviceId: typeof parsed?.deviceId === "string" ? parsed.deviceId.trim() : undefined,
    email: typeof parsed?.email === "string" ? parsed.email.trim() : undefined,
  };
}

function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (!forwardedFor) {
    return null;
  }

  return forwardedFor.split(",")[0]?.trim() || null;
}

export async function POST(request: Request) {
  try {
    const { deviceId, email } = await getRequestBody(request);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    // Find account by email
    const accountRows = await supabaseSelect<any[]>("accounts", new URLSearchParams({
      select: "id",
      email_norm: `eq.${normalizedEmail}`,
    }));

    const account = Array.isArray(accountRows) && accountRows.length ? accountRows[0] : null;

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const accountId = account.id as string;

    // Upsert device: update last_seen if exists, insert new row if not
    const now = new Date().toISOString();
    let isNewDevice = false;

    // Check if this device already exists
    const existingDevices = await supabaseSelect<any[]>("account_devices", new URLSearchParams({
      account_id: `eq.${accountId}`,
      device_id: `eq.${deviceId}`,
      select: "id",
    }));

    const deviceExists = Array.isArray(existingDevices) && existingDevices.length > 0;

    try {
      if (deviceExists) {
        const updateParams = new URLSearchParams({ account_id: `eq.${accountId}`, device_id: `eq.${deviceId}` });
        await supabaseUpdate("account_devices", { last_seen: now, device_name: request.headers.get("x-device-name") || null, revoked: false }, updateParams);
      } else {
        isNewDevice = true;
        await supabaseInsert("account_devices", {
          account_id: accountId,
          device_id: deviceId,
          device_name: request.headers.get("x-device-name") || null,
          first_seen: now,
          last_seen: now,
          revoked: false,
        });
      }
    } catch (err) {
      console.error("Failed to upsert device:", err);
    }

    // Count total non-revoked devices and update accounts table
    const allDevices = await supabaseSelect<any[]>("account_devices", new URLSearchParams({
      account_id: `eq.${accountId}`,
      revoked: `eq.false`,
      select: "id",
    }));

    const totalDeviceCount = Array.isArray(allDevices) ? allDevices.length : 0;

    // Update the accounts table with current device count
    if (isNewDevice) {
      try {
        await supabaseUpdate("accounts", { active_devices: totalDeviceCount }, new URLSearchParams({ id: `eq.${accountId}` }));
      } catch (err) {
        console.error("Failed to update device count:", err);
      }
    }

    // Check if total devices exceeds limit
    if (totalDeviceCount > LICENSE_MAX_DEVICES) {
      return NextResponse.json({
        allowed: false,
        reason: "device_limit",
        message: `Device limit exceeded (${totalDeviceCount} of ${LICENSE_MAX_DEVICES} devices registered)`,
        maxDevices: LICENSE_MAX_DEVICES,
        remainingSlots: 0,
        slotsUsed: totalDeviceCount,
      }, { status: 403 });
    }

    return NextResponse.json({
      allowed: true,
      email: normalizedEmail,
      maxDevices: LICENSE_MAX_DEVICES,
      remainingSlots: Math.max(LICENSE_MAX_DEVICES - totalDeviceCount, 0),
      slotsUsed: totalDeviceCount,
      message: `Updater access allowed. Registered devices: ${totalDeviceCount}/${LICENSE_MAX_DEVICES}${isNewDevice ? " (new device registered)" : ""}`,
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
