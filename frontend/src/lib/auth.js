import { supabase, isSupabaseConfigured } from './supabase'

/* ============================================================
   Auth layer — wraps Supabase, with a localStorage "demo mode"
   fallback so the app works end-to-end without a backend.
   ============================================================ */

const DEMO_USERS = 'sstudio:demo-users'
const DEMO_SESSION = 'sstudio:demo-session'

const readJSON = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fallback } catch { return fallback }
}
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v))

/* ---------- Demo (offline) implementation ---------- */
const demo = {
  async signUp(email, password, name) {
    const users = readJSON(DEMO_USERS, {})
    if (users[email]) throw new Error('An account with this email already exists.')
    const user = { id: 'demo-' + btoa(email).replace(/=/g, ''), email, name }
    users[email] = { ...user, password }
    writeJSON(DEMO_USERS, users)
    writeJSON(DEMO_SESSION, user)
    return user
  },
  async signIn(email, password) {
    const users = readJSON(DEMO_USERS, {})
    const found = users[email]
    if (!found || found.password !== password) throw new Error('Invalid email or password.')
    const user = { id: found.id, email: found.email, name: found.name }
    writeJSON(DEMO_SESSION, user)
    return user
  },
  async signOut() { localStorage.removeItem(DEMO_SESSION) },
  getUser() { return readJSON(DEMO_SESSION, null) },
}

/* ---------- Public API ---------- */
export async function signUp({ email, password, name }) {
  if (!isSupabaseConfigured) return demo.signUp(email, password, name)
  const { data, error } = await supabase.auth.signUp({
    email, password, options: { data: { name } },
  })
  if (error) throw error
  return mapUser(data.user)
}

export async function signIn({ email, password }) {
  if (!isSupabaseConfigured) return demo.signIn(email, password)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return mapUser(data.user)
}

export async function signOut() {
  if (!isSupabaseConfigured) return demo.signOut()
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return demo.getUser()
  const { data } = await supabase.auth.getUser()
  return data?.user ? mapUser(data.user) : null
}

/** Subscribe to auth changes. Returns an unsubscribe fn. */
export function onAuthStateChange(cb) {
  if (!isSupabaseConfigured) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_evt, session) => {
    cb(session?.user ? mapUser(session.user) : null)
  })
  return () => data.subscription.unsubscribe()
}

function mapUser(u) {
  if (!u) return null
  return { id: u.id, email: u.email, name: u.user_metadata?.name || u.email?.split('@')[0] }
}
