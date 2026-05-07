"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Imprint() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const leftNav = ["ABOUT US", "CONTACT"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f6] text-[#1f232b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_12%,_rgba(38,70,151,0.08),_transparent_28%),radial-gradient(circle_at_100%_18%,_rgba(188,194,206,0.24),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f0f0f0_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 pt-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#0e24d6] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-white sm:text-sm">
          Everything you need for Commander nights
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-2 bg-white px-3 py-3 sm:px-4 sm:py-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 text-[#1f232b] md:hidden"
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

          <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.14em] text-[#1434d6] sm:gap-8 sm:text-sm md:flex">
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

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/account"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1f232b] text-[#1f232b] transition hover:border-[#1434d6] hover:text-[#1434d6] sm:h-10 sm:w-10 sm:text-lg"
              aria-label="Open account dashboard"
            >
              <span className="text-sm leading-none sm:text-lg">⌂</span>
            </Link>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white px-3 py-3 md:hidden">
            <nav className="flex flex-col gap-3">
              {leftNav.map((item) => (
                <a
                  key={item}
                  href={item === "CONTACT" ? "/#contact-form" : item === "ABOUT US" ? "/#about-us" : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.12em] text-[#1434d6] transition hover:text-[#091aa0]"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        {/* Content */}
        <article className="max-w-3xl mx-auto mt-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#20242b] mb-8">Imprint</h1>

          <section className="bg-white rounded-[2rem] border border-[#dde2ea] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 mb-8 space-y-8">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Business Information</h2>
              <div className="space-y-2 text-[#434b59]">
                <p>
                  <strong>Company Name:</strong> TORQ Labs
                </p>
                <p>
                  <strong>Business Type:</strong> Software Developer & Digital Product Provider
                </p>
                <p>
                  <strong>Registered in:</strong> Germany
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Contact Details</h2>
              <div className="space-y-2 text-[#434b59]">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0]">
                    support@torq-lab.com
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href="https://torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0]">
                    torq-lab.com
                  </a>
                </p>
              </div>
            </div>

            {/* Responsibility */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Responsibility for Content</h2>
              <p className="text-[#434b59] leading-7">
                We make every effort to keep the information on this website accurate, current, and
                complete. However, we do not accept liability for the accuracy or completeness of
                information provided on this site or for the content of external websites linked from
                this site.
              </p>
              <p className="text-[#434b59] leading-7 mt-4">
                Responsibility for linked content lies solely with the respective operators of those
                websites. We are not responsible for the availability, accuracy, or legal compliance
                of external sites.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Intellectual Property</h2>
              <p className="text-[#434b59] leading-7">
                All content on this website, including text, graphics, logos, images, and software, is
                the property of TORQ Labs or its content suppliers and is protected by international
                copyright laws.
              </p>
              <p className="text-[#434b59] leading-7 mt-4">
                You may not copy, reproduce, transmit, or distribute any content from this website
                without express written permission from TORQ Labs, except as permitted by applicable
                law.
              </p>
            </div>

            {/* Liability Disclaimer */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Disclaimer of Warranties</h2>
              <p className="text-[#434b59] leading-7">
                This website and all content are provided on an &quot;as-is&quot; basis. TORQ Labs makes no
                warranties, express or implied, regarding the website or content, including
                warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-[#434b59] leading-7 mt-4">
                To the maximum extent permitted by law, TORQ Labs shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of or
                inability to use this website or its content.
              </p>
            </div>

            {/* Data Protection */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Data Protection & Privacy</h2>
              <p className="text-[#434b59] leading-7">
                We are committed to protecting your personal data in accordance with the General Data
                Protection Regulation (GDPR) and other applicable data protection laws.
              </p>
              <p className="text-[#434b59] leading-7 mt-4">
                For detailed information about how we collect, process, and protect your data, please
                refer to our Privacy Policy.
              </p>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-bold text-[#20242b] mb-4">Questions or Concerns</h2>
              <p className="text-[#434b59] leading-7">
                For any enquiries relating to TORQ, orders, support, legal matters, or any other
                business concerns, please contact us using the details above.
              </p>
              <p className="text-[#434b59] leading-7 mt-4">
                <strong>Email:</strong>{" "}
                <a href="mailto:support@torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0]">
                  support@torq-lab.com
                </a>
              </p>
            </div>
          </section>

          {/* Footer Links */}
          <div className="border-t border-[#dde2ea] pt-8 flex gap-6 flex-wrap justify-center text-sm">
            <Link href="/" className="text-[#1434d6] hover:text-[#091aa0]">
              Home
            </Link>
            <Link href="/refund-policy" className="text-[#1434d6] hover:text-[#091aa0]">
              Refund Policy
            </Link>
            <a href="mailto:support@torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0]">
              Contact
            </a>
          </div>

          <p className="text-center text-xs text-[#667086] mt-8">
            Last updated: May 2026
          </p>
        </article>
      </div>
    </main>
  );
}
