import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; reason?: string; next?: string }>;
};

function getSafeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "";
  return value;
}

function isAdminPath(value: string) {
  return value.startsWith("/admin") || value.startsWith("/products");
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
    redirect(`/login?error=auth&reason=${encodeURIComponent(error.message)}${nextParam}`);
  }

  const isAdmin = isAdminUser(user);
  if (next && isAdminPath(next) && !isAdmin) {
    await supabase.auth.signOut();
    redirect(`/unauthorized?next=${encodeURIComponent(next)}`);
  }

  if (next) redirect(next);
  redirect(isAdmin ? "/products" : "/profile");
}

export const metadata = { title: "Sign In — PickProof" };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) redirect("/profile");
  }

  const params = await searchParams;
  const hasError = params.error === "auth";
  const next = getSafeNextPath(params.next);
  const errorMessage = params.reason || "Could not sign in. Check your email and password.";

  return (
    <div className="auth-page">
      <div className="w-full max-w-[460px]">
        {/* Branding */}
        <div className="text-center mb-8">
          <p className="eyebrow justify-center">PickProof</p>
          <h1 className="text-[clamp(1.8rem,4vw,2.4rem)] font-medium tracking-[-0.02em] mt-3 mb-2 text-ink">
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
                <Link href="/register" className="text-ink font-semibold">
                  Create an account
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
