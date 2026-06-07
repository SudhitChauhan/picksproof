import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { ABOUT_IMAGES } from "@/lib/about-images";
import { aboutBtnPrimary } from "@/lib/about-tw";
import { AboutImage } from "./AboutImage";

const HERO_CHECKS = [
  "Transparent Reviews",
  "Honest Comparisons",
  "Affiliate Disclosed",
  "Regular Updates",
] as const;

export function AboutHero() {
  return (
    <section
      className="relative mx-12 mt-10 min-h-[clamp(420px,52vw,760px)] overflow-hidden rounded-[40px] shadow-[0_12px_28px_rgba(28,28,28,0.1)] max-lg:mx-8 max-lg:mt-6 max-lg:min-h-[400px] max-md:mx-4 max-md:mt-4 max-md:flex max-md:min-h-[520px] max-md:items-end max-md:rounded-[28px]"
      aria-labelledby="about-hero-title"
    >
      <AboutImage
        src={ABOUT_IMAGES.hero.main}
        alt={ABOUT_IMAGES.hero.mainAlt}
        className="absolute inset-0 z-0"
        frameClassName="rounded-none after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(105deg,rgba(28,28,28,0.55)_0%,rgba(28,28,28,0.18)_45%,rgba(28,28,28,0.08)_100%)] after:content-['']"
        sizes="100vw"
        priority
      />

      <div className="absolute bottom-14 left-1/2 z-[2] w-[calc(100%-96px)] max-w-[1240px] -translate-x-1/2 rounded-[40px] border border-[rgba(230,222,211,0.9)] bg-white p-10 px-14 shadow-[0_20px_48px_rgba(28,28,28,0.12)] backdrop-blur-sm max-lg:w-[calc(100%-64px)] max-lg:p-8 max-lg:px-9 max-md:relative max-md:bottom-auto max-md:left-auto max-md:w-full max-md:translate-x-0 max-md:rounded-[28px_28px_0_0] max-md:p-7 max-md:px-6 max-md:pb-8">
        <Sparkles
          size={22}
          strokeWidth={1.5}
          className="pointer-events-none absolute right-12 top-7 text-[rgba(232,90,27,0.45)] max-md:right-6 max-md:top-5"
          aria-hidden="true"
        />
        <Sparkles
          size={28}
          strokeWidth={1.5}
          className="pointer-events-none hidden lg:block absolute bottom-9 left-10 opacity-35 text-[rgba(232,90,27,0.45)] max-md:bottom-[100px] max-md:left-6"
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(240px,300px)] max-lg:gap-7 max-md:gap-6">
          <div className="relative min-w-0">
            <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-about-orange">
              Your Product Decision Guide
            </p>
            <h1
              id="about-hero-title"
              className="mb-5 text-[clamp(1.85rem,3.8vw,2.65rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-about-dark"
            >
              All the information.
              <br />
              You make the right call.
            </h1>
            <p className="mb-7 max-w-[900px] text-base leading-[1.75] text-about-muted">
              Finding the right product shouldn&apos;t take hours of
              tab-switching, conflicting reviews, or blind guesswork. PicksProof
              gathers product information, lays out the trade-offs clearly, and
              lets you decide with confidence.
            </p>
            <Link className={`${aboutBtnPrimary} min-w-[180px]`} href="/search">
              Browse Reviews <ArrowRight size={16} />
            </Link>
          </div>

          <ul
            className="m-0 grid list-none grid-cols-1 gap-4 pt-9 max-lg:grid-cols-2 max-lg:gap-x-5 max-lg:gap-y-3.5 max-md:grid-cols-1 max-md:pt-0"
            aria-label="What you can expect from PicksProof"
          >
            {HERO_CHECKS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[0.9rem] font-semibold leading-[1.35] text-about-dark max-md:text-[0.85rem]"
              >
                <span
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-about-orange-soft text-about-orange"
                  aria-hidden="true"
                >
                  <Check size={15} strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
