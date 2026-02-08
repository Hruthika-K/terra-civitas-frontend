import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// AUTH Supabase - for user authentication
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// ALERTS Supabase - for alerts data (shared from friend's project)
const ALERTS_SUPABASE_URL = import.meta.env.VITE_ALERTS_SUPABASE_URL ?? "";
const ALERTS_SUPABASE_ANON_KEY = import.meta.env.VITE_ALERTS_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;
let alertsSupabase: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const isAlertsSupabaseConfigured = Boolean(ALERTS_SUPABASE_URL && ALERTS_SUPABASE_ANON_KEY);

// Auth Supabase client
if (isSupabaseConfigured) {
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
	supabase = null;
}

// Alerts Supabase client (from friend's project)
if (isAlertsSupabaseConfigured) {
	alertsSupabase = createClient(ALERTS_SUPABASE_URL, ALERTS_SUPABASE_ANON_KEY);
} else {
	alertsSupabase = null;
}

export default supabase;
export { alertsSupabase };

