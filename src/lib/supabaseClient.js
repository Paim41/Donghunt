import { createClient } from '@supabase/supabase-js';

// Single shared browser client. Reads public env vars injected at build time.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in dev so missing config is obvious.
  console.warn('Supabase env vars are missing. Copy .env.example to .env.local and fill them in.');
}

export const supabase = createClient(url || 'http://localhost', anonKey || 'public-anon-key', {
  auth: { persistSession: true, autoRefreshToken: true },
});
