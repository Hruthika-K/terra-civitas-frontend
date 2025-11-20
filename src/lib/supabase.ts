import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Use Vite environment variables. Do NOT hardcode keys in source control.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (isSupabaseConfigured) {
	// Only create the client when both env vars are present. This avoids runtime
	// errors when the app is running without Supabase configured (dev/demo mode).
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
	// keep supabase as null; callers should check `isSupabaseConfigured` or
	// handle a null `supabase` and fall back to demo data.
	supabase = null;
}

export default supabase;

