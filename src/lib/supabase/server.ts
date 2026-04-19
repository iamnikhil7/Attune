import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __supabaseAdmin: SupabaseClient | undefined;
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder";

/**
 * Singleton server-only Supabase client. Uses the service role key when
 * available so API routes can read/write past RLS for trusted server
 * operations. Falls back to the anon key if no service role is configured.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!globalThis.__supabaseAdmin) {
    globalThis.__supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return globalThis.__supabaseAdmin;
}

/** Whether real Supabase credentials are present in the environment. */
export function isServerSupabaseConfigured(): boolean {
  return (
    SUPABASE_URL !== "https://placeholder.supabase.co" &&
    SERVICE_ROLE_KEY !== "placeholder"
  );
}

/** Pull the user_id from a request — header first, then query param. */
export function getUserId(req: Request): string | null {
  const url = new URL(req.url);
  return req.headers.get("x-user-id") || url.searchParams.get("user_id");
}
