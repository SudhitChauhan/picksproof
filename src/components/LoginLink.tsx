"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { buildLoginHref } from "@/lib/auth/redirect";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function getCurrentPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function LoginLink({ children, className, style }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const href = buildLoginHref(getCurrentPath(pathname, searchParams));

  return (
    <Link className={className} href={href} style={style}>
      {children}
    </Link>
  );
}
