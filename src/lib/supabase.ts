// Supabase client singleton — use this everywhere in the app.
// Server-side: uses service role key (bypasses RLS).
// Never expose SERVICE_ROLE_KEY to the browser.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-safe client (anon key)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Server-only client (service role — full access)
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
