import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import {
  legalCallout,
  legalHighlightCard,
  legalHighlightLabel,
  legalLink,
  legalList,
  legalStepCard,
  legalStepGrid,
  legalStepLabel
} from "@/lib/legal-tw";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — PicksProof",
  description:
    "PicksProof earns a commission from Amazon.in affiliate links. Read exactly how this works, what it means for you, and our commitment to unbiased recommendations."
};

const commissionSteps = [
  {
    step: "Step 1",
    title: "You click a link",
    body: 'You click "See Price" on any PicksProof product page. You are redirected to Amazon.in with a tracking tag in the URL (tag=picksproof-21 or similar).'
  },
  {
    step: "Step 2",
    title: "Amazon tracks the referral",
    body: "Amazon records that you arrived via PicksProof using a browser cookie. This attribution window is typically 24 hours, or 90 days if the item was added to your cart."
  },
  {
    step: "Step 3",
    title: "You make a purchase",
    body: "You buy the product — or any other qualifying product on Amazon.in within the attribution window. The purchase does not have to be the exact product you clicked."
  },
  {
    step: "Step 4",
    title: "Amazon pays PicksProof",
    body: "Amazon calculates a commission (typically 1–9% depending on product category) and pays it to PicksProof, usually on a monthly basis."
  }
] as const;

const sections = [
  {
    number: "01",
    title: "What Is This Page?",
    content: (
      <p>
        PicksProof is required by law — and believes in transparency — to clearly
        disclose when links on our website may earn us a commission. This page
        explains that relationship fully, in plain language.
      </p>
    )
  },
  {
    number: "02",
    title: "Our Amazon Associates Relationship",
    content: (
      <>
        <div className={legalCallout}>
          <p>
            <strong>Disclosure:</strong> PicksProof is a participant in the{" "}
            <strong>Amazon Associates Programme</strong>, an affiliate advertising
            programme operated by Amazon.in. This means PicksProof earns
            advertising fees by linking to products on Amazon.in. These fees are
            paid by Amazon — not by you.
          </p>
        </div>
        <p>
          Every &ldquo;See Price&rdquo; or &ldquo;View on Amazon&rdquo; button you
          see on PicksProof is an affiliate link. When you click one and make a
          qualifying purchase on Amazon.in — even days after clicking — we receive
          a small percentage of the sale value as a commission.
        </p>
        <p>
          This is our primary source of revenue. It is how we fund the research,
          writing, and maintenance that goes into every guide and comparison on
          this site.
        </p>
      </>
    )
  },
  {
    number: "03",
    title: "What This Means for You",
    content: (
      <>
        <div className={legalHighlightCard}>
          <p className={legalHighlightLabel}>What this means for you</p>
          <p className="text-[0.95rem] leading-[1.75] text-about-body">
            The price you pay on Amazon.in is{" "}
            <strong>exactly the same</strong> whether you arrive through
            PicksProof or type the URL directly. Not a single rupee more. Amazon
            pays our commission from their own margin — it is never added to your
            checkout total.
          </p>
        </div>
        <ul className={legalList}>
          <li>You pay the same price you would pay going to Amazon.in directly.</li>
          <li>
            Amazon handles the entire transaction — payment, delivery, returns,
            warranty.
          </li>
          <li>
            PicksProof never sees your payment details, address, or order
            information.
          </li>
          <li>
            Our commission is paid by Amazon, not deducted from any refund or
            return you make.
          </li>
        </ul>
      </>
    )
  },
  {
    number: "04",
    title: "How the Commission Works",
    content: (
      <>
        <p>
          Here is the exact flow from your click to our commission:
        </p>
        <div className={legalStepGrid}>
          {commissionSteps.map((item) => (
            <div key={item.step} className={legalStepCard}>
              <p className={legalStepLabel}>{item.step}</p>
              <p className="mb-1 text-sm font-semibold text-about-dark">
                {item.title}
              </p>
              <p className="text-xs leading-relaxed text-about-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    number: "05",
    title: "What We Will Never Do",
    content: (
      <>
        <p>
          Our affiliate relationship with Amazon comes with a line we will not
          cross. Ever.
        </p>
        <ul className={legalList}>
          <li>
            We will never rank a product higher because it pays a higher
            commission rate.
          </li>
          <li>
            We will never accept payment from a brand or manufacturer to feature
            or positively review their product.
          </li>
          <li>
            We will never hide or obscure the fact that our links are affiliate
            links.
          </li>
          <li>
            We will never recommend a product we would not recommend to a friend
            making the same purchase.
          </li>
          <li>
            We will never fabricate reviews, ratings, or specifications.
          </li>
        </ul>
        <p>
          A product earning us 8% commission will not outrank a product earning us
          1% if the 1% product is genuinely better for you. Commission rates are
          invisible to our editorial process.
        </p>
      </>
    )
  },
  {
    number: "06",
    title: "How to Identify Affiliate Links",
    content: (
      <>
        <p>
          On PicksProof, every outbound link to Amazon.in is an affiliate link.
          You can identify them by:
        </p>
        <ul className={legalList}>
          <li>
            Button labels that say <strong>&ldquo;See Price&rdquo;</strong> or{" "}
            <strong>&ldquo;View on Amazon&rdquo;</strong>
          </li>
          <li>
            URLs that redirect to <strong>amazon.in</strong> — you can hover over
            any link to see the destination before clicking
          </li>
          <li>
            The affiliate tag in the URL (e.g.{" "}
            <strong>tag=picksproof-21</strong>) visible in your browser&apos;s
            address bar after clicking
          </li>
        </ul>
        <p>
          There are no hidden affiliate links on PicksProof. We do not use link
          shorteners or cloaking to disguise affiliate URLs.
        </p>
      </>
    )
  },
  {
    number: "07",
    title: "Third-Party Affiliate Programmes",
    content: (
      <p>
        Currently, Amazon.in is our only affiliate partner. If we ever add
        additional affiliate relationships (other retailers, brands, or
        networks), we will update this page and ensure all such links are clearly
        disclosed on relevant pages. We do not participate in paid review
        schemes, sponsored content arrangements, or any programme where editorial
        rankings are influenced by commercial relationships.
      </p>
    )
  },
  {
    number: "08",
    title: "Questions About This Disclosure?",
    content: (
      <p>
        If you have any questions about how our affiliate links work, or if you
        believe any content on PicksProof does not meet the standards described
        here, please get in touch. We read every message.{" "}
        <Link href="/contact" className={legalLink}>
          Contact Us →
        </Link>{" "}
        or{" "}
        <Link href="/editorial-policy" className={legalLink}>
          Read our Editorial Policy →
        </Link>
      </p>
    )
  }
];

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageShell
      title="Affiliate Disclosure"
      breadcrumbLabel="Affiliate Disclosure"
      description="Exactly how PicksProof earns from Amazon.in affiliate links — what it means for you, and our commitment to unbiased recommendations."
      lastUpdated="June 2026"
      icon="affiliate"
      activeHref="/affiliate-disclosure"
      sections={sections}
    />
  );
}
