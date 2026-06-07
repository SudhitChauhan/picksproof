"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Handshake, Lightbulb, Mail, ShieldCheck } from "lucide-react";

function PeopleSquiggle({ animate }: { animate: boolean }) {
  return (
    <svg
      className="pointer-events-none absolute -bottom-1 left-0 w-full max-w-[5.5rem]"
      viewBox="0 0 88 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7.5C14 2.5 28 2 44 6.5S72 9 86 4"
        stroke="#E85A1B"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: 96,
          strokeDashoffset: animate ? 0 : 96,
          transition: "stroke-dashoffset 1.2s ease-out 400ms"
        }}
      />
    </svg>
  );
}

function ReplyCardMockup() {
  return (
    <div
      className="relative translate-x-2 -rotate-1 transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-0"
      role="img"
      aria-label="Example reply from PicksProof editorial team"
    >
      {/* Peek card — desktop only */}
      <div
        className="absolute -right-4 top-6 -z-10 hidden w-44 rotate-3 rounded-2xl border border-about-border bg-about-cream p-4 opacity-90 lg:block"
        aria-hidden="true"
      >
        <p className="m-0 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-about-orange">
          ● NEW REPLY
        </p>
        <p className="mt-2 text-sm font-bold leading-snug tracking-[-0.02em] text-about-dark">
          Question about air-purifier filters
        </p>
        <p className="mt-1 text-xs text-about-muted">2 min ago</p>
      </div>

      <div className="rounded-2xl bg-white p-6 text-about-dark shadow-2xl">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-about-orange text-sm font-bold text-white"
            aria-hidden="true"
          >
            P
          </div>
          <div>
            <p className="text-sm font-semibold text-about-dark">PicksProof Editorial Team</p>
            <p className="text-xs text-about-muted">Replied in 6h · Tuesday 10:24 AM</p>
          </div>
        </div>

        <div className="mt-4 border-t border-about-border" />

        <p className="mt-4 text-xs uppercase tracking-wider text-about-muted">
          RE: Best mixer grinder under ₹5,000?
        </p>

        <p className="mt-3 text-sm leading-relaxed text-about-body">
          Thanks for writing in. We just refreshed our sub-₹5k mixer guide last week. Quick
          summary: the Preethi Zodiac wins on motor durability, the Bajaj Rex wins on value.
          Both linked below 👇
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-about-border bg-about-cream px-3 py-1.5 text-xs text-about-body">
            Preethi Zodiac · ✓ Editor&apos;s pick
          </span>
          <span className="rounded-full border border-about-border bg-about-cream px-3 py-1.5 text-xs text-about-body">
            Bajaj Rex · ✓ Best value
          </span>
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          ✓ Verified human reply
        </div>
      </div>
    </div>
  );
}

export function ContactHero() {
  const [squiggleReady, setSquiggleReady] = useState(false);

  useEffect(() => {
    setSquiggleReady(true);
  }, []);

  return (
    <section
      className="px-0 py-8 max-md:pt-6"
      aria-labelledby="contact-hero-heading"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="relative lg:max-h-[720px] overflow-hidden rounded-3xl bg-about-dark p-10 text-white lg:p-16">
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 85% 0%, rgba(232,90,27,.18), transparent 60%)"
            }}
            aria-hidden="true"
          />

          {/* Dotted grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
            aria-hidden="true"
          />

          {/* Speed line */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-0.5"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #E85A1B, transparent)"
            }}
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs">
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                Inbox open · We reply within 48 hours
              </div>

              <h1
                id="contact-hero-heading"
                className="mt-6 text-4xl font-extrabold leading-[1.02] tracking-[-0.02em] lg:text-6xl"
              >
                Talk to the{" "}
                <span className="relative inline-block text-about-orange">
                  people
                  <PeopleSquiggle animate={squiggleReady} />
                </span>{" "}
                behind the picks.
              </h1>

              <p className="mt-6 max-w-lg text-lg text-white/75">
                Have a product to suggest, a comparison to challenge, or a partnership idea? We
                read every message — no bots, no auto-replies, no boilerplate.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm transition-colors hover:bg-white/10 hover:ring-1 hover:ring-white/20"
                  href="mailto:picksproof100@gmail.com"
                  aria-label="Email picksproof100@gmail.com"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  picksproof100@gmail.com
                </a>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm transition-colors hover:bg-white/10 hover:ring-1 hover:ring-white/20"
                  href="#form"
                  aria-label="Go to contact form for partnerships"
                >
                  <Handshake className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Partnerships
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm transition-colors hover:bg-white/10 hover:ring-1 hover:ring-white/20"
                  href="#form"
                  aria-label="Go to contact form to suggest a product"
                >
                  <Lightbulb className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Suggest a product
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider text-white/40">
                <span>
                  <span className="text-about-orange">●</span> Human replies
                </span>
                <span>
                  <span className="text-about-orange">●</span> 48-hr response
                </span>
                <span>
                  <span className="text-about-orange">●</span> No spam, ever
                </span>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-5">
              <ReplyCardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
