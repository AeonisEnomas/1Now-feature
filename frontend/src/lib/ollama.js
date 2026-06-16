import { buildSpec, templateIdsFor } from './templates'
import { apiFetch, hasBackend } from './api'

/* ============================================================
   AI client — talks to our backend (Express), which proxies to
   Ollama Cloud with the API key kept server-side.
   - suggestDescription(): AI autofills the style description.
   - generateSpec(): AI returns a structured design spec.

   With no backend configured (demo mode), everything gracefully
   degrades to the local template builders so the app still works.
   ============================================================ */

// AI is available only through the backend proxy.
export const isAIConfigured = hasBackend

async function chat(messages, { json = false } = {}) {
  if (!hasBackend) throw new Error('AI backend not configured')
  const data = await apiFetch('/api/ai/chat', {
    method: 'POST',
    body: { messages, format: json ? 'json' : undefined },
  })
  return data?.content ?? ''
}

/* ---------- 1. AI suggests a description ---------- */
export async function suggestDescription({ type, data }) {
  const subject =
    type === 'car_post'
      ? `a car rental advertisement for a ${[data.year, data.make, data.model].filter(Boolean).join(' ') || 'vehicle'}`
      : `a business card for ${data.name || 'a rental business'}${data.company ? ` at ${data.company}` : ''}`

  const fallback = type === 'car_post'
    ? `A bold, eye-catching rental post with a large vehicle headline, a clear price badge, and 3 key specs. Energetic sunset-orange accents, strong call to action, optimized for Instagram/Facebook.`
    : `A clean, modern business card with the name front and center, role and company beneath, and contact details as crisp bullets. Warm orange accent on white, professional and trustworthy.`

  if (!isAIConfigured) return fallback

  try {
    const content = await chat([
      {
        role: 'system',
        content:
          'You are a senior brand designer. Write ONE short, vivid paragraph (max 45 words) describing how a social-media graphic should look: mood, layout, accent colors, and emphasis. No preamble, no lists.',
      },
      { role: 'user', content: `Describe the ideal look for ${subject}.` },
    ])
    return content.trim() || fallback
  } catch (err) {
    // Edge function not deployed yet / transient error — use the starter text.
    console.warn('[ollama] suggestDescription fell back:', err.message)
    return fallback
  }
}

/* ---------- 2. AI generates the structured design spec ---------- */
export async function generateSpec({ type, data, description, templateId }) {
  // No AI available -> deterministic local template.
  if (!isAIConfigured) return buildSpec(type, data, templateId)

  const ids = templateIdsFor(type)
  const locked = Boolean(templateId)        // user picked a template?
  const copy = type === 'car_post' ? `"badge": short label, "tagline": punchy line, "cta": short call to action` : `"tagline": short professional slogan`
  const fields =
    type === 'car_post'
      ? `year, make, model, price, transmission, seats, fuel, mileage, location, badge`
      : `companyName, domain, country, phone, email, address, tagline`

  // Locked: keep the chosen layout, only restyle colours + copy.
  // Free: AI also chooses the layout and a bespoke palette → unique designs.
  const schema = locked
    ? `{ "accent": hex, "accent2": hex, ${copy} }`
    : `{ "template": one of ${JSON.stringify(ids)}, "accent": hex, "accent2": hex, ${copy} }`

  const system = locked
    ? `You are a brand designer for a car-rental company. The user picked a fixed layout — DO NOT change it. ` +
      `Adapt ONLY the colour palette (accent, accent2) and copy to the style description. ` +
      `Return ONLY valid JSON: ${schema}.`
    : `You are a senior brand designer for a car-rental company. Design a UNIQUE, on-brand graphic: ` +
      `choose the layout from the list that best fits, and craft a DISTINCTIVE, harmonious colour palette ` +
      `(accent + a complementary accent2) inspired by the style description — don't default to the same orange every time, ` +
      `but keep it tasteful and legible. Return ONLY valid JSON: ${schema}.`

  // Don't ship base64 image data to the model — strip it from the prompt.
  const { logo, image, ...promptData } = data

  try {
    const raw = await chat(
      [
        { role: 'system', content: system },
        {
          role: 'user',
          content:
            `Data (${fields}):\n${JSON.stringify(promptData, null, 2)}\n\n` +
            `Style description: ${description || 'clean, modern, professional, on-brand'}\n` +
            (locked ? `Locked layout: ${templateId} (keep it).\n` : '') +
            `Return the JSON spec now.`,
        },
      ],
      { json: true },
    )
    const parsed = sanitize(JSON.parse(raw), type)
    // Layout: locked → the user's pick; free → the AI's pick (fallback to a default).
    const chosen = locked ? templateId : parsed.template
    const base = buildSpec(type, data, chosen)

    // Overlay only styling + copy; factual fields always come from the form.
    const merged = { ...base }
    if (parsed.accent) merged.accent = parsed.accent
    if (parsed.accent2) merged.accent2 = parsed.accent2
    if (parsed.tagline) merged.tagline = parsed.tagline
    if (type === 'car_post') {
      if (parsed.badge) merged.badge = parsed.badge
      if (parsed.cta) merged.cta = parsed.cta
    }
    return merged
  } catch (err) {
    console.warn('[ollama] generateSpec fell back to template:', err.message)
    return buildSpec(type, data, templateId)
  }
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
function sanitize(spec, type) {
  const out = { ...spec }
  if (out.template && !templateIdsFor(type).includes(out.template)) delete out.template
  // Validate colours; drop anything that isn't a clean hex.
  for (const k of ['accent', 'accent2']) if (!HEX.test(out[k] || '')) delete out[k]
  // The renderer derives theme/layout from the template — never trust AI values here.
  delete out.theme
  delete out.layout
  return out
}
