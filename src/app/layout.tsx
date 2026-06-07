import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GlobalNavigationLoader } from "@/components/GlobalNavigationLoader";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { categories } from "@/lib/data";
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
        <footer className="site-footer">
          <div className="site-footer-inner">
            <h2>We&apos;re always here when you need us.</h2>
            <div className="site-footer-cols">
              <div className="site-footer-col">
                <Logo href="/" variant="footer" />
                <a href="/">Home</a>
                <a href="/about">About</a>
                {categories.map((cat) => (
                  <a href={`/categories/${cat.slug}`} key={cat.slug}>
                    {cat.title}
                  </a>
                ))}
              </div>
              <div className="site-footer-col">
                <h4>Account</h4>
                <a href="/login">Sign In</a>
                <a href="/register">Create Account</a>
                <a href="/profile">Profile</a>
              </div>
              <div className="site-footer-col">
                <h4>Disclosure</h4>
                <a href="#">Affiliate Policy</a>
                <a href="#">Privacy</a>
                <a href="/contact">Contact</a>
              </div>
            </div>
            <div className="site-footer-bottom">
              <small>
                © {new Date().getFullYear()} PicksProof. As an Amazon Associate we earn from qualifying purchases.
              </small>
              <small>Prices and availability may change.</small>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
