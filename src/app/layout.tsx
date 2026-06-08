import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GlobalNavigationLoader } from "@/components/GlobalNavigationLoader";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  title: "PicksProof — Data-backed Amazon affiliate recommendations",
  description:
    "Compare products with transparent specs and clear affiliate links to Amazon.in.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} page-wrapper`}>
        <Analytics />
        <SpeedInsights />
        <GlobalNavigationLoader />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
