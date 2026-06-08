import { NextResponse } from "next/server";
import { getAuthErrorKind } from "@/lib/auth-errors";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Handles the email-confirmation redirect from Supabase.
 *
 * Supabase appends ?code=... (PKCE flow) when the user clicks the
 * confirmation link in their inbox.  We exchange that code for a session
 * here so the user is automatically signed in without having to type their
 * credentials again.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (!code) {
    // Missing code — fall back to home
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      const errorKind = error ? getAuthErrorKind(error) : "auth";
      return NextResponse.redirect(`${origin}/login?error=${errorKind}`);
    }

    // Decide where to land based on role
    const destination =
      next && next.startsWith("/")
        ? next
        : isAdminUser(data.session.user)
          ? "/products"
          : "/profile";

    return NextResponse.redirect(`${origin}${destination}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=server`);
  }
}
