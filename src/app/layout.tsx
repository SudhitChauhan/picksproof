import type { Metadata } from "next";
import { GlobalNavigationLoader } from "@/components/GlobalNavigationLoader";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickProof - Data-backed Amazon affiliate recommendations",
  description: "Compare products with transparent scores, reviews, pros and cons, and Amazon affiliate links."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalNavigationLoader />
        <Header />
        {children}
        <footer className="site-footer">
          <strong>PickProof</strong>
          <span>
            As an Amazon Associate, PickProof earns from qualifying purchases. Prices and availability can change.
          </span>
        </footer>
      </body>
    </html>
  );
}
