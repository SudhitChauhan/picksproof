import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

function getSafeNextPath(value: string | undefined) {
  const isAdminPath = value?.startsWith("/admin") || value?.startsWith("/products");

  if (!value || !isAdminPath || value.startsWith("//")) {
    return "/products";
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
