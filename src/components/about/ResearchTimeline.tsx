"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Gather Public Information",
    body: "We pull together specs, features, and publicly available product details from Amazon.in trusted listings."
  },
  {
    num: "02",
    title: "Review User Feedback",
    body: "We look at patterns in verified user reviews to surface recurring strengths, weaknesses, and real-world usage notes."
  },
  {
    num: "03",
    title: "Organize the Trade-offs",
    body: "We structure information so you can clearly see how competing products differ — without telling you which one to pick."
  },
  {
    num: "04",
    title: "Present It Clearly",
    body: "Everything is laid out in a simple, scannable format — so you can absorb what matters and move forward confidently."
  },
  {
    num: "05",
    title: "Keep It Current",
    body: "Products change. Prices shift. We revisit our content regularly so the information you find is still relevant."
  }
] as const;

const timelineNum =
  "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-about-orange text-[0.8rem] font-bold text-white";

export function ResearchTimeline() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <ol className="relative m-0 mb-8 mt-12 hidden list-none grid-cols-5 gap-0 p-0 before:absolute before:left-[10%] before:right-[10%] before:top-5 before:z-0 before:border-t-2 before:border-dotted before:border-about-orange before:content-[''] lg:grid">
        {STEPS.map((step) => (
          <li key={step.num} className="relative z-[1] px-3 text-center">
            <span className={timelineNum}>{step.num}</span>
            <h3 className="mb-2 text-[0.92rem] font-bold leading-[1.35] text-about-dark">
              {step.title}
            </h3>
            <p className="m-0 text-[0.82rem] leading-[1.55] text-about-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="my-8 lg:hidden">
        {STEPS.map((step, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              className="mb-3 overflow-hidden rounded-2xl border border-about-border bg-white"
              key={step.num}
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-5 py-[18px] text-left text-about-dark"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-about-orange text-[0.8rem] font-bold text-white">
                  {step.num}
                </span>
                <span className="flex-1 text-[0.95rem] font-bold">{step.title}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-about-muted transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen ? (
                <div className="px-5 pb-[18px] pl-[74px]">
                  <p className="m-0 text-[0.92rem] leading-[1.6] text-about-muted">
                    {step.body}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
