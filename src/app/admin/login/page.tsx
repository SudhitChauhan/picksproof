import { redirect } from "next/navigation";
import { ADMIN_ROUTES, isAdminAppPath } from "@/lib/admin/routes";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function getSafeNextPath(value: string | undefined) {
  if (!value || !isAdminAppPath(value) || value.startsWith("//")) {
    return ADMIN_ROUTES.dashboard;
  }

  return value;
}

export const metadata = {
  title: "Admin Login - PickProof"
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeNextPath(params.next);

  redirect(`/login?next=${encodeURIComponent(next)}`);
}
