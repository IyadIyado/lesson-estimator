import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  if (process.env.USE_MOCK === "true") {
    // In mock mode, check for a mock auth cookie/header
    // For dev: always return the owner
    return { email: process.env.OWNER_EMAIL ?? "owner@example.com" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function isOwner(email: string | undefined | null): boolean {
  if (!email) return false;
  return email === process.env.OWNER_EMAIL;
}
