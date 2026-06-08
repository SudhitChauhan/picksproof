import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getAuthErrorKind, getSignUpErrorMessage } from "@/lib/auth-errors";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function register(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Use the env-configured site URL so the confirmation email always
  // points to the right domain (not localhost when running in production,
  // not a production URL when testing locally).
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth
    .signUp({
      email,
      password,
      options: {
        data: { name, role: "user" },
        // Supabase will append ?code=... to this URL
        emailRedirectTo: `${origin}/auth/callback`
      }
    })
    .catch((e) => ({
      data: { session: null, user: null },
      error: e instanceof Error ? e : new Error("Could not reach Supabase.")
    }));

  if (error) {
    const errorKind = getAuthErrorKind(error);
    redirect(`/register?error=${errorKind}`);
  }

  // Email confirmation is DISABLED in Supabase → session returned immediately
  if (data?.session) {
    redirect("/profile");
  }

  // Email confirmation is ENABLED → show the "check your inbox" page
  redirect(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
}

export const metadata = { title: "Create Account — PicksProof" };

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const errorKind = params.error === "server" || params.error === "auth" ? params.error : undefined;
  const hasError = Boolean(errorKind);
  const errorMessage = getSignUpErrorMessage(errorKind);

  return (
    <div className="auth-page">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-8">
          <Logo variant="auth" />
          <h1 className="text-[clamp(1.8rem,4vw,2.4rem)] mt-6 mb-2 text-ink">
            Create your account
          </h1>
          <p className="text-slate text-[0.95rem] leading-relaxed m-0">
            Register to access your profile. Admin access is set separately.
          </p>
        </div>

        <div className="auth-card">
          {!isSupabaseConfigured() ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-900">
              Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>.
            </div>
          ) : (
            <form action={register} className="grid gap-5">
              {hasError && (
                <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
                  {errorMessage}
                </div>
              )}

              <div className="auth-field">
                <label>Full Name</label>
                <input autoComplete="name" name="name" placeholder="Jane Shopper" required type="text" />
              </div>

              <div className="auth-field">
                <label>Email</label>
                <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  autoComplete="new-password"
                  minLength={8}
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  type="password"
                />
              </div>

              <button className="btn-primary w-full justify-center py-3 rounded-btn" type="submit">
                Create Account
              </button>

              <p className="text-center text-[0.875rem] text-slate m-0">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-ink">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
