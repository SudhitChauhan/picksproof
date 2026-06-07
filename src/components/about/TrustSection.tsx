import {
  Check,
  ClipboardList,
  Lock,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { aboutContainer, aboutEyebrow, aboutSection } from "@/lib/about-tw";
import { ScrollSection } from "./ScrollSection";

const TRUST_FEATURES = [
  {
    title: "Clear Affiliate Disclosure",
    body: "Every page tells you we earn a commission. No fine print, no footnote hiding at the bottom."
  },
  {
    title: "Transparent Approach",
    body: "Our research methodology is published openly. Every editor knows how rankings are decided before a guide goes live."
  },
  {
    title: "No Paid Rankings — Ever",
    body: "Commission rates never influence our picks. A product paying 8% won't beat one paying 1% if the 1% product is better for you."
  },
  {
    title: "Regularly Updated Content",
    body: "Products change. Prices change. Models refresh. We revisit each guide and update anything that's become stale or wrong."
  }
] as const;

const READER_PROMISES = [
  { icon: Lock, text: "Affiliate links never influence what we cover" },
  { icon: ClipboardList, text: "Every recommendation has a clear pros/cons trade-off" },
  { icon: RefreshCw, text: "Regular content reviews keep guides current" },
  { icon: MessageCircle, text: "We read and respond to reader feedback" }
] as const;

export function TrustSection() {
  return (
    <ScrollSection className={`${aboutSection} bg-white`}>
      <div className={aboutContainer}>
        <div className="grid items-start gap-10 max-lg:grid-cols-1 max-lg:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <p className={aboutEyebrow}>Why Trust Us</p>
            <h2 className="mb-4 max-w-[560px] font-serif text-[clamp(2rem,3.8vw,2.65rem)] font-bold leading-[1.12] tracking-[-0.02em] text-about-dark">
              Transparency Is Not Optional Here
            </h2>
            <p className="mb-9 max-w-[560px] text-[1.05rem] leading-[1.75] text-about-muted">
              We know that trust on the internet has to be earned — and proved, not just stated.
              Here&apos;s how we earn it.
            </p>

            <ul className="m-0 list-none p-0">
              {TRUST_FEATURES.map(({ title, body }) => (
                <li
                  key={title}
                  className="grid grid-cols-[40px_1fr] items-start gap-4 border-t border-about-border py-6 last:pb-0"
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-about-dark text-white"
                    aria-hidden="true"
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-[1.02rem] font-bold leading-[1.35] text-about-dark">
                      {title}
                    </h3>
                    <p className="m-0 text-[0.92rem] leading-[1.65] text-about-muted">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="mt-9 rounded-[28px] bg-about-dark p-9 px-9 text-about-body-dark max-lg:mt-0">
            <h3 className="mb-5 font-serif text-[clamp(1.6rem,2.8vw,2rem)] font-bold leading-[1.2] text-white">
              Our Promise to Readers
            </h3>
            <p className="mb-4 text-[0.95rem] leading-[1.75] text-[rgba(232,232,232,0.82)]">
              We don&apos;t sell products. We sell clarity. Our job is to make your decision easier
              — not to maximise our click-through rate.
            </p>
            <p className="mb-7 text-[0.95rem] leading-[1.75] text-[rgba(232,232,232,0.82)]">
              Every guide we publish is measured against one question: does this genuinely help the
              reader understand their options better?
            </p>

            <ul className="m-0 grid list-none gap-3 p-0">
              {READER_PROMISES.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3.5 rounded-[14px] border border-white/10 bg-white/[0.08] px-4 py-3.5 text-[0.9rem] font-medium leading-[1.45] text-white"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-about-orange"
                    aria-hidden="true"
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </ScrollSection>
  );
}
