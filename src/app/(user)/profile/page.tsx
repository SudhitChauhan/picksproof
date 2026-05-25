import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, Lock, LogOut, Mail, Shield, Trash2, UserRound } from "lucide-react";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type ProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

async function updateDisplayName(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      name,
      role: "user"
    }
  });

  if (error) {
    redirect("/profile?error=name");
  }

  redirect("/profile?message=name-updated");
}

async function updatePassword(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirect("/profile?error=password");
  }

  redirect("/profile?message=password-updated");
}

async function signOut() {
  "use server";

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export const metadata = {
  title: "Profile - PickProof"
};

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <SetupRequired />
      </main>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = String(user.user_metadata.name ?? "").trim();
  const initial = (displayName || user.email || "U").charAt(0).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_32rem)] px-4 py-10 dark:bg-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-600 text-3xl font-black text-white shadow-lg shadow-emerald-900/20">
              {initial}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                User Profile
              </span>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-5xl">
                Hi, {displayName || "there"}.
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-admin-muted dark:text-slate-400">
                <Mail className="size-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {params.message ? (
          <div className="mt-6 rounded-3xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {params.message === "password-updated"
              ? "Password updated successfully."
              : "Profile updated successfully."}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-3xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-bold text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            We could not save that change. Please try again.
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex gap-4 border-b border-admin-line pb-4 dark:border-slate-800">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                <UserRound className="size-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-admin-ink dark:text-white">
                  Account Settings
                </h2>
                <p className="mt-1 text-sm text-admin-muted dark:text-slate-400">
                  Manage the basics for your PickProof account.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <form action={updateDisplayName} className="grid gap-4">
                <label className="text-sm font-bold text-admin-ink dark:text-slate-100">
                  Display Name
                  <input
                    className="mt-2 w-full rounded-2xl border border-admin-line bg-white px-4 py-3 text-sm text-admin-ink outline-none transition focus:border-admin-accent focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    defaultValue={displayName}
                    name="name"
                    placeholder="Your name"
                    required
                    type="text"
                  />
                </label>
                <button
                  className="w-fit rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                  type="submit"
                >
                  Save Display Name
                </button>
              </form>

              <form action={updatePassword} className="grid gap-4 border-t border-admin-line pt-6 dark:border-slate-800">
                <label className="text-sm font-bold text-admin-ink dark:text-slate-100">
                  New Password
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
                  className="w-fit rounded-full border border-admin-line px-5 py-3 text-sm font-black text-admin-ink transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-100"
                  type="submit"
                >
                  Update Password
                </button>
              </form>
            </div>
          </section>

          <aside className="grid gap-6 self-start">
            <section className="rounded-[2rem] border border-admin-line bg-admin-surface p-6 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h2 className="font-black text-admin-ink dark:text-white">Account Role</h2>
                  <p className="text-sm font-semibold text-admin-muted dark:text-slate-400">
                    {String(user.user_metadata.role ?? "user")}
                  </p>
                </div>
              </div>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-admin-line px-5 py-3 text-sm font-black text-admin-ink transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-100"
                href="/wishlist"
              >
                View Saved Products
              </Link>
            </section>

            <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-950 shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-red-900 dark:bg-red-950 dark:text-red-100">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 size-5 shrink-0" />
                <div>
                  <h2 className="text-xl font-black">Danger Zone</h2>
                  <p className="mt-2 text-sm font-semibold leading-6">
                    Sign out safely, or request account deletion once the backend deletion workflow
                    is enabled.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <form action={signOut}>
                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
                    type="submit"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </form>
                <button
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-red-300 px-5 py-3 text-sm font-black opacity-60 dark:border-red-800"
                  disabled
                  type="button"
                >
                  <Trash2 className="size-4" />
                  Delete Account
                </button>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SetupRequired() {
  return (
    <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      <Lock className="size-8" />
      <h1 className="mt-3 text-4xl font-black tracking-tight">Connect Supabase first</h1>
      <p className="mt-4 leading-7">
        Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your local environment before managing your
        profile.
      </p>
    </div>
  );
}
