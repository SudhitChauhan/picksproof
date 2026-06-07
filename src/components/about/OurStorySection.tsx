import { ABOUT_IMAGES } from "@/lib/about-images";
import { aboutContainer, aboutSection } from "@/lib/about-tw";
import { AboutImage } from "./AboutImage";
import { ScrollSection } from "./ScrollSection";

const STORY_STEPS = [
  {
    title: "The frustration everyone knows",
    body: "Every day, millions search for the best product online — and find chaos. One site says Product A. Another says Product B. A third claims everything is \"#1\"."
  },
  {
    title: "Too much information, not enough clarity",
    body: "The internet isn't short on product content. It's short on useful, organized content. Specs are scattered, reviews conflict, and most guides just add more noise instead of cutting through it."
  },
  {
    title: "PicksProof was born",
    body: "We built PicksProof as a platform that gathers available product information, organizes it clearly, and presents the trade-offs — so you can walk in informed and make the call yourself."
  },
  {
    title: "A guide, not a gatekeeper",
    body: "We don't tell you what to buy. We give you what you need to decide. The final choice is always yours — we just make sure you're not going in blind."
  }
] as const;

export function OurStorySection() {
  return (
    <ScrollSection className={`${aboutSection} bg-white`} id="our-story">
      <div className={aboutContainer}>
        <div className="grid items-start gap-10 max-lg:grid-cols-1 max-lg:gap-10 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:gap-x-[72px] lg:gap-y-14">
          <div className="lg:sticky lg:top-24">
            <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-about-orange">
              Our Story
            </p>
            <h2 className="m-0 max-w-[640px] font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.02em] text-about-dark">
              Why We Started PicksProof
            </h2>
            <div
              className="my-5 mb-12 h-1 w-[52px] rounded-sm bg-about-orange"
              aria-hidden="true"
            />
            <AboutImage
              src={ABOUT_IMAGES.story.src}
              alt={ABOUT_IMAGES.story.alt}
              className="mt-2 h-[clamp(280px,32vw,380px)] shadow-[0_4px_20px_rgba(28,28,28,0.06)] max-md:h-[clamp(240px,50vw,320px)]"
              frameClassName="rounded-3xl"
              sizes="(max-width: 1024px) 100vw, 440px"
            />
          </div>

          <ol className="relative m-0 list-none p-0 before:absolute before:bottom-5 before:left-[19px] before:top-5 before:w-0.5 before:bg-about-orange-line before:content-['']">
            {STORY_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative grid grid-cols-[40px_1fr] items-start gap-7 pb-11 last:pb-0 max-md:gap-5 max-md:pb-9"
              >
                <span className="relative z-[1] flex h-10 w-10 items-center justify-center rounded-full border-2 border-about-orange bg-white text-[0.95rem] font-bold text-about-orange">
                  {index + 1}
                </span>
                <div>
                  <h3 className="mb-2.5 text-[1.1rem] font-bold leading-[1.35] text-about-dark max-md:text-[1.02rem]">
                    {step.title}
                  </h3>
                  <p className="m-0 text-base leading-[1.75] text-about-muted max-md:text-[0.95rem]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ScrollSection>
  );
}
