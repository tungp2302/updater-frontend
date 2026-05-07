import { NextResponse } from "next/server";

import { LICENSE_MAX_DEVICES } from "@/lib/server/env";
import { createSignedUpdaterUrl } from "@/lib/server/updater-download";
import { supabaseSelect } from "@/lib/server/supabase";

type RequestBody = {
  email?: string;
};

type AccountRow = {
  account_id?: string | null;
  email_norm?: string | null;
  entitlement_active?: boolean | null;
  max_devices?: number | null;
  updated_at?: string | null;
  id?: string | null;
};

type PurchaseRow = {
  amount_total?: number | null;
  checkout_session_id?: string;
  created_at?: string | null;
  currency?: string | null;
  email?: string;
  payment_status?: string | null;
  stripe_customer_id?: string | null;
};

type DeviceRow = Record<string, unknown>;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getAccountIdentifier(account: AccountRow | null): string | null {
  if (!account) {
    return null;
  }

  return account.account_id || account.id || null;
}

function getDeviceName(device: DeviceRow, index: number): string {
  const candidates = [
    device.device_name,
    device.name,
    device.label,
    device.model,
    device.platform,
    device.device_id,
    device.id,
  ];

  for (const candidate of candidates) {
    const value = getString(candidate);

    if (value) {
      return value;
    }
  }

  return `Device ${index + 1}`;
}

function getDeviceStatus(device: DeviceRow): string {
  if (device.revoked_at) {
    return "Revoked";
  }

  if (device.is_active === false) {
    return "Inactive";
  }

  if (device.last_seen_at || device.updated_at) {
    return "Active now";
  }

  return "Active";
}

function getDeviceLastSeen(device: DeviceRow): string | null {
  return getString(device.last_seen_at) || getString(device.updated_at) || null;
}

function getPaymentLabel(paymentStatus: string | null | undefined, createdAt: string | null | undefined): string {
  const status = (paymentStatus || "").toLowerCase();

  if (status === "paid" || status === "complete") {
    return "verified";
  }

  if (status) {
    return status;
  }

  return createdAt ? "pending review" : "unknown";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as RequestBody | null;
    const email = payload?.email ? normalizeEmail(payload.email) : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const accountRows = await supabaseSelect<AccountRow[]>(
      "accounts",
      new URLSearchParams({
        email_norm: `eq.${email}`,
        limit: "1",
        select: "id,email_norm,entitlement_active,max_devices,updated_at",
      }),
    );
    const account = accountRows[0] ?? null;
    console.log("Account lookup for email:", email, "Result:", JSON.stringify(account, null, 2));

    const purchaseRows = await supabaseSelect<PurchaseRow[]>(
      "purchases",
      new URLSearchParams({
        email: `eq.${email}`,
        order: "created_at.desc",
        limit: "5",
        select: "checkout_session_id,amount_total,currency,created_at,payment_status,email,stripe_customer_id",
      }),
    );

    const accountId = getAccountIdentifier(account);
    console.log("Extracted accountId:", accountId);

    let devices: Array<{
      id: string;
      lastSeenAt: string | null;
      name: string;
      status: string;
    }> = [];

    if (accountId) {
      try {
        const deviceRows = await supabaseSelect<DeviceRow[]>(
          "account_devices",
          new URLSearchParams({
            account_id: `eq.${accountId}`,
            order: "last_seen_at.desc",
            select: "*",
          }),
        );
        console.log("Device lookup result:", JSON.stringify(deviceRows, null, 2));

        devices = deviceRows.map((device, index) => ({
          id: getString(device.device_id) || getString(device.id) || `${index}`,
          lastSeenAt: getDeviceLastSeen(device),
          name: getDeviceName(device, index),
          status: getDeviceStatus(device),
        }));
      } catch (error) {
        console.warn("Device lookup failed:", error);
      }
    } else {
      console.log("No accountId found - skipping device lookup");
    }

    const entitlementActive = getBoolean(account?.entitlement_active) ?? false;
    const maxDevices = getNumber(account?.max_devices) ?? LICENSE_MAX_DEVICES;
    const activeDeviceCount = devices.length;
    const remainingSlots = Math.max(maxDevices - activeDeviceCount, 0);
    const latestPurchase = purchaseRows[0] ?? null;
    const latestSessionId = latestPurchase?.checkout_session_id || null;
    const paymentStatus = latestPurchase?.payment_status || null;
    const verified = entitlementActive || getPaymentLabel(paymentStatus, latestPurchase?.created_at) === "verified";

    return NextResponse.json({
      accountEmail: email,
      activeDeviceCount,
      canDownload: verified,
      devices,
      downloadUrl: verified ? await createSignedUpdaterUrl() : null,
      entitlementActive,
      latestSessionId,
      maxDevices,
      message:
        verified
          ? "License verified. Download access is available."
          : "No active license found for this email yet.",
      paymentStatus: getPaymentLabel(paymentStatus, latestPurchase?.created_at),
      purchase: latestPurchase
        ? {
            amountTotal: latestPurchase.amount_total ?? null,
            createdAt: latestPurchase.created_at ?? null,
            currency: latestPurchase.currency ?? null,
            sessionId: latestPurchase.checkout_session_id || null,
          }
        : null,
      remainingSlots,
      verified,
    });
  } catch (error) {
    console.error("Account status lookup failed:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Account status lookup failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}