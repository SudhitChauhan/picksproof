import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { legalCallout, legalLink, legalList } from "@/lib/legal-tw";

export const metadata: Metadata = {
  title: "Terms & Conditions — PicksProof",
  description:
    "Read the Terms and Conditions for using PicksProof, an Amazon affiliate product recommendation site for Indian shoppers."
};

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using picksproof.com (the &ldquo;Site&rdquo;), you agree
          to be bound by these Terms &amp; Conditions. If you do not agree with
          any part of these terms, please do not use the Site.
        </p>
        <p>
          These terms apply to all visitors and users of the Site, whether or not
          you have registered for an account.
        </p>
      </>
    )
  },
  {
    number: "02",
    title: "About PicksProof",
    content: (
      <>
        <p>
          PicksProof is a product recommendation website serving shoppers in
          India. We provide data-backed product specifications, honest
          comparisons, and direct links to Amazon.in across five categories:
          Electronics &amp; Tech, Home &amp; Kitchen, Beauty &amp; Wellness,
          Apparel &amp; Footwear, and Health, Fitness &amp; Sports.
        </p>
        <p>
          All products featured on the Site are curated by our editorial team.
          We do not pull product listings automatically via API — every
          recommendation is reviewed and selected by humans.
        </p>
      </>
    )
  },
  {
    number: "03",
    title: "Affiliate Disclosure",
    content: (
      <div className={legalCallout}>
        <p>
          <strong>Important:</strong> PicksProof is a participant in the Amazon
          Associates Programme. We earn a commission when you purchase products
          through our affiliate links at no extra cost to you. Our affiliate
          status does not influence our editorial decisions. We never accept
          payments from brands or manufacturers to feature or rank products on
          the Site.
        </p>
      </div>
    )
  },
  {
    number: "04",
    title: "Content & Accuracy",
    content: (
      <>
        <p>
          We strive to keep product specifications, prices, and availability
          information accurate and up to date. However, product details can
          change without notice. Prices and stock status on Amazon.in may differ
          from what is shown on our Site.
        </p>
        <p>
          Always verify product details, pricing, and availability directly on
          Amazon.in before making a purchase. PicksProof does not sell products
          directly — all transactions are completed on Amazon.in.
        </p>
      </>
    )
  },
  {
    number: "05",
    title: "Acceptable Use",
    content: (
      <>
        <p>
          You agree not to use the Site for any unlawful or prohibited purpose.
          Specifically, you must not:
        </p>
        <ul className={legalList}>
          <li>Scrape, copy, or reproduce Site content for commercial purposes</li>
          <li>Use automated bots, crawlers, or scripts to access the Site</li>
          <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
          <li>Send spam, unsolicited messages, or harass other users</li>
          <li>Impersonate PicksProof, its staff, or other users</li>
          <li>Distribute malware, viruses, or other harmful code through the Site</li>
        </ul>
      </>
    )
  },
  {
    number: "06",
    title: "User Accounts",
    content: (
      <>
        <p>
          If you create an account on PicksProof, you are responsible for
          maintaining the confidentiality of your login credentials and for all
          activity that occurs under your account.
        </p>
        <p>
          You must notify us immediately if you suspect unauthorized use of your
          account. We reserve the right to suspend or terminate accounts that
          violate these terms or are used for misuse of the Site.
        </p>
      </>
    )
  },
  {
    number: "07",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All original content on PicksProof — including text, comparisons,
          ratings, and editorial commentary — is the property of PicksProof and
          is protected by applicable copyright laws.
        </p>
        <p>
          Brand names, product images, and trademarks displayed on the Site
          belong to their respective owners and are used descriptively for
          identification purposes only. No content from this Site may be
          reproduced, distributed, or republished without our prior written
          consent.
        </p>
      </>
    )
  },
  {
    number: "08",
    title: "Third-Party Links",
    content: (
      <>
        <p>
          The Site contains links to third-party websites, primarily Amazon.in.
          These links are provided for your convenience. PicksProof does not
          control and is not responsible for the content, privacy practices, or
          terms of any third-party site.
        </p>
        <p>
          When you leave PicksProof and visit a third-party site, that
          site&apos;s own terms and privacy policy apply. We encourage you to
          review them before proceeding.
        </p>
      </>
    )
  },
  {
    number: "09",
    title: "Disclaimers",
    content: (
      <>
        <p>
          The Site and all content are provided on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis without warranties of any kind,
          whether express or implied.
        </p>
        <p>
          We do not warrant the accuracy, completeness, or reliability of any
          content, nor do we guarantee uninterrupted or error-free operation of
          the Site. Product ratings and recommendations reflect our editorial
          assessment only and should not be treated as professional advice.
        </p>
      </>
    )
  },
  {
    number: "10",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, PicksProof shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the Site, including but not limited
          to damages from affiliate purchases, content inaccuracies, or
          unauthorized account access.
        </p>
        <p>
          Our total liability to you for any claim arising from these terms or
          your use of the Site shall not exceed ₹500 (Indian Rupees five
          hundred).
        </p>
      </>
    )
  },
  {
    number: "11",
    title: "Changes to Terms",
    content: (
      <p>
        We may update these Terms &amp; Conditions from time to time. When we
        do, we will revise the effective date at the top of this page. Your
        continued use of the Site after any changes constitutes acceptance of
        the updated terms. We encourage you to review this page periodically.
      </p>
    )
  },
  {
    number: "12",
    title: "Contact Us",
    content: (
      <p>
        If you have questions about these Terms &amp; Conditions, please visit{" "}
        <a href="https://picksproof.com" className={legalLink}>
          picksproof.com
        </a>{" "}
        or reach out via our{" "}
        <Link href="/contact" className={legalLink}>
          contact page
        </Link>
        .
      </p>
    )
  }
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      breadcrumbLabel="Terms & Conditions"
      description="The rules and guidelines for using PicksProof — our Amazon affiliate product recommendation site for Indian shoppers."
      lastUpdated="June 2026"
      icon="terms"
      sections={sections}
    />
  );
}
