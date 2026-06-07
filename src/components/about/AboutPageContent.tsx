import Link from "next/link";
import {
  ArrowRight,
  Info,
  Layers,
  MessageSquareWarning,
  Scale
} from "lucide-react";
import { ABOUT_IMAGES } from "@/lib/about-images";
import {
  aboutBtnPrimaryDark,
  aboutContainer,
  aboutEyebrow,
  aboutH2,
  aboutPage,
  aboutProse,
  aboutSection,
  aboutSectionTight,
  aboutShadow,
  aboutShadowHover
} from "@/lib/about-tw";
import { AboutHero } from "./AboutHero";
import { AboutImage } from "./AboutImage";
import { OurStorySection } from "./OurStorySection";
import { ResearchTimeline } from "./ResearchTimeline";
import { TrustSection } from "./TrustSection";
import { ScrollSection } from "./ScrollSection";
import { SubscribeCard } from "./SubscribeCard";

const PROBLEM_CARDS = [
  {
    icon: Layers,
    title: "Too many options",
    body: "Thousands of products compete for attention. Without a clear framework to compare them, the sheer volume leads to decision paralysis — not better decisions.",
  },
  {
    icon: MessageSquareWarning,
    title: "Reviews you can't trust",
    body: "Site A says Product X is best. Site B says Product Y. A blog from 2021 says something else entirely. Who do you trust? We bring structure to the chaos.",
  },
  {
    icon: Scale,
    title: "Hidden bias everywhere",
    body: "Many review sites quietly rank products based on commission rates, not quality. Sponsored winners dressed up as unbiased picks. We believe you deserve better.",
  },
] as const;

const VALUES = [
  {
    num: "01",
    title: "Transparency over polish",
    body: "We openly disclose affiliate relationships. How we make money is never a secret",
  },
  {
    num: "02",
    title: "Evidence over opinion",
    body: "We work to keep information current, organized, and genuinely useful — not just plausible-sounding.",
  },
  {
    num: "03",
    title: "Clarity over completeness",
    body: "Complex decisions deserve clear answers, not more complexity. We distill, not inflate.",
  },
  {
    num: "04",
    title: "You first, always",
    body: "We exist to serve the person reading, not the brand being read about. Every decision we make runs through that filter.",
  },
] as const;

export function AboutPageContent() {
  return (
    <div className={aboutPage}>
      <ScrollSection className="pb-16 pt-8 md:pt-0">
        <AboutHero />
      </ScrollSection>

      <ScrollSection className={aboutSection}>
        <div className={aboutContainer}>
          <p className={aboutEyebrow}>The Problem</p>
          <div className="mb-9 grid items-start gap-12 max-lg:grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-lg:order-2">
              <h2 className={aboutH2}>Online Shopping Has Become Too Noisy</h2>
              <div className={`${aboutProse} mb-10 max-w-[720px]`}>
                <p>
                  You go to Amazon to buy a pair of earbuds. Soon, you have
                  multiple tabs open, each with a different product. You&apos;re
                  switching back and forth, checking specifications, reading
                  reviews, comparing prices, and trying to remember which one
                  had the better battery life or sound quality. It&apos;s
                  frustrating, right?
                </p>
                <p>
                  That&apos;s why we built PicksProof — a simpler way to compare
                  products, cut through the noise, and choose with confidence.
                </p>
              </div>
            </div>
            <AboutImage
              src={ABOUT_IMAGES.problem.src}
              alt={ABOUT_IMAGES.problem.alt}
              className={`max-lg:order-1 aspect-[3/2] min-h-[320px] w-full ${aboutShadowHover} max-lg:min-h-[280px]`}
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
          <div className="mb-12 grid grid-cols-1 gap-5 max-lg:grid-cols-1 lg:grid-cols-3">
            {PROBLEM_CARDS.map(({ icon: Icon, title, body }) => (
              <article
                className={`rounded-2xl bg-white p-7 ${aboutShadow} transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 ${aboutShadowHover}`}
                key={title}
              >
                <Icon size={22} strokeWidth={1.5} className="mb-4 text-about-dark" />
                <h3 className="mb-2.5 text-[1.05rem] font-bold text-about-dark">
                  {title}
                </h3>
                <p className="m-0 text-[0.95rem] leading-[1.6] text-about-muted">
                  {body}
                </p>
              </article>
            ))}
          </div>
          <p className="m-0 text-center text-[1.2rem] text-about-muted">
            <em>
              We thought the same. So we built the site we wished existed.
            </em>
          </p>
        </div>
      </ScrollSection>

      <OurStorySection />

      <ScrollSection className="relative overflow-hidden bg-about-dark px-6 py-40 max-lg:py-[100px]">
        <AboutImage
          src={ABOUT_IMAGES.mission.src}
          alt=""
          className="absolute inset-0 z-0"
          frameClassName="rounded-none [&_img]:brightness-[0.28] [&_img]:saturate-[0.85] after:absolute after:inset-0 after:z-[1] after:bg-[linear-gradient(180deg,rgba(28,28,28,0.55)_0%,rgba(28,28,28,0.82)_100%)] after:content-['']"
          sizes="100vw"
        />
        <div className={`${aboutContainer} relative z-[2] max-w-[900px] text-center`}>
          <p className={aboutEyebrow}>Everything We Do</p>
          <h2 className="mb-6 text-[clamp(1.75rem,3.5vw,3.5rem)] font-bold italic leading-[1.25] text-white [&_strong]:font-bold [&_strong]:text-about-orange">
            To organize product information clearly and help shoppers make{" "}
            <strong>confident decisions</strong> without noise or hype.
          </h2>
          <p className="m-0 text-[0.95rem] italic text-[rgba(232,232,232,0.55)]">
            Every comparison and guide we publish is measured against one
            question
            <br />
            &ldquo;Does this genuinely help the reader understand their options
            better?&rdquo;
          </p>
        </div>
      </ScrollSection>

      <ScrollSection className={`${aboutSection} bg-white`} id="our-method">
        <div className={aboutContainer}>
          <p className={aboutEyebrow}>How We Work</p>
          <h2 className={aboutH2}>How We Put It All Together for You</h2>
          <AboutImage
            src={ABOUT_IMAGES.method.src}
            alt={ABOUT_IMAGES.method.alt}
            className={`my-2 mb-3 h-[220px] ${aboutShadow}`}
            frameClassName="rounded-3xl"
            sizes="(max-width: 1200px) 100vw, 1152px"
          />
          <ResearchTimeline />
          <p className="m-0 text-center text-[0.95rem] text-about-muted">
            <em>
              If a product no longer deserves its spot, we remove it. Quietly.
              No apology emails to the brand.
            </em>
          </p>
        </div>
      </ScrollSection>

      <TrustSection />

      <ScrollSection className={aboutSection}>
        <div className={aboutContainer}>
          <p className={aboutEyebrow}>Our Values</p>
          <h2 className={aboutH2}>What we believe.</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ num, title, body }) => (
              <article
                className={`relative overflow-hidden rounded-[20px] bg-white px-6 py-8 ${aboutShadow} transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 ${aboutShadowHover}`}
                key={num}
              >
                <span className="mb-[-8px] block text-5xl font-extrabold leading-none text-[rgba(232,90,27,0.15)]">
                  {num}
                </span>
                <h3 className="relative mb-3 text-base font-bold text-about-dark">
                  {title}
                </h3>
                <p className="relative m-0 text-[0.9rem] leading-[1.6] text-about-muted">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </ScrollSection>

      <ScrollSection className={aboutSectionTight}>
        <div className={aboutContainer}>
          <article className={`mx-auto max-w-[760px] overflow-hidden rounded-3xl border border-about-border bg-white px-14 pb-12 ${aboutShadow} max-md:px-6 max-md:pb-8`}>
            <AboutImage
              src={ABOUT_IMAGES.money.src}
              alt={ABOUT_IMAGES.money.alt}
              className="-mx-14 mb-8 h-[200px] max-md:-mx-6 max-md:mb-6 max-md:h-[180px]"
              frameClassName="rounded-none"
              sizes="(max-width: 760px) 100vw, 760px"
            />
            <p className={aboutEyebrow}>The Honest Part</p>
            <h2 className={`${aboutH2} flex max-w-none items-start gap-3`}>
              <Info
                size={22}
                strokeWidth={1.5}
                className="mt-3 shrink-0 text-about-orange"
              />
              How PicksProof actually makes money.
            </h2>
            <div className={aboutProse}>
              <p>
                We&apos;re members of the Amazon Associates programme
                (Amazon.in). When you click one of our &ldquo;See on
                Amazon&rdquo; buttons and buy something — that day, or even days
                later — Amazon pays us a small commission.{" "}
                <strong>
                  The price you pay does not change. Not by a single rupee.
                </strong>
              </p>
              <p>
                That commission is what keeps the lights on. It pays for
                hosting, research time, the people who write the reviews, and
                the coffee that keeps them awake.
              </p>
              <p>
                Here&apos;s the line we will never cross:{" "}
                <strong>commission rates do not influence rankings.</strong> A
                product paying us 8% will not out-rank a product paying us 1% if
                the 1% product is genuinely better for you. We&apos;ve turned
                down placement money. We will keep turning it down. It&apos;s
                the entire reason this site exists.
              </p>
            </div>
            <p className="mt-8 text-[0.9rem] text-about-muted">
              Read our full{" "}
              <Link
                href="/affiliate-disclosure"
                className="font-semibold text-about-orange underline underline-offset-[3px] hover:text-about-orange-hover"
              >
                Affiliate Disclosure →
              </Link>{" "}
              and{" "}
              <Link
                href="/editorial-policy"
                className="font-semibold text-about-orange underline underline-offset-[3px] hover:text-about-orange-hover"
              >
                Editorial Policy →
              </Link>
            </p>
          </article>
        </div>
      </ScrollSection>

      <ScrollSection
        className="mb-0 bg-about-orange px-0 py-24 pb-[120px] max-md:py-16 max-md:pb-20"
        id="contact"
      >
        <div className={`${aboutContainer} text-center`}>
          <h2 className="mb-4 text-[clamp(2rem,3.5vw,2.75rem)] font-bold text-about-cream">
            What&apos;s next for PicksProof.
          </h2>
          <p className="mx-auto mb-14 max-w-[640px] text-[1.05rem] text-[rgba(245,239,232,0.88)] max-lg:mb-14">
            We&apos;re building toward a future where Indian shoppers don&apos;t
            need ten tabs and two YouTube reviews to buy a ₹2,000 product. One
            trusted research desk. Every major category. Updated regularly.
            That&apos;s the goal.
          </p>
          <div className="mt-[-24px] grid grid-cols-1 gap-6 max-lg:mt-0 lg:grid-cols-2">
            <div className="flex min-h-[220px] flex-col rounded-[20px] bg-white px-7 py-8 text-left shadow-[0_12px_28px_rgba(28,28,28,0.1)]">
              <h3 className="mb-2.5 text-[1.1rem] font-bold text-about-dark">
                See the picks.
              </h3>
              <p className="mb-6 flex-1 text-[0.92rem] leading-[1.6] text-about-muted">
                The fastest way to understand what we do is to read a review.
              </p>
              <Link className={aboutBtnPrimaryDark} href="/search">
                Browse Reviews <ArrowRight size={16} />
              </Link>
            </div>
            {/* <SubscribeCard /> */}
            <div className="flex min-h-[220px] flex-col rounded-[20px] bg-white px-7 py-8 text-left shadow-[0_12px_28px_rgba(28,28,28,0.1)]">
              <h3 className="mb-2.5 text-[1.1rem] font-bold text-about-dark">
                Have a question or a product to suggest?
              </h3>
              <p className="mb-6 flex-1 text-[0.92rem] leading-[1.6] text-about-muted">
                We read every message. Brands welcome — but rankings aren&apos;t
                for sale.
              </p>
              <Link className={aboutBtnPrimaryDark} href="/contact">
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  );
}
