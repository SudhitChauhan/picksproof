import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    reason?: string;
    message?: string;
    next?: string;
  }>;
};

function isAdminPath(value: string) {
  return value.startsWith("/admin") || value.startsWith("/products");
}

function getSafeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "";
  }

  return value;
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
  } = await supabase.auth.signInWithPassword({ email, password }).catch((error) => ({
    data: { user: null },
    error: error instanceof Error ? error : new Error("Could not reach Supabase. Please try again.")
  }));

  if (error) {
    const nextParam = next ? `&next=${encodeURIComponent(next)}` : "";
    redirect(`/login?error=auth&reason=${encodeURIComponent(error.message)}${nextParam}`);
  }

  const isAdmin = isAdminUser(user);

  if (next && isAdminPath(next) && !isAdmin) {
    await supabase.auth.signOut();
    redirect(`/unauthorized?next=${encodeURIComponent(next)}`);
  }

  if (next) {
    redirect(next);
  }

  redirect(isAdmin ? "/products" : "/profile");
}

export const metadata = {
  title: "Login - PickProof"
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasAuthError = params.error === "auth";
  const wasRegistered = params.message === "registered";
  const next = getSafeNextPath(params.next);
  const authErrorMessage = params.reason || "Could not sign in. Check your email and password.";

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_30rem)] px-4 py-14 dark:bg-slate-950">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            PickProof Account
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
            Sign in to your account.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-admin-muted dark:text-slate-400">
            Use one login for shopper and admin accounts. Admin users are sent to the product
            dashboard, while standard users continue to their profile.
          </p>
        </div>

        <div className="rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.12)] dark:border-slate-800 dark:bg-slate-900">
          {!isSupabaseConfigured() ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> before logging
              in.
            </div>
          ) : (
            <form action={login} className="grid gap-5">
              <input name="next" type="hidden" value={next} />

              {wasRegistered ? (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  Account created. Sign in to continue.
                </div>
              ) : null}

              {hasAuthError ? (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                  {authErrorMessage}
                </div>
              ) : null}

              <label className="text-sm font-bold text-admin-ink dark:text-slate-100">
                Email
                <input
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>

              <label className="text-sm font-bold text-admin-ink dark:text-slate-100">
                Password
                <input
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  name="password"
                  placeholder="Your password"
                  required
                  type="password"
                />
              </label>

              <button
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                type="submit"
              >
                Sign In
              </button>

              <p className="text-center text-sm font-semibold text-admin-muted dark:text-slate-400">
                Need an account?{" "}
                <Link
                  className="font-black text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
                  href="/register"
                >
                  Create one
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
