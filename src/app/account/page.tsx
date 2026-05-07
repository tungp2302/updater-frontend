"use client";

import { useState } from "react";
import Link from "next/link";

type AccountDevice = {
  id: string;
  lastSeenAt: string | null;
  name: string;
  status: string;
};

type AccountStatus = {
  accountEmail: string;
  activeDeviceCount: number;
  canDownload: boolean;
  devices: AccountDevice[];
  downloadUrl: string | null;
  entitlementActive: boolean;
  latestSessionId: string | null;
  maxDevices: number;
  message: string;
  paymentStatus: string;
  purchase: {
    amountTotal: number | null;
    createdAt: string | null;
    currency: string | null;
    sessionId: string | null;
  } | null;
  remainingSlots: number;
  verified: boolean;
};

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AccountStatus | null>(null);

  const lookupStatus = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/account/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as AccountStatus & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Could not look up account status");
      }

      setStatus(payload);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "Account lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#1f232b]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="rounded-none bg-[#0e24d6] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-white sm:text-sm">
          License dashboard for TORQ updater buyers
        </div>

        <section className="mt-4 rounded-[1.5rem] border border-[#dde2ea] bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:mt-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
              Account
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#20242b] sm:text-4xl">
              Your license dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
              Enter the email used at checkout to verify your license, see your active devices, and
              unlock the updater download if your purchase is confirmed.
            </p>
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-[#e2e5eb] bg-[#fbfbfc] p-4 sm:p-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]" htmlFor="account-email">
              Email address
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 flex-1 rounded-xl border border-[#d6dbe3] bg-white px-4 text-sm text-[#1f232b] outline-none focus:border-[#1434d6]"
              />
              <button
                type="button"
                onClick={lookupStatus}
                disabled={loading}
                className="h-11 rounded-xl bg-[#1434d6] px-5 text-sm font-semibold text-white transition hover:bg-[#0f2cbd] disabled:opacity-70"
              >
                {loading ? "Looking up..." : "Check status"}
              </button>
            </div>

            {error ? <p className="mt-3 text-sm font-medium text-[#a2362d]">{error}</p> : null}
            {status ? <p className="mt-3 text-sm font-medium text-[#1f5a2f]">{status.message}</p> : null}
          </div>

          {status ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                  Purchase status
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#20242b]">
                  {status.verified ? "Paid and verified" : "Not verified"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5462]">
                  Order email: <span className="font-semibold text-[#20242b]">{status.accountEmail}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4b5462]">
                  Payment status: <span className="font-semibold text-[#20242b]">{status.paymentStatus}</span>
                </p>
                {status.purchase ? (
                  <p className="mt-1 text-sm leading-6 text-[#4b5462]">
                    Checkout session: <span className="font-semibold text-[#20242b]">{status.purchase.sessionId || "N/A"}</span>
                  </p>
                ) : null}
              </article>

              <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                  Entitlement
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#20242b]">
                  {status.entitlementActive ? "Active license" : "Inactive license"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5462]">Max devices: {status.maxDevices}</p>
                <p className="mt-1 text-sm leading-6 text-[#4b5462]">Devices used: {status.activeDeviceCount}</p>
                <p className="mt-1 text-sm leading-6 text-[#4b5462]">Remaining slots: {status.remainingSlots}</p>
              </article>

              <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                  Download access
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#20242b]">Re-download updater ZIP</h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5462]">
                  Download the latest Windows updater build from your private Supabase bucket link.
                </p>
                {status.downloadUrl ? (
                  <a
                    href={status.downloadUrl}
                    className="mt-4 inline-flex rounded-full bg-[#1434d6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2cbd]"
                  >
                    Download updater ZIP
                  </a>
                ) : (
                  <p className="mt-4 text-sm font-medium text-[#667086]">
                    Download is available after verification.
                  </p>
                )}
              </article>

              <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                  Device management
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#20242b]">Registered devices</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[#4b5462]">
                  {status.devices.length ? (
                    status.devices.map((device) => (
                      <li
                        key={device.id}
                        className="rounded-xl border border-[#e2e5eb] bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#20242b]">{device.name}</p>
                            <p>{device.status}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#1434d6]">Device</span>
                        </div>
                        {device.lastSeenAt ? (
                          <p className="mt-2 text-xs text-[#667086]">Last seen: {device.lastSeenAt}</p>
                        ) : null}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-[#d6dbe3] bg-white px-3 py-4 text-[#667086]">
                      No devices are registered yet.
                    </li>
                  )}
                </ul>
              </article>
            </div>
          ) : null}

          <div className="mt-8 rounded-[1.3rem] border border-[#dde2ea] bg-[#f9fafc] p-5">
            <h2 className="text-lg font-bold text-[#20242b]">Support</h2>
            <p className="mt-2 text-sm leading-6 text-[#4b5462]">
              Need help with activation, downloads, or device slots? Contact support or review the
              refund policy.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/refund-policy" className="text-[#1434d6] underline">
                Refund policy
              </Link>
              <a href="mailto:support@torq-lab.com" className="text-[#1434d6] underline">
                support@torq-lab.com
              </a>
            </div>
            <p className="mt-4 text-xs font-medium text-[#667086]">
              Windows only for now. macOS support is coming soon.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}