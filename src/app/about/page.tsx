import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About — PicksProof",
  description:
    "Proof before you press Buy. Learn how PicksProof researches products, earns trust, and helps Indian shoppers decide with evidence — not noise."
};

export default function AboutPage() {
  return <AboutPageContent />;
}
