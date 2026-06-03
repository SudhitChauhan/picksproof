import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { SessionPoller } from "@/app/auth/confirm-email/SessionPoller";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ email?: string }> };

export const metadata = { title: "Confirm your email — PickProof" };
export const dynamic = "force-dynamic";

export default async function ConfirmEmailPage({ searchParams }: Props) {
  // If already logged in, skip this page
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (session) redirect("/profile");
  }

  const { email } = await searchParams;
  const maskedEmail = email
    ? email.replace(/^(.{2})(.+)(@.+)$/, (_m, a, _b, c) => `${a}****${c}`)
    : "your inbox";

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px"
          }}
        >
          <Mail size={30} color="var(--canvas)" />
        </div>

        <p className="eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>
          One more step
        </p>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
            color: "var(--ink)"
          }}
        >
          Check your inbox
        </h1>
        <p
          style={{
            color: "var(--slate)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            margin: "0 0 36px"
          }}
        >
          We&apos;ve sent a confirmation link to{" "}
          <strong style={{ color: "var(--ink)" }}>{maskedEmail}</strong>.
          <br />
          Click the link in that email — you&apos;ll be signed in automatically right here,
          no need to enter your password again.
        </p>

        {/* Card with steps */}
        <div className="auth-card" style={{ textAlign: "left", marginBottom: 20 }}>
          <ol style={{ margin: 0, padding: "0 0 0 20px", display: "grid", gap: 14 }}>
            <li style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Open the email from <strong style={{ color: "var(--ink)" }}>PickProof</strong> (check spam if needed)
            </li>
            <li style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Click <strong style={{ color: "var(--ink)" }}>Confirm email address</strong>
            </li>
            <li style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              You&apos;ll be instantly signed in and taken to your profile — no password required
            </li>
          </ol>

          {/* Live poller — auto-redirects when session appears */}
          <SessionPoller />
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--slate)" }}>
          Wrong email?{" "}
          <Link href="/register" style={{ fontWeight: 700, color: "var(--ink)" }}>
            Register again
          </Link>
          {" · "}
          <Link href="/login" style={{ fontWeight: 700, color: "var(--ink)" }}>
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
