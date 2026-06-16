import { Suspense } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePageBody } from "@/components/home/HomePageBody";
import { HomePageSkeleton } from "@/components/home/HomePageSkeleton";

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeHero />

      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageBody />
      </Suspense>
    </div>
  );
}
