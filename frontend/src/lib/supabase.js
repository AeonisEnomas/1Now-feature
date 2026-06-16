import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * When Supabase env vars are present we use the real backend.
 * Otherwise the app falls back to a local "demo mode" (see lib/auth + lib/store)
 * so the whole experience can be tried without any setup.
 */
export const isSupabaseConfigured = Boolean(url && anon)

export const supabase = isSupabaseConfigured
  ? createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
