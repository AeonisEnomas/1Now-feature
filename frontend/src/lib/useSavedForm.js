import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadProfile, saveSection } from './store'

/* ============================================================
   Loads a saved form section for the current user and keeps it
   persisted (debounced) so fields stay filled across logout.
   Returns { form, setField, status, loaded, saveNow }.
   ============================================================ */
export function useSavedForm(section, defaults) {
  const { user } = useAuth()
  const [form, setForm] = useState(defaults)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const timer = useRef(null)
  const dirty = useRef(false)

  // Load on mount / user change.
  useEffect(() => {
    let active = true
    if (!user) return
    setLoaded(false)
    loadProfile(user.id).then((p) => {
      if (!active) return
      setForm({ ...defaults, ...(p[section] || {}) })
      setLoaded(true)
    })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, section])

  // Reload last-saved values, discarding unsaved edits.
  const reload = useCallback(async () => {
    if (!user) return
    const p = await loadProfile(user.id)
    dirty.current = false
    setForm({ ...defaults, ...(p[section] || {}) })
    setStatus('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, section])

  const persist = useCallback(async (value) => {
    if (!user) return
    setStatus('saving')
    try {
      await saveSection(user.id, section, value)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }, [user, section])

  // Debounced autosave on change.
  useEffect(() => {
    if (!loaded || !dirty.current) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => persist(form), 700)
    return () => clearTimeout(timer.current)
  }, [form, loaded, persist])

  const setField = useCallback((key, val) => {
    dirty.current = true
    setForm((f) => ({ ...f, [key]: val }))
  }, [])

  const saveNow = useCallback(() => persist(form), [persist, form])

  return { form, setField, status, loaded, saveNow, reload }
}
