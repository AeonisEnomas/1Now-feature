import { apiFetch, hasBackend } from './api'

/* ============================================================
   Persistent profile store.
   Holds the saved field values for both features so they stay
   filled across logout/login.

   Backend   -> REST API (Express + PostgreSQL on Supabase).
   Demo mode -> localStorage keyed by user id (when no VITE_API_URL).
   ============================================================ */

const EMPTY = { business_card: null, car_post: null }
const lsKey = (userId) => `sstudio:profile:${userId}`

const readLocal = (userId) => {
  try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(lsKey(userId))) } }
  catch { return { ...EMPTY } }
}
const writeLocal = (userId, next) => localStorage.setItem(lsKey(userId), JSON.stringify(next))

/** Load both saved sections for a user. Always resolves to an object. */
export async function loadProfile(userId) {
  if (hasBackend) {
    try { return { ...EMPTY, ...(await apiFetch('/api/profile')) } }
    catch (e) { console.warn('[store] backend load failed, using local:', e.message) }
  }
  return readLocal(userId)
}

/** Save one section ("business_card" | "car_post"). */
export async function saveSection(userId, section, value) {
  if (hasBackend) {
    try {
      await apiFetch(`/api/profile/${section}`, { method: 'PUT', body: value })
      return { [section]: value }
    } catch (e) {
      console.warn('[store] backend save failed, using local:', e.message)
    }
  }
  const next = { ...readLocal(userId), [section]: value }
  writeLocal(userId, next)
  return next
}
