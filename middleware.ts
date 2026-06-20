import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isProtectedProductsPath } from "@/lib/admin/routes";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/products") && !isProtectedProductsPath(pathname)) {
    return NextResponse.next({ request });
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/products", "/products/:path*"]
};
