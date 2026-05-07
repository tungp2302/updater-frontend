"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const packs = [
  {
    name: "Updater License",
    price: "€10",
    subtitle: "One-time payment",
    details: "For max of 4 devices always up to date with the newest version",
  },
];

type HeroSlide =
  | {
      kind: "image";
      src: string;
      title: string;
    }
  | {
      kind: "video";
      title: string;
    };

const heroSlides: HeroSlide[] = [
  {
    kind: "image",
    src: "/torq/mock-logo.png",
    title: "Mock logo",
  },
  {
    kind: "image",
    src: "/torq/torq-players-modes.png",
    title: "Players modes",
  },
  {
    kind: "image",
    src: "/torq/functions.png",
    title: "Functions",
  },
  {
    kind: "image",
    src: "/torq/torq-led-warning.png",
    title: "LED",
  },
  {
    kind: "video",
    title: "Gameplay video slot",
  },
  {
    kind: "video",
    title: "Feature walkthrough slot",
  },
];

const leftNav = ["ABOUT US", "CONTACT"];
const rightNav: string[] = [];

const featureCards = [
  {
    label: "Overview",
    title: "A dedicated tabletop controller for Commander nights",
    copy:
      "TORQ replaces phone juggling with a single purpose-built device that keeps life totals, turn flow, and table state in one place.",
  },
  {
    label: "Commander pod",
    title: "Designed around the way a pod actually plays",
    copy:
      "Fast life adjustments, multiplayer-friendly layouts, and shared visibility make it feel tuned for four-player tables from the start.",
  },
  {
    label: "Interface",
    title: "A clear round screen with tactile control",
    copy:
      "The display stays readable across the table while the dial gives you quick, physical input without breaking focus.",
  },
  {
    label: "Keep the game moving",
    title: "Built to reduce pauses and repeated questions",
    copy:
      "History, undo support, and fast counters help you settle changes quickly so the table stays on the game instead of the app.",
  },
  {
    label: "Hardware specs",
    title: "Premium internals for long sessions",
    copy:
      "Machined enclosure, high-brightness display, BLE connectivity, USB-C power, and all-night tabletop reliability.",
  },
  {
    label: "Extras",
    title: "LED strip and speaker built in",
    copy:
      "An integrated LED strip adds visual status cues, and the onboard speaker handles alerts, timers, and turn notifications.",
  },
];

const motionItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const slideWidth = carousel.clientWidth + 16;
    carousel.scrollBy({
      left: slideWidth * direction,
      behavior: "smooth",
    });
  };

  const startCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const payload = (await response.json()) as { url?: string };

      if (!payload.url) {
        throw new Error("Checkout URL was missing from the server response");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout unavailable right now");
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f6f6] text-[#1f232b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_7%_12%,_rgba(38,70,151,0.08),_transparent_28%),radial-gradient(circle_at_100%_18%,_rgba(188,194,206,0.24),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f0f0f0_100%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-[#cfd7e5]/40 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[-6rem] top-32 h-80 w-80 rounded-full bg-[#d9dde3]/50 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-none bg-[#0e24d6] px-4 py-1.5 text-center text-xs font-semibold tracking-[0.02em] text-white sm:text-sm">
          Save over 40% compared to Soul Dial
        </div>

        <header className="flex items-center justify-between gap-4 bg-white px-2 py-5 sm:px-4">
          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.14em] text-[#1434d6] md:flex">
            {leftNav.map((item) => (
              <a
                key={item}
                href={item === "CONTACT" ? "#contact-form" : item === "ABOUT US" ? "#about-us" : "#"}
                className="transition hover:text-[#091aa0]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex flex-1 justify-center md:absolute md:left-1/2 md:-translate-x-1/2 md:justify-center">
            <Image
              src="/torq/logo-clear-bg.png"
              alt="TORQ"
              width={656}
              height={236}
              className="h-28 w-auto sm:h-[126px]"
              loading="eager"
              priority
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-[0.14em] text-[#1434d6] md:flex">
              {rightNav.map((item) => (
                <a key={item} href="#" className="transition hover:text-[#091aa0]">
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f232b] text-[#1f232b]">
              <span className="text-lg leading-none">◻</span>
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-14">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
            className="max-w-2xl"
          >
            <motion.p
              variants={motionItem}
              className="mb-6 inline-flex rounded-full border border-[#d5d8df] bg-[#ffffff]/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#667086]"
            >
              New release
            </motion.p>
            <motion.h1
              variants={motionItem}
              className="max-w-xl text-5xl font-extrabold leading-[1.03] tracking-tight text-[#20242b] sm:text-6xl lg:text-[4.35rem]"
            >
              MTG Life Counter Updater
            </motion.h1>
            <motion.p
              variants={motionItem}
              className="mt-6 max-w-xl text-lg leading-8 text-[#20242b]"
            >
              Track life totals, use the counter library, card lookup, dice roller and LED status in
              one premium handheld interface.
            </motion.p>

            <motion.div variants={motionItem} className="mt-10 flex flex-wrap gap-5" id="purchase">
              <button
                type="button"
                onClick={startCheckout}
                disabled={checkoutLoading}
                className="inline-flex h-16 min-w-[240px] items-center justify-center rounded-full bg-[#1434d6] px-8 text-lg font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_14px_30px_rgba(20,52,214,0.25)] transition hover:bg-[#0f2cbd]"
              >
                {checkoutLoading ? "Opening checkout..." : "Buy now"}
              </button>
            </motion.div>

            {checkoutError ? (
              <motion.p
                variants={motionItem}
                className="mt-3 max-w-xl text-sm font-medium text-[#a2362d]"
              >
                {checkoutError}
              </motion.p>
            ) : null}

            <motion.div variants={motionItem} className="mt-10 grid gap-4 sm:grid-cols-2">
              {packs.map((pack) => (
                <article
                  key={pack.name}
                  className="rounded-[1.6rem] border border-[#dadde4] bg-[#ffffff] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f7786]">
                    {pack.subtitle}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[#20242b]">{pack.name}</h3>
                  <p className="mt-1 text-3xl font-black text-[#1434d6]">{pack.price}</p>
                  <p className="mt-3 text-sm leading-6 text-[#20242b]">{pack.details}</p>
                </article>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[676px] rounded-[2rem] border border-[#e0e0e0] bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d0d4db] to-transparent" />

              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/80 text-2xl font-light leading-none text-[#1434d6] shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:bg-white"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/80 text-2xl font-light leading-none text-[#1434d6] shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:bg-white"
              >
                ›
              </button>

              <div
                ref={carouselRef}
                className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {heroSlides.map((slide) => (
                  <figure
                    key={slide.title}
                    className="min-w-full snap-center overflow-hidden rounded-[1.6rem] border border-[#e2e4e8] bg-[#fafafa]"
                  >
                    {slide.kind === "image" ? (
                      <Image
                        src={slide.src}
                        alt={slide.title}
                        width={1200}
                        height={1200}
                        className="aspect-square h-auto w-full object-contain p-4"
                        priority={slide.src === "/torq/mock-logo.png"}
                      />
                    ) : (
                      <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,#f9fafc_0%,#eef1f5_100%)] p-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#cfd5df] bg-white text-2xl text-[#1434d6]">
                          ▶
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#6a7382]">
                          Video placeholder
                        </p>
                        <p className="max-w-[22rem] text-base font-medium text-[#2a2f37]">{slide.title}</p>
                        <p className="text-sm text-[#7a8391]">Drop in your .mp4 later and this slot is ready.</p>
                      </div>
                    )}
                  </figure>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-12 pb-8 sm:pb-10 lg:pb-14">
          <div className="rounded-[2rem] border border-[#dde2ea] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                Product details
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#20242b] sm:text-4xl">
                Engineered for the Commander pod, without the phone-app friction
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#434b59] sm:text-lg">
                TORQ is a tabletop-first control surface for life totals, game flow, and table-side
                utility. It is designed to feel deliberate in hand, visible from across the table,
                and useful in real multiplayer play.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[1.5rem] border border-[#e2e5eb] bg-[#fbfbfc] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.03)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7483]">
                    {card.label}
                  </p>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-[#20242b]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#4b5462]">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-16 lg:pb-20" id="about-us">
          <div className="rounded-[2rem] border border-[#dde2ea] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667086]">
                Our story
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#20242b] sm:text-4xl">
                About Us
              </h2>
            </div>

            <div className="mt-8 max-w-3xl space-y-6 text-base leading-8 text-[#434b59] sm:text-lg">
              <p>
                TORQ was born from a simple question: why should premium Commander software cost €78? I discovered Soul Dial and recognized its quality—but also recognized that the price tag locked out an entire community of players who deserved access to this kind of tool. Life totals are a solved problem. The interface and experience shouldn&apos;t come with a premium barrier.
              </p>

              <p>
                What we&apos;re selling is the software. It has every feature Soul Dial offers, and more—because we&apos;re building in public with you. The hardware is simple: a 1.85-inch intelligent rotary control screen with ESP32-S3 core, openly available on AliExpress for around €40, with free shipping and delivery in under a week. This transparency is intentional. We&apos;re not hiding the bill of materials or pretending we engineered something magical. We took accessible components and built software that makes Commander nights better. That&apos;s the value. That&apos;s what you&apos;re investing in.
              </p>

              <p>
                As a young student in Germany, I built this because I believe the Commander community deserves better than expensive gatekeeping. You shouldn&apos;t have to choose between playing the format you love and accessing the tools that make it enjoyable. Our job is to prove that premium experience and fair pricing aren&apos;t mutually exclusive.
              </p>

              <p>
                This is a community project first. We&apos;re constantly iterating based on feedback from players like you—because you&apos;re the ones who actually know what works at the table. Every feature, every improvement, every decision is shaped by the people using it. We&apos;re not building in a vacuum. We&apos;re building with you, for you.
              </p>

              <p>
                If you have ideas, spotted something that could be better, or just want to share how TORQ fits into your game nights—reach out. This exists because we believe that accessible, community-driven software should be the standard, not the exception. Let&apos;s build something that respects your time, your budget, and your game.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-16 lg:pb-20" id="contact-form">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#dde2ea] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#20242b] sm:text-4xl">
                Get in touch
              </h2>
              <p className="mt-3 text-base leading-7 text-[#434b59] sm:text-lg">
                Have questions about TORQ? We&apos;d love to hear from you.
              </p>
            </div>

            <form
              action="/api/contact"
              method="POST"
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="rounded-lg border border-[#d7dbe3] bg-white px-4 py-3 text-base text-[#1f232b] placeholder-[#9099a6] transition focus:border-[#1434d6] focus:outline-none focus:ring-1 focus:ring-[#1434d6]/20"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="rounded-lg border border-[#d7dbe3] bg-white px-4 py-3 text-base text-[#1f232b] placeholder-[#9099a6] transition focus:border-[#1434d6] focus:outline-none focus:ring-1 focus:ring-[#1434d6]/20"
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                className="w-full rounded-lg border border-[#d7dbe3] bg-white px-4 py-3 text-base text-[#1f232b] placeholder-[#9099a6] transition focus:border-[#1434d6] focus:outline-none focus:ring-1 focus:ring-[#1434d6]/20"
              />

              <textarea
                name="message"
                placeholder="Comment"
                rows={6}
                required
                className="w-full rounded-lg border border-[#d7dbe3] bg-white px-4 py-3 text-base text-[#1f232b] placeholder-[#9099a6] transition focus:border-[#1434d6] focus:outline-none focus:ring-1 focus:ring-[#1434d6]/20"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1434d6] px-6 py-3 text-lg font-bold uppercase tracking-[0.04em] text-white shadow-[0_14px_30px_rgba(20,52,214,0.25)] transition hover:bg-[#0f2cbd]"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-[#dde2ea]">
          <div className="max-w-3xl mx-auto text-center text-sm text-[#667086] space-y-4">
            <div className="flex gap-6 justify-center flex-wrap">
              <a href="/imprint" className="text-[#1434d6] hover:text-[#091aa0] transition">
                Imprint
              </a>
              <a href="/refund-policy" className="text-[#1434d6] hover:text-[#091aa0] transition">
                Refund Policy
              </a>
              <a href="mailto:support@torq-lab.com" className="text-[#1434d6] hover:text-[#091aa0] transition">
                Contact
              </a>
            </div>
            <p>© 2026 TORQ Labs. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
