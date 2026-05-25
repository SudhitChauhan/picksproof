import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/supabase/auth";
import { createSupabaseFetch } from "@/lib/supabase/fetch";

function getSafeNextPath(value: string | null) {
  const isAdminPath = value?.startsWith("/admin") || value?.startsWith("/products");

  if (!value || !isAdminPath || value.startsWith("//")) {
    return "/products";
  }

  return value;
}

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: createSupabaseFetch()
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname === "/admin/login";
  const isAdmin = isAdminUser(user);

  if (isAuthPage) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set(
      "next",
      getSafeNextPath(request.nextUrl.searchParams.get("next"))
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (user && !isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/unauthorized";
    redirectUrl.search = "";
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
