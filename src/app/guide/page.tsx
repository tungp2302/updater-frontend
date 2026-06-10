"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "ABOUT US", href: "/#about-us" },
  { label: "GUIDE", href: "/guide" },
  { label: "CONTACT", href: "/#contact-form" },
];

const installSteps = [
  {
    label: "1",
    title: "Download and unzip the updater package",
    copy:
      "After purchase, download the TORQ updater ZIP file and extract it to a normal folder on your Windows PC. Keep the updater app, flash tool, and ESP-IDF tools installer in the same extracted folder.",
  },
  {
    label: "2",
    title: "Connect the factory hardware by USB-C",
    copy:
      "Use a USB-C cable that supports data, not only charging. Plug the ESP32-S3 based device directly into your PC and wait a few seconds for Windows to detect it.",
  },
  {
    label: "3",
    title: "Prepare the device with the flash tool",
    copy:
      "Open the included flash tool first. Use it to erase the existing factory software and establish the COM port connection that the updater needs before installing TORQ.",
  },
  {
    label: "4",
    title: "Run the TORQ updater",
    copy:
      "Once the flash tool shows the device on a COM port, open the TORQ updater and follow the on-screen steps to install the latest TORQ software onto the hardware.",
  },
];

const troubleshootingItems = [
  "Try another USB-C cable and avoid USB hubs while flashing.",
  "Close the flash tool before running the updater if only one app can access the COM port.",
  "Reconnect the device after driver installation so Windows refreshes the COM port.",
  "Run the tools as administrator if Windows blocks driver or serial access.",
  "Restart your PC after installing the ESP-IDF drivers, then reopen the flash tool.",
  "Start the flash tool first, then unplug and replug the USB-C cable into the device — repeat a few times until the port appears.",
  'Open Device Manager and expand the "Connections (COM & LPT)" section — you should see "Serial USB-Device (COM*)" listed there once the device is recognised.',
];

function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    touchStartX.current = null;
  }

  return (
    <div className="mt-5 select-none">
      <div
        className="relative overflow-hidden rounded-xl border border-[#dde2ea] bg-[#f0f2f7]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow transition hover:bg-white"
              aria-label="Previous screenshot"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 13L5 8l5-5" stroke="#1f232b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow transition hover:bg-white"
              aria-label="Next screenshot"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="#1f232b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-[#1434d6]" : "w-1.5 bg-[#c5cad5]"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Guide() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f6] text-[#1f232b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_12%,_rgba(38,70,151,0.08),_transparent_28%),radial-gradient(circle_at_100%_18%,_rgba(188,194,206,0.24),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f0f0f0_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#0e24d6] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-white sm:text-sm">
          TORQ updater setup guide
        </div>

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
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-[#091aa0]">
                {item.label}
              </Link>
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

        {mobileMenuOpen && (
          <div className="bg-white px-3 py-3 md:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-[0.12em] text-[#1434d6] transition hover:text-[#091aa0]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <article className="mx-auto mt-10 w-full max-w-5xl sm:mt-14">
          <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-[#d5d8df] bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#667086]">
                Setup guide
              </p>
              <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#20242b] sm:text-5xl">
                Install TORQ on the factory ESP32-S3 hardware
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#434b59] sm:text-lg sm:leading-8">
                This guide walks you through preparing the base factory device, setting up the
                correct ESP32-S3 drivers when needed, and using the updater to flash TORQ onto the
                hardware.
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:p-6">
              <h2 className="text-lg font-bold text-[#20242b]">What is included in the ZIP</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#434b59]">
                <p>
                  <strong>TORQ updater:</strong> installs the TORQ software after the device is
                  prepared.
                </p>
                <p>
                  <strong>Flash tool:</strong> erases the existing factory software and opens the
                  COM port connection.
                </p>
                <p>
                  <strong>esp-idf-tools-setup...exe:</strong> installs ESP-IDF 5.5.4 and the
                  correct ESP32-S3 USB drivers if Windows does not recognize the hardware.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:mt-12 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                  Before you start
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
                  Use Windows and connect over USB-C
                </h2>
              </div>
              <Link
                href="/account"
                className="inline-flex w-fit items-center justify-center rounded-lg bg-[#1434d6] px-4 py-2 text-sm font-bold uppercase tracking-[0.04em] text-white transition hover:bg-[#0f2cbd]"
              >
                Download updater
              </Link>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
              The tools included in the updater package are Windows executables. Start with the
              flash tool. Only run the ESP-IDF tools installer if the flash tool cannot see the
              device or no usable COM port appears.
            </p>
          </section>

          <section className="mt-10 sm:mt-12">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                Recommended path
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
                Install in four steps
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {installSteps.map((step) => (
                <div
                  key={step.label}
                  className="rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1434d6] text-sm font-extrabold text-white">
                    {step.label}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#20242b]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#434b59]">{step.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-2 sm:mt-12">
            <div className="rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                Driver fallback
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
                If the hardware is not detected
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
                Run the included <strong>esp-idf-tools-setup...exe</strong> installer and select
                ESP-IDF version <strong>5.5.4</strong>. This installs the toolchain and drivers
                needed for ESP32-S3 devices so Windows can expose the connected hardware as a COM
                port.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
                After installation, unplug the device, plug it back in, then reopen the flash tool
                and check the COM port list again.
              </p>
              <ImageCarousel
                images={[
                  "/guide_sc/esp1.png",
                  "/guide_sc/esp2.png",
                  "/guide_sc/esp3.png",
                  "/guide_sc/esp4.png",
                  "/guide_sc/esp5.png",
                  "/guide_sc/esp6.png",
                  "/guide_sc/esp7.png",
                ]}
                alt="ESP driver installation step"
              />
            </div>

            <div className="rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                Flash preparation
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
                Erase factory software first
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
                The factory firmware must be removed before TORQ is installed. Use the included
                flash tool for this step, confirm that the correct COM port is selected, and let the
                erase process complete before opening the TORQ updater.
              </p>
              <p className="mt-4 text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
                Do not unplug the device while erase or install operations are running.
              </p>
              <ImageCarousel
                images={[
                  "/guide_sc/flash1.png",
                  "/guide_sc/flash2.png",
                  "/guide_sc/flash3.png",
                ]}
                alt="Flash tool step"
              />
            </div>
          </section>

          <section className="mt-10 rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:mt-12 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
              Updater usage
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
              Using the TORQ updater
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
              Open the TORQ updater after the flash tool has finished erasing the factory software.
              The updater works in three steps:
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-[#434b59] sm:text-base sm:leading-8">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1434d6] text-xs font-bold text-white">1</span>
                <span>
                  <strong>Enter your purchasing email.</strong> This is the email address used at
                  checkout. You can look it up any time on the{" "}
                  <Link href="/account" className="text-[#1434d6] underline hover:text-[#091aa0]">
                    license dashboard page
                  </Link>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1434d6] text-xs font-bold text-white">2</span>
                <span>
                  <strong>Select the COM port.</strong> Choose the port the device is connected to
                  from the dropdown — this is the same port shown in the flash tool.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1434d6] text-xs font-bold text-white">3</span>
                <span>
                  <strong>Click Update Firmware.</strong> The updater downloads and flashes the
                  latest TORQ release. Keep the device connected until the progress bar completes
                  and a success message appears.
                </span>
              </li>
            </ol>
            <ImageCarousel
              images={[
                "/guide_sc/updater1.png",
                "/guide_sc/updater2.png",
                "/guide_sc/updater3.png",
              ]}
              alt="TORQ updater step"
            />
          </section>

          <section className="mt-10 rounded-[1.2rem] border border-[#dde2ea] bg-white p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] sm:mt-12 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
              Troubleshooting
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#20242b]">
              If the COM port still does not appear
            </h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-[#434b59] sm:text-base md:grid-cols-2">
              {troubleshootingItems.map((item) => (
                <li key={item} className="rounded-lg border border-[#dde2ea] bg-[#f8f9fc] p-4">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <footer className="mt-12 border-t border-[#dde2ea] pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/" className="text-[#1434d6] hover:text-[#091aa0]">
                Home
              </Link>
              <Link href="/imprint" className="text-[#1434d6] hover:text-[#091aa0]">
                Imprint
              </Link>
              <Link href="/refund-policy" className="text-[#1434d6] hover:text-[#091aa0]">
                Refund Policy
              </Link>
              <a href="mailto:support@torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0]">
                Contact
              </a>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
