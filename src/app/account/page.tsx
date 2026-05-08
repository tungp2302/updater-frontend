"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const leftNav = ["ABOUT US", "CONTACT"];

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
    <main className="relative min-h-screen overflow-hidden bg-[#06090d] text-[#e6edf6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_6%,_rgba(17,201,255,0.18),_transparent_25%),radial-gradient(circle_at_10%_25%,_rgba(36,93,206,0.18),_transparent_28%),linear-gradient(180deg,_#090f17_0%,_#05080d_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#11c9ff] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-[#06090d] sm:text-sm">
          License dashboard for TORQ updater buyers
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-2 bg-[#101722] border-b border-[#1e2c3d] px-3 py-3 sm:px-4 sm:py-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 text-[#e6edf6] md:hidden"
            aria-label="Toggle menu"
          >
            <div className="h-0.5 w-6 bg-current" />
            <div className="h-0.5 w-6 bg-current" />
            <div className="h-0.5 w-6 bg-current" />
          </button>

          <div className="flex flex-1 justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link href="/">
              <Image
                src="/torq/logo-clear-bg.png"
                alt="TORQ"
                width={656}
                height={236}
                className="h-16 w-auto sm:h-20 md:h-[126px]"
                loading="eager"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.14em] text-[#11c9ff] sm:gap-8 sm:text-sm md:flex">
            {leftNav.map((item) => (
              <a
                key={item}
                href={item === "CONTACT" ? "/#contact-form" : item === "ABOUT US" ? "/#about-us" : "#"}
                className="transition hover:text-[#245dce]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/account"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b9c5d8] text-[#e6edf6] transition hover:border-[#11c9ff] hover:text-[#11c9ff] sm:h-10 sm:w-10 sm:text-lg"
              aria-label="Open account dashboard"
            >
              <span className="text-sm leading-none sm:text-lg">⌂</span>
            </Link>
          </div>
        </header>

        <section className="mt-4 rounded-[1.5rem] border border-[#1e2c3d] bg-[#101722] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.3)] sm:mt-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9c5d8]">
              Account
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#e6edf6] sm:text-4xl">
              Your license dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b9c5d8] sm:text-base sm:leading-8">
              Enter the email used at checkout to verify your license, see your active devices, and
              unlock the updater download if your purchase is confirmed.
            </p>
          </div>

            <div className="mt-6 rounded-[1.25rem] border border-[#1e2c3d] bg-[#0f1419] p-4 sm:p-5">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#b9c5d8]" htmlFor="account-email">
              Email address
            </label>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await lookupStatus();
              }}
            >
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-11 flex-1 rounded-xl border border-[#1e2c3d] bg-[#0f1419] px-4 text-sm text-[#e6edf6] placeholder-[#7a8797] outline-none focus:border-[#11c9ff]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 rounded-xl bg-[#11c9ff] px-5 text-sm font-semibold text-[#06090d] transition hover:bg-[#00bbf0] disabled:opacity-70"
                >
                  {loading ? "Looking up..." : "Check status"}
                </button>
              </div>
            </form>

            {error ? <p className="mt-3 text-sm font-medium text-[#ff6b6b]">{error}</p> : null}
            {status ? <p className="mt-3 text-sm font-medium text-[#51cf66]">{status.message}</p> : null}
          </div>

          {status ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.3rem] border border-[#1e2c3d] bg-[#0f1419] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9c5d8]">
                  Purchase status
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#11c9ff]">
                  {status.verified ? "Paid and verified" : "Not verified"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#b9c5d8]">
                  Order email: <span className="font-semibold text-[#e6edf6]">{status.accountEmail}</span>
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4b5462]">
                  Payment status: <span className="font-semibold text-[#e6edf6]">{status.paymentStatus}</span>
                </p>
                {status.purchase ? (
                  <p className="mt-1 text-sm leading-6 text-[#4b5462]">
                    Checkout session: <span className="font-semibold text-[#e6edf6]">{status.purchase.sessionId || "N/A"}</span>
                  </p>
                ) : null}
              </article>

              <article className="rounded-[1.3rem] border border-[#1e2c3d] bg-[#0f1419] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9c5d8]">
                  Entitlement
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#11c9ff]">
                  {status.entitlementActive ? "Active license" : "Inactive license"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#b9c5d8]">Max devices: {status.maxDevices}</p>
                <p className="mt-1 text-sm leading-6 text-[#b9c5d8]">Devices used: {status.activeDeviceCount}</p>
                <p className="mt-1 text-sm leading-6 text-[#b9c5d8]">Remaining slots: {status.remainingSlots}</p>
              </article>

              <article className="rounded-[1.3rem] border border-[#1e2c3d] bg-[#0f1419] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9c5d8]">
                  Download access
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#11c9ff]">Re-download updater ZIP</h2>
                <p className="mt-2 text-sm leading-6 text-[#b9c5d8]">
                  Download the latest Windows updater build from your private Supabase bucket link.
                </p>
                {status.downloadUrl ? (
                  <a
                    href={status.downloadUrl}
                    className="mt-4 inline-flex rounded-full bg-[#11c9ff] px-4 py-2 text-sm font-semibold text-[#06090d] transition hover:bg-[#00bbf0]"
                  >
                    Download updater ZIP
                  </a>
                ) : (
                  <p className="mt-4 text-sm font-medium text-[#b9c5d8]">
                    Download is available after verification.
                  </p>
                )}
              </article>

              <article className="rounded-[1.3rem] border border-[#1e2c3d] bg-[#0f1419] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9c5d8]">
                  Device management
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#11c9ff]">Registered devices</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[#b9c5d8]">
                  {status.devices.length ? (
                    status.devices.map((device) => (
                      <li
                        key={device.id}
                        className="rounded-xl border border-[#1e2c3d] bg-[#0f1419] px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#e6edf6]">{device.name}</p>
                            <p>{device.status}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#11c9ff]">Device</span>
                        </div>
                        {device.lastSeenAt ? (
                          <p className="mt-2 text-xs text-[#8a9aaa]">Last seen: {device.lastSeenAt}</p>
                        ) : null}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-[#1e2c3d] bg-[#0f1419] px-3 py-4 text-[#8a9aaa]">
                      No devices are registered yet.
                    </li>
                  )}
                </ul>
              </article>
            </div>
          ) : null}

          <div className="mt-8 rounded-[1.3rem] border border-[#1e2c3d] bg-[#0f1419] p-5">
            <h2 className="text-lg font-bold text-[#e6edf6]">Support</h2>
            <p className="mt-2 text-sm leading-6 text-[#b9c5d8]">
              Need help with activation, downloads, or device slots? Contact support or review the
              refund policy.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/refund-policy" className="text-[#11c9ff] underline">
                Refund policy
              </Link>
              <a href="mailto:support@torq-lab.com" className="text-[#11c9ff] underline">
                support@torq-lab.com
              </a>
              <a
                href="https://www.instagram.com/torqlab.mtg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#11c9ff] underline"
              >
                Instagram
              </a>
            </div>
            <p className="mt-4 text-xs font-medium text-[#8a9aaa]">
              Windows only for now. macOS support is coming soon.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}