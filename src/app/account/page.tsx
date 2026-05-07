import Link from "next/link";

const devices = [
  { name: "Windows Desktop", status: "Active now" },
  { name: "MacBook Pro", status: "Available later" },
];

export default function AccountPage() {
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
              Use this page to check purchase status, re-download your updater, and manage the
              devices tied to your license. Enter the email you used at checkout to look up your
              entitlement.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                Purchase status
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#20242b]">Paid and verified</h2>
              <p className="mt-2 text-sm leading-6 text-[#4b5462]">
                Order email: <span className="font-semibold text-[#20242b]">you@example.com</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-[#4b5462]">
                Stripe session: <span className="font-semibold text-[#20242b]">cs_test_123</span>
              </p>
            </article>

            <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                Entitlement
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#20242b]">Active license</h2>
              <p className="mt-2 text-sm leading-6 text-[#4b5462]">Max devices: 4</p>
              <p className="mt-1 text-sm leading-6 text-[#4b5462]">Devices used: 1</p>
              <p className="mt-1 text-sm leading-6 text-[#4b5462]">Remaining slots: 3</p>
            </article>

            <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                Download access
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#20242b]">Re-download updater ZIP</h2>
              <p className="mt-2 text-sm leading-6 text-[#4b5462]">
                Download the latest Windows updater build from your private license link anytime.
              </p>
              <Link
                href="/#purchase"
                className="mt-4 inline-flex rounded-full bg-[#1434d6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2cbd]"
              >
                Get download
              </Link>
            </article>

            <article className="rounded-[1.3rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                Device management
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#20242b]">Registered devices</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[#4b5462]">
                {devices.map((device) => (
                  <li key={device.name} className="flex items-center justify-between gap-4 rounded-xl border border-[#e2e5eb] bg-white px-3 py-2">
                    <div>
                      <p className="font-semibold text-[#20242b]">{device.name}</p>
                      <p>{device.status}</p>
                    </div>
                    <button type="button" className="text-xs font-semibold text-[#1434d6]">
                      Revoke
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          </div>

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