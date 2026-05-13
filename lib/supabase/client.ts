import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Client] Missing environment variables in browser bundle.');
    throw new Error(
      `Supabase Client initialization failed: URL or Anon Key is missing. ` +
      `Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined, ` +
      `and restart your 'npm run dev' server to re-compile the environment.`
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
