import { NextResponse } from "next/server";

import { LICENSE_MAX_DEVICES } from "@/lib/server/env";
import { supabaseRpc } from "@/lib/server/supabase";

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
    const resultRows = await supabaseRpc<ValidateAccessRow[]>("validate_updater_access", {
      p_account_email: normalizedEmail,
      p_device_id: deviceId,
      p_app_version: null,
      p_request_ip: getClientIp(request),
      p_user_agent: request.headers.get("user-agent"),
    });
    const result = resultRows[0];

    if (!result) {
      throw new Error("validate_updater_access returned no rows");
    }

    if (!result.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          reason: result.reason_code || "denied",
          message: result.message,
          maxDevices: result.max_devices ?? LICENSE_MAX_DEVICES,
          remainingSlots:
            result.max_devices === null || result.active_device_count === null
              ? 0
              : Math.max(result.max_devices - result.active_device_count, 0),
          slotsUsed: result.active_device_count ?? 0,
        },
        { status: 403 },
      );
    }

    return NextResponse.json({
      allowed: true,
      email: normalizedEmail,
      maxDevices: result.max_devices ?? LICENSE_MAX_DEVICES,
      remainingSlots:
        result.max_devices === null || result.active_device_count === null
          ? 0
          : Math.max(result.max_devices - result.active_device_count, 0),
      slotsUsed: result.active_device_count ?? 0,
      message: result.message,
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
