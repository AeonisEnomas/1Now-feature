import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'

/* We validate the user's Supabase access token by asking Supabase's
   Auth API who it belongs to. This keeps auth fully on Supabase (no
   JWT-secret juggling) while the rest of the app uses our own DB. */
const supabase = config.supabaseUrl && config.supabaseAnonKey
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, { auth: { persistSession: false } })
  : null

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing bearer token' })
    if (!supabase) return res.status(500).json({ error: 'Auth not configured on server' })

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid or expired token' })

    req.userId = data.user.id
    req.userEmail = data.user.email
    next()
  } catch (e) {
    res.status(500).json({ error: 'Auth check failed' })
  }
}
