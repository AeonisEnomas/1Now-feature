/* ============================================================
   Design templates + local (offline) spec builders.

   A template = a hardcoded design (visual THEME + structural
   LAYOUT). Business cards and car posts have their own sets.
   A "spec" is what the React renderer consumes; the AI returns
   the same shape, and these builders are the deterministic
   fallback + the selectable templates in the modal.
   ============================================================ */

const O = { accent: '#FF6A2B', accent2: '#F24E0A' }

/* ---- Business card templates — each a UNIQUE layout + design ---- */
export const CARD_TEMPLATES = [
  { id: 'header',    name: 'Header',    theme: 'light',   layout: 'header',    ...O, swatch: 'linear-gradient(180deg,#F24E0A 42%,#fff 42%)' },
  { id: 'sidebar',   name: 'Sidebar',   theme: 'split',   layout: 'sidebar',   ...O, swatch: 'linear-gradient(90deg,#F24E0A 36%,#fff 36%)' },
  { id: 'editorial', name: 'Editorial', theme: 'elegant', layout: 'editorial', accent: '#C93C06', accent2: '#FF6A2B', swatch: 'linear-gradient(135deg,#FFF7F0,#FFE0CC)' },
  { id: 'onyx',      name: 'Onyx',      theme: 'dark',    layout: 'onyx',      accent: '#FF8447', accent2: '#FF6A2B', swatch: 'linear-gradient(135deg,#1a1410,#3d342d)' },
]

/* ---- Car post templates — LANDSCAPE ads, each a UNIQUE layout ---- */
export const POST_TEMPLATES = [
  { id: 'spotlight', name: 'Spotlight', theme: 'overlay',  layout: 'spotlight', ...O, swatch: 'linear-gradient(120deg,#1a1410,#64748b)' },
  { id: 'split',     name: 'Split',     theme: 'light',    layout: 'split',     ...O, swatch: 'linear-gradient(90deg,#94a3b8 56%,#fff 56%)' },
  { id: 'banner',    name: 'Banner',    theme: 'dark',     layout: 'banner',    accent: '#FF8447', accent2: '#FF6A2B', swatch: 'linear-gradient(180deg,#94a3b8 60%,#1a1410 60%)' },
  { id: 'showcase',  name: 'Showcase',  theme: 'gradient', layout: 'showcase',  ...O, swatch: 'linear-gradient(90deg,#F24E0A 46%,#94a3b8 46%)' },
]

export const templatesFor = (type) => (type === 'car_post' ? POST_TEMPLATES : CARD_TEMPLATES)
export const templateIdsFor = (type) => templatesFor(type).map((t) => t.id)

const presetFor = (type, id) => {
  const list = templatesFor(type)
  return list.find((p) => p.id === id) || list[0]
}

const pick = (arr, seed) => arr[Math.abs(hash(seed)) % arr.length]
const hash = (s = '') => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)

const applyTheme = (spec, preset) => ({
  ...spec,
  template: preset.id,
  theme: preset.theme,
  layout: preset.layout,
  accent: preset.accent,
  accent2: preset.accent2,
})

/* ---------- Business card ---------- */
export function buildBusinessCardSpec(data, templateId) {
  const preset = presetFor('business_card', templateId || pick(templateIdsFor('business_card'), data.companyName + data.domain))
  const taglines = [
    `${data.companyName || 'We'} — driven by trust.`,
    `Your journey, our priority.`,
    `Premium rentals, effortless booking.`,
    `Reliable wheels, remarkable service.`,
  ]
  const cleanDomain = (data.domain || '').replace(/^https?:\/\//, '')
  const contacts = [
    data.phone && { type: 'phone', value: data.phone },
    data.email && { type: 'email', value: data.email },
    data.address && { type: 'address', value: data.address },
    cleanDomain && { type: 'web', value: cleanDomain },
  ].filter(Boolean)
  return applyTheme({
    type: 'business_card',
    logo: data.logo || '',
    headline: data.companyName || 'Your Company',
    subheadline: cleanDomain || data.country || 'Car Rental',
    tagline: data.tagline || pick(taglines, data.companyName),
    contacts,
  }, preset)
}

/* ---------- Car post ---------- */
export function buildCarPostSpec(data, templateId) {
  const preset = presetFor('car_post', templateId || pick(templateIdsFor('car_post'), data.make + data.model))
  const title = [data.year, data.make, data.model].filter(Boolean).join(' ') || 'Your Vehicle'
  const highlights = [
    data.transmission && `${data.transmission}`,
    data.seats && `${data.seats} seats`,
    data.fuel && `${data.fuel}`,
    data.mileage && `${data.mileage}`,
  ].filter(Boolean)
  const taglines = [
    `Book your ride today.`,
    `Available now for rent.`,
    `Drive in style this weekend.`,
    `Limited availability — reserve fast.`,
  ]
  return applyTheme({
    type: 'car_post',
    image: data.image || '',
    badge: data.badge || 'Available Now',
    headline: title,
    price: data.price ? `${data.price}` : '',
    tagline: data.tagline || pick(taglines, title),
    highlights,
    location: data.location || '',
    cta: data.cta || 'DM to book',
  }, preset)
}

export function buildSpec(type, data, templateId) {
  return type === 'car_post'
    ? buildCarPostSpec(data, templateId)
    : buildBusinessCardSpec(data, templateId)
}
