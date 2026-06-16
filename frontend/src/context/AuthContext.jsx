import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as auth from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    auth.getCurrentUser().then((u) => {
      if (mounted) { setUser(u); setLoading(false) }
    })
    const unsub = auth.onAuthStateChange((u) => mounted && setUser(u))
    return () => { mounted = false; unsub() }
  }, [])

  const signIn = useCallback(async (creds) => {
    const u = await auth.signIn(creds)
    setUser(u)
    return u
  }, [])

  const signUp = useCallback(async (creds) => {
    const u = await auth.signUp(creds)
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    await auth.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
