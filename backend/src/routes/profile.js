import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../auth.js'

const router = Router()
const SECTIONS = new Set(['business_card', 'car_post'])

/* GET /api/profile — both saved sections for the current user. */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query(
      'select business_card, car_post from public.studio_profiles where id = $1',
      [req.userId],
    )
    res.json(rows[0] || { business_card: null, car_post: null })
  } catch (e) {
    console.error('[profile] get failed:', e.message)
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

/* PUT /api/profile/:section — upsert one section (business_card | car_post). */
router.put('/:section', requireAuth, async (req, res) => {
  const { section } = req.params
  if (!SECTIONS.has(section)) return res.status(400).json({ error: 'Unknown section' })
  try {
    await query(
      `insert into public.studio_profiles (id, ${section}, updated_at)
       values ($1, $2, now())
       on conflict (id) do update set ${section} = excluded.${section}, updated_at = now()`,
      [req.userId, req.body ?? {}],
    )
    res.json({ ok: true })
  } catch (e) {
    console.error('[profile] save failed:', e.message)
    res.status(500).json({ error: 'Failed to save profile' })
  }
})

export default router
