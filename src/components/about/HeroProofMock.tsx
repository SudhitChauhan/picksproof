import Image from "next/image";
import { Check, ExternalLink, Star } from "lucide-react";
import { ABOUT_IMAGES } from "@/lib/about-images";
import { aboutImage } from "@/lib/about-tw";

const MOCK_PRODUCTS = [
  {
    name: "SoundCore Liberty 4 NC",
    category: "Earbuds · ANC",
    rating: "4.3",
    image: ABOUT_IMAGES.heroProducts[0],
    specs: [
      { label: "ANC", value: "−46 dB" },
      { label: "Battery", value: "10 hrs" },
      { label: "IP rating", value: "IPX4" }
    ],
    offset: false
  },
  {
    name: "boAt Airdopes 800",
    category: "Earbuds · Budget",
    rating: "4.1",
    image: ABOUT_IMAGES.heroProducts[1],
    specs: [
      { label: "ANC", value: "−35 dB" },
      { label: "Battery", value: "8 hrs" },
      { label: "Warranty", value: "1 year" }
    ],
    offset: true
  }
] as const;

export function HeroProofMock() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {MOCK_PRODUCTS.map((product) => (
        <div
          className={`rounded-2xl border border-about-border bg-white p-4 shadow-[0_4px_20px_rgba(28,28,28,0.06)] ${product.offset ? "translate-x-3" : ""}`}
          key={product.name}
        >
          <div className="mb-3 flex items-start gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-about-border">
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                sizes="56px"
                quality={90}
                className={aboutImage}
              />
            </div>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-about-orange text-white">
              <Check size={14} strokeWidth={2.5} />
            </span>
            <div>
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-wide text-about-muted">
                {product.category}
              </p>
              <p className="m-0 text-sm font-bold text-about-dark">{product.name}</p>
            </div>
          </div>

          <p className="mb-3 flex items-center gap-1 text-xs text-about-muted">
            <Star size={12} className="text-about-orange" />
            {product.rating} on Amazon
          </p>

          <dl className="mb-3 grid grid-cols-3 gap-2 text-center">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[0.65rem] uppercase tracking-wide text-about-muted">
                  {spec.label}
                </dt>
                <dd className="m-0 text-xs font-semibold text-about-dark">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-about-orange">
            See on Amazon.in <ExternalLink size={12} />
          </span>
        </div>
      ))}
    </div>
  );
}
