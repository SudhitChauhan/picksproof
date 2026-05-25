import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    reason?: string;
  }>;
};

async function register(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth
    .signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "user"
        }
      }
    })
    .catch((error) => ({
      error: error instanceof Error ? error : new Error("Could not reach Supabase. Please try again.")
    }));

  if (error) {
    redirect(`/register?error=signup&reason=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();
  redirect("/login?message=registered");
}

export const metadata = {
  title: "Create Account - PickProof"
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const hasSignupError = params.error === "signup";
  const errorMessage = params.reason || "Could not create your account. Please try again.";

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_30rem)] px-4 py-14 dark:bg-slate-950">
      <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
            Join PickProof
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
            Create your review hub account.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-admin-muted dark:text-slate-400">
            Register as a standard user to save preferences and access future shopper features.
            Admin access is controlled separately through Supabase app metadata.
          </p>
        </div>

        <div className="rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.12)] dark:border-slate-800 dark:bg-slate-900">
          {!isSupabaseConfigured() ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> before creating
              accounts.
            </div>
          ) : (
            <form action={register} className="grid gap-5">
              {hasSignupError ? (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                  {errorMessage}
                </div>
              ) : null}

              <label className="text-sm font-bold text-admin-ink dark:text-slate-100">
                Name
                <input
                  autoComplete="name"
                  className="mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  name="name"
                  placeholder="Jane Shopper"
                  required
                  type="text"
                />
              </label>

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
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  minLength={8}
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  type="password"
                />
              </label>

              <button
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                type="submit"
              >
                Create Account
              </button>

              <p className="text-center text-sm font-semibold text-admin-muted dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  className="font-black text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
                  href="/login"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
