import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact — PicksProof",
  description:
    "Get in touch with PicksProof. Questions, product suggestions, partnerships, or feedback — we read every message and reply within 48 hours."
};

async function getUserEmail(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const userEmail = await getUserEmail();

  return <ContactPageContent userEmail={userEmail} />;
}
