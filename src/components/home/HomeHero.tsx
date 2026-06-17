import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import { HeroLocationBadge } from "./HeroLocationBadge";
import { HomeHeroSearch } from "./HomeHeroSearch";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=75";

export function HomeHero() {
  return (
    <section className="hero-frame">
      <div aria-hidden className="hero-frame-glow" />
      <div className="hero-frame-inner">
        <div className="hero-visual">
          <Image
            alt=""
            aria-hidden
            className="hero-visual-img"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            src={HERO_IMAGE}
          />
          <div aria-hidden className="hero-visual-gradient" />

          <div className="hero-visual-copy">
            {/* <p className="hero-visual-eyebrow">Data-backed affiliate recommendations</p> */}
            <h1>
              Choose smarter, buy with <span className="hero-text-gradient">proof</span>.
            </h1>
            <p className="hero-visual-lead">
              From everyday essentials to top-rated gear — discover products backed by honest
              specs, side-by-side compare, and direct Amazon.in links.
            </p>

            <div className="hero-visual-actions">
              <Link className="hero-visual-action hero-visual-action--primary" href="/search">
                Browse all picks
              </Link>
              <Link className="hero-visual-action" href="#how-it-works">
                How it works
              </Link>
              <Link className="hero-visual-action" href="/categories">
                Categories
              </Link>
            </div>
          </div>

          <HeroLocationBadge />
        </div>

        <HomeHeroSearch categories={categories} />
      </div>
    </section>
  );
}
