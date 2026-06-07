"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { aboutContainer, aboutEyebrow, aboutH2 } from "@/lib/about-tw";

const FAQ_ITEMS = [
  {
    question: "Do you test products yourself?",
    answer:
      "No — we're a content platform, not a testing lab. We gather and organize publicly available information, manufacturer specs, and user feedback patterns to help you understand your options. The final decision is always yours."
  },
  {
    question: "Are your comparisons paid for or sponsored?",
    answer:
      "No. Brands cannot pay to appear in our comparisons or influence how we present their products. What you see is organized based on what's most useful to readers — not who pays us."
  },
  {
    question: "How do you make money?",
    answer:
      "PicksProof participates in affiliate marketing programs including the Amazon Associates Programme. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. This never influences which products we cover or how we describe them."
  },
  {
    question: "How often is your content updated?",
    answer:
      "We review and update content regularly as products change, new models launch, and prices shift. If you spot something outdated, use the contact form above to let us know — we appreciate it."
  },
  {
    question: "Can I suggest a product or category?",
    answer:
      "Absolutely. Use the contact form and select 'Product Suggestion' from the topic dropdown. Reader suggestions shape what we cover next — we read every one."
  }
] as const;

export function FaqAccordion() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section aria-labelledby="contact-faq-heading">
      <div className={`${aboutContainer} mx-auto max-w-[760px]`}>
        <p className={aboutEyebrow}>Common Questions</p>
        <h2 className={aboutH2} id="contact-faq-heading">
          Quick Answers
        </h2>
        <div className="mb-8 h-[3px] w-12 rounded-sm bg-about-orange" aria-hidden="true" />

        {FAQ_ITEMS.map(({ question, answer }, index) => {
          const isOpen = openIndex === index;
          const panelId = `${baseId}-panel-${index}`;
          const triggerId = `${baseId}-trigger-${index}`;

          return (
            <div className="border-b border-about-border" key={question}>
              <button
                type="button"
                id={triggerId}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-5 text-left text-[0.95rem] font-semibold transition-colors duration-200 ${isOpen ? "text-about-orange" : "text-about-dark"}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                {question}
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-about-muted transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={`overflow-hidden transition-[max-height] duration-300 ease-out ${isOpen ? "max-h-[400px]" : "max-h-0"}`}
              >
                <p className="m-0 pb-5 text-[0.9rem] leading-[1.75] text-about-muted">{answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
