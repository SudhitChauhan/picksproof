import type { Metadata } from "next";
import Link from "next/link";
import { LegalDataTable } from "@/components/legal/LegalDataTable";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { legalCallout, legalLink, legalList } from "@/lib/legal-tw";

export const metadata: Metadata = {
  title: "Privacy Policy — PicksProof",
  description:
    "Learn how PicksProof collects, uses, and protects your personal data. We are committed to transparency."
};

const dataTableRows = [
  {
    type: "Account Data",
    collected: "Name, email, password (hashed)",
    when: "On registration"
  },
  {
    type: "Usage Data",
    collected: "Pages visited, searches, clicks",
    when: "During your visit"
  },
  {
    type: "Device Data",
    collected: "Browser, operating system, IP address",
    when: "During your visit"
  },
  {
    type: "Cookies",
    collected: "Session IDs, analytics tags",
    when: "On page load"
  },
  {
    type: "Communications",
    collected: "Contact form messages",
    when: "When you reach out"
  }
];

const sections = [
  {
    number: "01",
    title: "Overview",
    content: (
      <p>
        PicksProof operates picksproof.com, an Amazon.in affiliate product
        recommendation site serving users in India. We are committed to being
        transparent about how we collect, use, and protect your personal data.
        By using the Site, you agree to the practices described in this Privacy
        Policy.
      </p>
    )
  },
  {
    number: "02",
    title: "Data We Collect",
    content: (
      <>
        <LegalDataTable rows={dataTableRows} />
        <p className="mt-5">
          We do <strong>not</strong> collect payment information. All purchases
          are handled directly by Amazon.in.
        </p>
      </>
    )
  },
  {
    number: "03",
    title: "How We Use Your Data",
    content: (
      <>
        <p>We use the data we collect for the following purposes:</p>
        <ul className={legalList}>
          <li>To operate and maintain the Site</li>
          <li>To improve our content and user experience</li>
          <li>To track affiliate link performance (in aggregate)</li>
          <li>To communicate with you about your account or inquiries</li>
          <li>To protect the security and integrity of the Site</li>
        </ul>
        <p>
          PicksProof does not use your data for advertising purposes and does
          not build advertising profiles. We run no ads on the Site.
        </p>
      </>
    )
  },
  {
    number: "04",
    title: "Cookies & Tracking",
    content: (
      <>
        <p>We use the following types of cookies:</p>
        <ul className={legalList}>
          <li>
            <strong>Essential cookies</strong> — required for login sessions
            and core site functionality; these cannot be disabled
          </li>
          <li>
            <strong>Analytics cookies</strong> — e.g. Google Analytics; data is
            anonymized and aggregated
          </li>
          <li>
            <strong>Affiliate tracking</strong> — Amazon sets its own cookies
            when you click through to Amazon.in; governed by Amazon&apos;s
            privacy policy
          </li>
        </ul>
        <p>
          You can control cookie preferences through your browser settings.
          Disabling certain cookies may affect site functionality.
        </p>
      </>
    )
  },
  {
    number: "05",
    title: "Affiliate Links & Amazon",
    content: (
      <div className={legalCallout}>
        <p>
          <strong>Important:</strong> When you click an affiliate link and visit
          Amazon.in, Amazon collects data according to their own privacy policy.
          PicksProof receives only aggregate commission data from Amazon — we do
          not receive personal purchase information. For details, see{" "}
          <a
            href="https://www.amazon.in/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ"
            className={legalLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon India&apos;s Privacy Notice
          </a>
          .
        </p>
      </div>
    )
  },
  {
    number: "06",
    title: "Data Sharing",
    content: (
      <>
        <p>
          We do <strong>not</strong> sell your personal data. We may share
          limited data in the following circumstances:
        </p>
        <ul className={legalList}>
          <li>
            <strong>Service providers</strong> — hosting, analytics, and
            infrastructure partners bound by confidentiality agreements
          </li>
          <li>
            <strong>Legal requirements</strong> — when required by court order
            or government request under Indian law
          </li>
          <li>
            <strong>Business transfers</strong> — in the event of a merger or
            acquisition; registered users will be notified
          </li>
        </ul>
      </>
    )
  },
  {
    number: "07",
    title: "Data Security",
    content: (
      <p>
        We use HTTPS encryption on all pages, hash passwords before storage, and
        apply access controls to protect your data. While we take reasonable
        measures to safeguard your information, no method of transmission or
        storage is 100% secure, and we cannot guarantee absolute security.
      </p>
    )
  },
  {
    number: "08",
    title: "Data Retention",
    content: (
      <p>
        We retain your data for as long as your account is active. When you
        delete your account, we will remove your personal data within a
        reasonable timeframe, unless we are legally required to retain it.
        Analytics data is retained only in anonymized and aggregated form.
      </p>
    )
  },
  {
    number: "09",
    title: "Your Rights",
    content: (
      <>
        <p>You have the following rights regarding your personal data:</p>
        <ul className={legalList}>
          <li>
            <strong>Access</strong> — request a copy of the data we hold about you
          </li>
          <li>
            <strong>Correction</strong> — request correction of inaccurate information
          </li>
          <li>
            <strong>Deletion</strong> — request removal of your personal data
          </li>
          <li>
            <strong>Opt-out of emails</strong> — unsubscribe from communications at any time
          </li>
          <li>
            <strong>Account deletion</strong> — contact us to permanently delete your account
          </li>
        </ul>
        <p>We will respond to all requests within a reasonable timeframe.</p>
      </>
    )
  },
  {
    number: "10",
    title: "Children's Privacy",
    content: (
      <p>
        PicksProof is not directed at children under the age of 13. We do not
        knowingly collect personal data from children. If you believe a child
        has provided us with personal information, please contact us and we
        will take steps to remove it promptly.
      </p>
    )
  },
  {
    number: "11",
    title: "Policy Changes",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated effective date. For material
        changes, we will notify registered users via email. Your continued use
        of the Site after changes are posted constitutes acceptance of the
        updated policy.
      </p>
    )
  },
  {
    number: "12",
    title: "Contact Us",
    content: (
      <p>
        If you have questions about this Privacy Policy or wish to exercise your
        data rights, please visit{" "}
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      breadcrumbLabel="Privacy Policy"
      description="How PicksProof collects, uses, and protects your personal data — written plainly, with nothing hidden."
      lastUpdated="June 2026"
      icon="privacy"
      sections={sections}
    />
  );
}
