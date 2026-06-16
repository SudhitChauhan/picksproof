import Link from "next/link";
import { ArrowRight, BookOpen, GitCompare, Search, ShoppingBag } from "lucide-react";
import { HomeSectionHead } from "./HomeSectionHead";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Search or browse",
    body: "Start with a category hub or type what you need — wireless earbuds, air fryer, whey protein, and more.",
    href: "/search",
    cta: "Open search"
  },
  {
    step: "02",
    icon: BookOpen,
    title: "Read the full breakdown",
    body: "Every pick includes grouped specs, pros, trade-offs, and who it's for — no marketing fluff.",
    href: "/search",
    cta: "Browse reviews"
  },
  {
    step: "03",
    icon: GitCompare,
    title: "Compare side by side",
    body: "Select up to three products in a category and stack battery, build, warranty, and price at a glance.",
    href: "/categories/electronics-tech",
    cta: "Try compare"
  },
  {
    step: "04",
    icon: ShoppingBag,
    title: "Buy on Amazon.in",
    body: "When you're ready, follow a direct affiliate link — transparent, honest, and no pressure copy.",
    href: "/about",
    cta: "Our approach"
  }
] as const;

export function HomeHowItWorks() {
  return (
    <section className="pp-section home-how-section home-band-muted" id="how-it-works">
      <HomeSectionHead
        eyebrow="Simple workflow"
        lead="PicksProof is built for shoppers who want proof before they buy — not another listicle."
        title={
          <>
            From search to <em>confident</em> purchase
          </>
        }
      />

      <div className="home-steps-grid">
        {STEPS.map(({ step, icon: Icon, title, body, href, cta }) => (
          <article className="home-step-card" key={step}>
            <div className="home-step-top">
              <span className="home-step-number">{step}</span>
              <span aria-hidden className="home-step-icon">
                <Icon className="size-5" />
              </span>
            </div>
            <h3>{title}</h3>
            <p>{body}</p>
            <Link className="home-step-link" href={href}>
              {cta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
