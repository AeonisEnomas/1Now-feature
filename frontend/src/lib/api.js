import { supabase, isSupabaseConfigured } from './supabase'

/* ============================================================
   Thin client for the backend REST API.
   Attaches the Supabase access token so the backend can identify
   the user. If VITE_API_URL isn't set, the app runs in demo mode
   (localStorage) — see lib/store.
   ============================================================ */

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const hasBackend = Boolean(API)

async function getToken() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token || null
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = await getToken()
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.error || `API error ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}
