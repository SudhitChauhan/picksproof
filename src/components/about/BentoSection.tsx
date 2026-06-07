import {
  BarChart3,
  BookOpen,
  GitCompare,
  Search
} from "lucide-react";
import { ABOUT_IMAGES } from "@/lib/about-images";
import {
  aboutContainer,
  aboutEyebrow,
  aboutH2,
  aboutSection,
  aboutShadow,
  aboutShadowHover
} from "@/lib/about-tw";
import { AboutImage } from "./AboutImage";
import { ScrollSection } from "./ScrollSection";

const BENTO_TILES = [
  {
    step: "01",
    icon: BookOpen,
    title: "Structured Product Reviews",
    body: "Every review follows the same layout: specs, pros, trade-offs, who it's for, and who it's not for — no filler, just answers.",
    image: ABOUT_IMAGES.bento.reviews,
    imageAlt: "Headphones laid out for a structured product review"
  },
  {
    step: "02",
    icon: GitCompare,
    title: "Side-by-Side Comparisons",
    body: "Stack two or three products and see the real differences — battery, build, warranty, and what's missing — at a glance.",
    image: ABOUT_IMAGES.bento.comparisons,
    imageAlt: "Tablet showing product comparison data"
  },
  {
    step: "03",
    icon: Search,
    title: "Category Buying Guides",
    body: "Learn what actually matters in a category before you compare individual products — so you know which specs to weigh.",
    image: ABOUT_IMAGES.bento.guides,
    imageAlt: "Modern kitchen appliances for a buying guide"
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Curated Picks for Every Budget",
    body: "We surface a budget pick, a value pick, and a premium pick — because the best product depends on your wallet, not ours.",
    image: ABOUT_IMAGES.bento.budget,
    imageAlt: "Premium watch representing curated picks across budgets"
  }
] as const;

export function BentoSection() {
  return (
    <ScrollSection className={`${aboutSection} bg-white`}>
      <div className={aboutContainer}>
        <div className="mb-10 grid items-end gap-4 max-lg:mb-8 max-lg:grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div>
            <p className={aboutEyebrow}>What We Do</p>
            <h2 className={`${aboutH2} mb-0 max-w-[520px]`}>
              Four ways PicksProof saves you hours.
            </h2>
          </div>
          <p className="m-0 max-w-[400px] justify-self-end text-[1.05rem] leading-[1.75] text-about-muted max-lg:max-w-none max-lg:justify-self-start">
            The same research workflow, every time — so you spend less time decoding marketing copy and
            more time choosing what fits you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {BENTO_TILES.map(({ step, icon: Icon, title, body, image, imageAlt }) => (
            <article
              className={`flex flex-col overflow-hidden rounded-3xl border border-about-border bg-about-cream p-0 ${aboutShadow} transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[rgba(232,90,27,0.25)] ${aboutShadowHover}`}
              key={title}
            >
              <div className="relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_40%,rgba(28,28,28,0.35)_100%)] after:content-['']">
                <AboutImage
                  src={image}
                  alt={imageAlt}
                  className="m-0 h-[200px]"
                  frameClassName="rounded-none"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                <span className="absolute left-4 top-4 z-[2] rounded-full bg-[rgba(28,28,28,0.55)] px-2.5 py-1.5 text-[0.72rem] font-extrabold tracking-[0.08em] text-white backdrop-blur-sm">
                  {step}
                </span>
                <span
                  className="absolute bottom-4 right-4 z-[2] flex h-11 w-11 items-center justify-center rounded-[14px] bg-about-orange text-white shadow-[0_8px_20px_rgba(232,90,27,0.35)]"
                  aria-hidden="true"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </span>
              </div>
              <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                <h3 className="mb-2.5 text-[1.1rem] font-bold leading-[1.35] text-about-dark">
                  {title}
                </h3>
                <p className="m-0 flex-1 text-[0.92rem] leading-[1.65] text-about-muted">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
