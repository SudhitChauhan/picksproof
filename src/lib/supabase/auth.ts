import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  return user.app_metadata.role === "admin";
}
