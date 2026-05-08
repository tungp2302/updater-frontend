"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RefundPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leftNav = ["ABOUT US", "CONTACT"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06090d] text-[#e6edf6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_6%,_rgba(17,201,255,0.18),_transparent_25%),radial-gradient(circle_at_10%_25%,_rgba(36,93,206,0.18),_transparent_28%),linear-gradient(180deg,_#090f17_0%,_#05080d_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#11c9ff] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-[#06090d] sm:text-sm">
          Save over 40% compared to Soul Dial
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

        {/* Content */}
        <article className="prose prose-lg max-w-3xl mx-auto mt-12 prose-headings:text-[#11c9ff] prose-p:text-[#b9c5d8] prose-a:text-[#11c9ff] hover:prose-a:text-[#245dce]">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#e6edf6] mb-4">
            MTG Life Counter Updater — Refund Policy
          </h1>

          <p className="text-sm font-semibold text-[#ff6b6b] mb-6">Important: All sales of software are final.</p>

          <p className="text-lg leading-8 text-[#b9c5d8] mb-8">
            Because this product is software that can be copied and distributed electronically, we do
            not offer refunds for change-of-mind purchases. If you experience a technical problem
            that prevents the software from functioning as described, contact support and we will
            work with you to provide a remedy in accordance with applicable consumer law.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">Contact Us First</h2>
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
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">Refunds for Software</h2>
            <p>
              Software purchases are non-refundable except where required by law (for example, if a
              consumer right in your jurisdiction mandates a refund for defective digital goods).
              Please contact <strong>support@torq-lab.com</strong> if you experience a technical
              issue and we will evaluate the appropriate remedy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">
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
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">Refund Processing</h2>
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
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">Product Exclusions</h2>
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
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">License Transfers</h2>
            <p>
              TORQ licenses are issued to a single user or device. Once activated, licenses cannot
              be transferred to a different user or device. If you wish to discontinue use on one
              device and activate on another, please contact us to discuss options.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#11c9ff] mt-8 mb-4">Questions</h2>
            <p>
              If you have any questions about your order, software issues, troubleshooting, or
              refund requests, please reach out before taking further action.
            </p>
            <p>
              <strong>Email:</strong> support@torq-lab.com
            </p>
          </section>

          <section className="border-t border-[#1e2c3d] pt-8 mt-12">
            <div className="flex gap-6 flex-wrap justify-center text-sm mb-6">
              <Link href="/" className="text-[#11c9ff] hover:text-[#245dce]">
                Home
              </Link>
              <Link href="/imprint" className="text-[#11c9ff] hover:text-[#245dce]">
                Imprint
              </Link>
              <a href="mailto:support@torq-lab.com" className="text-[#11c9ff] hover:text-[#245dce]">
                Contact
              </a>
              <a
                href="https://www.instagram.com/torqlab.mtg/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#11c9ff] hover:text-[#245dce]"
              >
                Instagram
              </a>
            </div>
            <p className="text-sm text-[#667086]">
              Last updated: May 2026
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
