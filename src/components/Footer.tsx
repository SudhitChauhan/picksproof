import { Logo } from "@/components/Logo";
import { LoginLink } from "@/components/LoginLink";
import { RegisterLink } from "@/components/RegisterLink";
import { ADMIN_ROUTES } from "@/lib/admin/routes";
import { categories } from "@/lib/data";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Suspense } from "react";

const currentYear = new Date().getFullYear();

async function getFooterUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user ?? null;
  } catch {
    return null;
  }
}

export async function Footer() {
  const user = await getFooterUser();
  const isAdmin = isAdminUser(user);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <h2>We&apos;re always here when you need us.</h2>

        <div className="site-footer-cols">
          <div className="site-footer-col site-footer-col--brand">
            <Logo href="/" variant="footer" />
            <p className="site-footer-tagline">
              Data-backed product picks and honest comparisons for Indian shoppers.
            </p>
          </div>

          <div className="site-footer-col">
            <h4>Explore</h4>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/search">Browse Reviews</a>
          </div>

          <div className="site-footer-col">
            <h4>Categories</h4>
            {categories.map((cat) => (
              <a href={`/categories/${cat.slug}`} key={cat.slug}>
                {cat.title}
              </a>
            ))}
          </div>

          <div className="site-footer-col">
            <h4>Account &amp; Legal</h4>
            {user ? (
              <>
                <a href="/profile">My Profile</a>
                <a href="/wishlist">Wishlist</a>
                {isAdmin && <a href={ADMIN_ROUTES.dashboard}>Admin Dashboard</a>}
              </>
            ) : (
              <>
                <Suspense fallback={<a href="/login">Sign In</a>}>
                  <LoginLink>Sign In</LoginLink>
                </Suspense>
                <Suspense fallback={<a href="/register">Create Account</a>}>
                  <RegisterLink>Create Account</RegisterLink>
                </Suspense>
              </>
            )}

            <div className="site-footer-inline-divider" aria-hidden="true" />

            <a href="/terms-and-conditions">Terms &amp; Conditions</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/affiliate-disclosure">Affiliate Disclosure</a>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-bottom-copy">
            © {currentYear} PicksProof. As an Amazon Associate we earn from qualifying
            purchases.
          </p>
          <p className="site-footer-bottom-note">
            Product prices and availability on Amazon.in are subject to change without
            notice.
          </p>
        </div>
      </div>
    </footer>
  );
}
