import Link from "next/link";
import { Calendar, ChevronRight, FileText, Handshake, Shield } from "lucide-react";
import {
  legalCard,
  legalContainer,
  legalEyebrow,
  legalPage,
  legalProse,
  legalSectionNum
} from "@/lib/legal-tw";

export type LegalSection = {
  number: string;
  title: string;
  content: React.ReactNode;
};

type LegalPageShellProps = {
  title: string;
  breadcrumbLabel: string;
  description: string;
  lastUpdated: string;
  icon: "terms" | "privacy" | "affiliate";
  activeHref?: string;
  sections: LegalSection[];
};

const LEGAL_ICONS = {
  terms: FileText,
  privacy: Shield,
  affiliate: Handshake
} as const;

const LEGAL_NAV = [
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/contact", label: "Contact" }
] as const;

function sectionId(number: string) {
  return `section-${number}`;
}

export function LegalPageShell({
  title,
  breadcrumbLabel,
  description,
  lastUpdated,
  icon,
  activeHref,
  sections,
}: LegalPageShellProps) {
  const Icon = LEGAL_ICONS[icon];

  return (
    <div className={legalPage}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-about-dark pb-16 pt-8 text-white md:pb-20 md:pt-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 90% 0%, rgba(232,90,27,.2), transparent 55%)"
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
          aria-hidden="true"
        />

        <div className={`${legalContainer} relative`}>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/50">
              <li>
                <Link href="/" className="transition-colors hover:text-about-orange">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="font-medium text-white/80">{breadcrumbLabel}</li>
            </ol>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-2xl">
              <p className={legalEyebrow}>Legal</p>
              <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                {description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <Calendar className="h-4 w-4 text-about-orange" aria-hidden="true" />
                Last updated: {lastUpdated}
              </div>
            </div>

            <div
              className="hidden h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 lg:flex"
              aria-hidden="true"
            >
              <Icon className="h-12 w-12 text-about-orange" strokeWidth={1.25} />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.href === activeHref
                    ? "rounded-full border border-about-orange/50 bg-about-orange/20 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 transition-colors hover:border-about-orange/40 hover:bg-white/10 hover:text-white"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className={`${legalContainer} grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16`}>
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <nav
              className="sticky top-28 rounded-[20px] border border-about-border bg-white p-5 shadow-[0_4px_20px_rgba(28,28,28,0.06)]"
              aria-label="On this page"
            >
              <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-about-orange">
                On this page
              </p>
              <ol className="m-0 list-none space-y-1 p-0">
                {sections.map((section) => (
                  <li key={section.number}>
                    <a
                      href={`#${sectionId(section.number)}`}
                      className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-[0.82rem] leading-snug text-about-muted transition-colors hover:bg-about-cream hover:text-about-dark"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-[0.65rem] font-bold text-about-orange/60 group-hover:text-about-orange">
                        {section.number}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Sections */}
          <div className="min-w-0 space-y-5">
            {sections.map((section) => (
              <article
                key={section.number}
                id={sectionId(section.number)}
                className={`${legalCard} scroll-mt-28 px-7 py-8 md:px-9 md:py-9`}
              >
                <span className={legalSectionNum}>{section.number}</span>
                <h2 className="relative mb-5 text-xl font-bold tracking-[-0.02em] text-about-dark">
                  {section.title}
                </h2>
                <div className={`relative ${legalProse}`}>{section.content}</div>
              </article>
            ))}

            {/* Footer cross-links */}
            <div className="rounded-[20px] border border-about-border bg-white px-7 py-6 shadow-[0_4px_20px_rgba(28,28,28,0.06)] md:px-9">
              <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-about-orange">
                Related pages
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-about-muted">
                <span className="font-medium text-about-dark">
                  © {new Date().getFullYear()} PicksProof
                </span>
                {LEGAL_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      item.href === activeHref
                        ? "font-semibold text-about-orange"
                        : "transition-colors hover:text-about-orange"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
