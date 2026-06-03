import type { Metadata } from "next";
import { GlobalNavigationLoader } from "@/components/GlobalNavigationLoader";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickProof — Data-backed Amazon affiliate recommendations",
  description:
    "Compare products with transparent specs and clear affiliate links to Amazon.in."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="page-wrapper">
        <GlobalNavigationLoader />
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <h2>We&apos;re always here when you need us.</h2>
            <div className="site-footer-cols">
              <div className="site-footer-col">
                <h4>PickProof</h4>
                <a href="/">Home</a>
                <a href="/categories/best-laptops">Best Laptops</a>
                <a href="/categories/electronics">Electronics</a>
                <a href="/categories/home">Home</a>
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
                <a href="#">Contact</a>
              </div>
            </div>
            <div className="site-footer-bottom">
              <small>
                © {new Date().getFullYear()} PickProof. As an Amazon Associate we earn from qualifying purchases.
              </small>
              <small>Prices and availability may change.</small>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
