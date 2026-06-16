import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref = ADMIN_ROUTES.dashboard,
  backLabel = "Back to dashboard"
}: Props) {
  return (
    <header className="admin-form-header">
      <Link className="admin-back-link" href={backHref}>
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
