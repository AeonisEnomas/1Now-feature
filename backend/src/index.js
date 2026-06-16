import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { ensureSchema } from './db.js'
import profileRoutes from './routes/profile.js'
import aiRoutes from './routes/ai.js'

const app = express()

const allowed = config.corsOrigins
function originAllowed(origin) {
  // Non-browser tools (curl, server-to-server) send no Origin.
  if (!origin) return true
  if (allowed.includes('*') || allowed.includes(origin)) return true
  // Local development on any port.
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true
  // Vercel production + preview deployments (e.g. my-app-git-branch.vercel.app).
  try { if (/\.vercel\.app$/.test(new URL(origin).hostname)) return true } catch { /* ignore */ }
  return false
}
app.use(cors({ origin: (origin, cb) => cb(null, originAllowed(origin)) }))
app.use(express.json({ limit: '5mb' })) // logos/photos arrive as data URLs

app.get('/health', (_req, res) => res.json({ ok: true, service: '1now-backend' }))

app.use('/api/profile', profileRoutes)
app.use('/api/ai', aiRoutes)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

app.listen(config.port, () => {
  console.log(`[1now-backend] listening on http://localhost:${config.port}`)
  console.log(`[1now-backend] CORS origins: ${config.corsOrigins.join(', ')}`)
  // Verify DB connectivity in the background — server stays up regardless.
  ensureSchema().catch((e) => console.error('[db] schema check failed:', e.message))
})
