import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollSection } from "@/components/ScrollSection";
import { aboutBtnPrimary, aboutContainer, aboutEyebrow } from "@/lib/about-tw";

export function ContactCtaStrip() {
  return (
    <ScrollSection className="mb-0 bg-about-dark px-0 py-24 pb-[100px] max-md:py-16 max-md:pb-20">
      <div className={`${aboutContainer} relative z-[1] mx-auto max-w-[600px] text-center`}>
        <p className={`${aboutEyebrow} text-about-orange`}>Explore PicksProof</p>
        <h2 className="mb-4 text-[clamp(1.75rem,3.5vw,2.4rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          Start exploring. The right pick is closer than you think.
        </h2>
        <p className="mb-8 text-[1.05rem] leading-[1.75] text-[rgba(232,232,232,0.65)]">
          Browse comparisons, buying guides, and curated picks — all free, all
          transparent.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 max-[480px]:flex-col">
          <Link className={aboutBtnPrimary} href="/search">
            Browse Comparisons <ArrowRight size={16} />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-white/20 px-7 py-3.5 text-[0.95rem] font-semibold text-white no-underline transition-[border-color,background] duration-200 hover:border-white/50 hover:bg-white/5 max-[480px]:w-full"
            href="/categories/electronics-tech"
          >
            View Buying Guides
          </Link>
        </div>
      </div>
    </ScrollSection>
  );
}
