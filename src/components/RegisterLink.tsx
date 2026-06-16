"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { buildRegisterHref } from "@/lib/auth/redirect";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function getCurrentPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function RegisterLink({ children, className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const href = buildRegisterHref(getCurrentPath(pathname, searchParams));

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
