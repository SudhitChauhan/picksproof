import Link from "next/link";

export const metadata = {
  title: "Unauthorized - PickProof"
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-[calc(100vh-12rem)] bg-[radial-gradient(circle_at_top,rgba(194,65,50,0.12),transparent_30rem)] px-4 py-14 dark:bg-slate-950">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-admin-line bg-admin-surface p-8 shadow-[0_24px_70px_rgba(16,42,67,0.12)] dark:border-slate-800 dark:bg-slate-900">
        <span className="text-sm font-black uppercase tracking-[0.18em] text-red-700 dark:text-red-300">
          Access restricted
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-admin-ink dark:text-white md:text-6xl">
          You do not have admin access.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-admin-muted dark:text-slate-400">
          Admin pages require a Supabase Auth user with <code>app_metadata.role</code> set to{" "}
          <code>admin</code>. Use a different account or return to PickProof.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
            href="/"
          >
            Go Home
          </Link>
          <Link
            className="rounded-full border border-admin-line px-6 py-3 text-sm font-black text-admin-ink transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-100"
            href="/login?next=/products"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  );
}
