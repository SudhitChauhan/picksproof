import Link from "next/link";
import { ArrowLeft, ShieldOff } from "lucide-react";

export const metadata = { title: "Unauthorized — PickProof" };

export default function UnauthorizedPage() {
  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--canvas)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            color: "var(--slate)"
          }}
        >
          <ShieldOff size={32} strokeWidth={1.4} />
        </div>

        <p className="eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>Access Denied</p>

        <div className="auth-card" style={{ textAlign: "left" }}>
          <h1 className="text-[1.6rem] mb-2.5 text-ink">
            Admin access required
          </h1>
          <p style={{ color: "var(--slate)", lineHeight: 1.7, margin: "0 0 28px" }}>
            The page you tried to visit is restricted to admin users. If you believe this is an
            error, contact the site owner to have your account upgraded.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/login" style={{ gap: 6 }}>
              Sign in as admin
            </Link>
            <Link className="btn-outline" href="/" style={{ gap: 6 }}>
              <ArrowLeft size={14} /> Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
