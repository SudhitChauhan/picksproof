import { NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Lightweight endpoint polled by the confirm-email page to detect when the
 * user has clicked the confirmation link (possibly in another tab/window).
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    return NextResponse.json({
      authenticated: !!session,
      userId: session?.user?.id ?? null
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
