"use client";

import Image from "next/image";
import Link from "next/link";

export default function RefundPolicy() {
  const leftNav = ["ABOUT US", "CONTACT"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f6] text-[#1f232b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_12%,_rgba(38,70,151,0.08),_transparent_28%),radial-gradient(circle_at_100%_18%,_rgba(188,194,206,0.24),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f0f0f0_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#0e24d6] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-white sm:text-sm">
          Save over 40% compared to Soul Dial
        </div>

        {/* Header */}
        <header className="bg-white px-3 py-4 sm:px-4 sm:py-5">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <nav className="hidden items-center gap-5 text-xs font-medium uppercase tracking-[0.14em] text-[#1434d6] md:flex lg:gap-8 lg:text-sm">
            {leftNav.map((item) => (
              <a
                key={item}
                href={item === "CONTACT" ? "/#contact-form" : item === "ABOUT US" ? "/#about-us" : "#"}
                className="transition hover:text-[#091aa0]"
              >
                {item}
              </a>
            ))}
            </nav>

            <div className="flex flex-1 justify-center min-w-0">
              <Link href="/">
                <Image
                  src="/torq/logo-clear-bg.png"
                  alt="TORQ"
                  width={656}
                  height={236}
                  className="h-14 w-auto sm:h-16 md:h-20 lg:h-24"
                />
              </Link>
            </div>

            <div className="flex items-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1f232b] text-base leading-none text-[#1f232b] sm:h-10 sm:w-10 sm:text-lg">
                ◻
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-lg max-w-3xl mx-auto mt-12 prose-headings:text-[#20242b] prose-p:text-[#434b59] prose-a:text-[#1434d6] hover:prose-a:text-[#091aa0]">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#20242b] mb-4">
            MTG Life Counter Updater — Refund Policy
          </h1>

          <p className="text-sm font-semibold text-[#a2362d] mb-6">Important: All sales of software are final.</p>

          <p className="text-lg leading-8 text-[#434b59] mb-8">
            Because this product is software that can be copied and distributed electronically, we do
            not offer refunds for change-of-mind purchases. If you experience a technical problem
            that prevents the software from functioning as described, contact support and we will
            work with you to provide a remedy in accordance with applicable consumer law.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">Contact Us First</h2>
            <p>
              Before requesting a refund, please reach out to us so we can understand the issue and
              explore solutions together.
            </p>
            <p>
              <strong>Email:</strong> support@torq-lab.com
            </p>
            <p>
              Please include your order number, a description of the issue, and any relevant details
              about your setup or experience.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">Refunds for Software</h2>
            <p>
              Software purchases are non-refundable except where required by law (for example, if a
              consumer right in your jurisdiction mandates a refund for defective digital goods).
              Please contact <strong>support@torq-lab.com</strong> if you experience a technical
              issue and we will evaluate the appropriate remedy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">
              Technical Issues or Software Problems
            </h2>
            <p>
              If you experience technical issues, bugs, or compatibility problems, please contact us
              first. Many issues can be resolved through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Troubleshooting and diagnostic support</li>
              <li>Software updates or patches</li>
              <li>Device compatibility guidance</li>
              <li>Setup assistance and configuration help</li>
            </ul>
            <p>
              If the issue represents a genuine software defect covered by applicable consumer law,
              we will provide an appropriate remedy, which may include a replacement license, repair,
              refund, or other solution.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">Refund Processing</h2>
            <p>
              Once an approved refund has been authorized, we will process it back to your original
              payment method. Refund processing times vary depending on your payment provider and
              financial institution, typically 5-10 business days.
            </p>
            <p>
              Payment processing fees are non-refundable as required by law. In rare cases where
              refunds are issued due to customer request, a small processing fee may be deducted.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">Product Exclusions</h2>
            <p>
              This policy does not cover issues arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Misuse or improper use of the software</li>
              <li>Use on unsupported devices or operating systems</li>
              <li>Unauthorized modification or reverse engineering</li>
              <li>Failure to follow setup or installation instructions</li>
              <li>Third-party software conflicts or compatibility issues</li>
              <li>Normal wear and tear (for hardware components if applicable)</li>
            </ul>
            <p>
              We reserve the right to refuse a refund where the issue falls outside the scope of
              this policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">License Transfers</h2>
            <p>
              TORQ licenses are issued to a single user or device. Once activated, licenses cannot
              be transferred to a different user or device. If you wish to discontinue use on one
              device and activate on another, please contact us to discuss options.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#20242b] mt-8 mb-4">Questions</h2>
            <p>
              If you have any questions about your order, software issues, troubleshooting, or
              refund requests, please reach out before taking further action.
            </p>
            <p>
              <strong>Email:</strong> support@torq-lab.com
            </p>
          </section>

          <section className="border-t border-[#dde2ea] pt-8 mt-12">
            <p className="text-sm text-[#667086]">
              Last updated: May 2026 | For our full legal information, see our{" "}
              <Link href="/imprint" className="text-[#1434d6] hover:text-[#091aa0]">
                Imprint
              </Link>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
