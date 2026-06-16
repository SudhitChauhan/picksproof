import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { LoginLink } from "@/components/LoginLink";
import { RegisterLink } from "@/components/RegisterLink";
import { getAuthErrorKind, getSignInErrorMessage } from "@/lib/auth-errors";
import { ADMIN_ROUTES, isAdminAppPath } from "@/lib/admin/routes";
import { getSafeNextPath } from "@/lib/auth/redirect";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

function isAdminPath(value: string) {
  return isAdminAppPath(value);
}

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(String(formData.get("next") ?? ""));
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error
  } = await supabase.auth
    .signInWithPassword({ email, password })
    .catch((e) => ({
      data: { user: null },
      error: e instanceof Error ? e : new Error("Could not reach Supabase.")
    }));

  if (error) {
    const nextParam = next ? `&next=${encodeURIComponent(next)}` : "";
    const errorKind = getAuthErrorKind(error);
    redirect(`/login?error=${errorKind}${nextParam}`);
  }

  const isAdmin = isAdminUser(user);
  if (next && isAdminPath(next) && !isAdmin) {
    await supabase.auth.signOut();
    redirect(`/unauthorized?next=${encodeURIComponent(next)}`);
  }

  if (next) redirect(next);
  redirect(isAdmin ? ADMIN_ROUTES.dashboard : "/profile");
}

export const metadata = { title: "Sign In — PicksProof" };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeNextPath(params.next);

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      if (next) redirect(next);
      redirect(isAdminUser(session.user) ? ADMIN_ROUTES.dashboard : "/profile");
    }
  }

  const errorKind = params.error === "server" || params.error === "auth" ? params.error : undefined;
  const hasError = Boolean(errorKind);
  const errorMessage = getSignInErrorMessage(errorKind);

  return (
    <div className="auth-page">
      <div className="w-full max-w-[460px]">
        {/* Branding */}
        <div className="text-center mb-8">
          <Logo variant="auth" />
          <h1 className="text-[clamp(1.8rem,4vw,2.4rem)] mt-6 mb-2 text-ink">
            Sign in
          </h1>
          <p className="text-slate text-[0.95rem] leading-relaxed m-0">
            Admin users are sent to the product dashboard. Standard users go to their profile.
          </p>
        </div>

        <div className="auth-card">
          {!isSupabaseConfigured() ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-900">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>.
            </div>
          ) : (
            <form action={login} className="grid gap-5">
              <input name="next" type="hidden" value={next} />

              {hasError && (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
                  {errorMessage}
                </div>
              )}

              <div className="auth-field">
                <label>Email</label>
                <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input autoComplete="current-password" name="password" placeholder="Your password" required type="password" />
              </div>

              <button
                className="btn-primary w-full justify-center py-3 rounded-btn"
                type="submit"
              >
                Sign In
              </button>

              <p className="text-center text-[0.8rem] text-slate m-0">
                New here?{" "}
                <Suspense fallback={<Link href="/register" className="text-ink font-semibold">Create an account</Link>}>
                  <RegisterLink className="text-ink font-semibold">Create an account</RegisterLink>
                </Suspense>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
