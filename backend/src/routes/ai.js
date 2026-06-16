import { Router } from 'express'
import { config } from '../config.js'
import { requireAuth } from '../auth.js'

const router = Router()

/* POST /api/ai/chat — proxy to Ollama Cloud.
   The API key stays server-side; the frontend only sends messages. */
router.post('/chat', requireAuth, async (req, res) => {
  const { messages, format, model } = req.body || {}
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages[] required' })
  if (!config.ollama.apiKey) return res.status(503).json({ error: 'AI not configured on server' })

  try {
    const upstream = await fetch(`${config.ollama.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.ollama.apiKey}`,
      },
      body: JSON.stringify({
        model: model || config.ollama.model,
        messages,
        stream: false,
        ...(format ? { format } : {}),
        options: { temperature: 0.8 },
      }),
    })
    const data = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error || `Ollama error ${upstream.status}` })
    }
    res.json({ content: data?.message?.content ?? '' })
  } catch (e) {
    console.error('[ai] chat failed:', e.message)
    res.status(502).json({ error: 'AI request failed' })
  }
})

export default router
