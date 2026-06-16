/* ============================================================
   Read an image file, downscale it on a canvas, and return a
   data URL. We store images as data URLs in the persisted profile
   so they survive logout AND export cleanly to PNG (no CORS taint,
   unlike remote URLs).
   ============================================================ */
export function fileToResizedDataURL(file, { max = 800, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'))
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file'))

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not a valid image'))
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        // Keep PNG for logos (transparency); JPEG for photos (smaller).
        const isPng = file.type === 'image/png' || file.type === 'image/webp'
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

/* ---------- Logo normalizer ----------
   Makes ANY uploaded logo sit well: auto-trims surrounding empty /
   uniform-colour borders, then centers it on a square canvas with
   consistent padding. Transparent logos stay transparent; logos with
   a solid background keep that colour (so they read as a clean icon).
   Returns a square PNG data URL. */
const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onerror = () => rej(new Error('Could not read the file'))
  r.onload = () => res(r.result)
  r.readAsDataURL(file)
})
const loadImage = (src) => new Promise((res, rej) => {
  const i = new Image()
  i.onload = () => res(i)
  i.onerror = () => rej(new Error('That file is not a valid image'))
  i.src = src
})

export async function processLogo(file, { size = 256, pad = 0.1 } = {}) {
  if (!file) throw new Error('No file selected')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')

  const img = await loadImage(await readFile(file))
  const cap = 512
  const sc = Math.min(1, cap / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * sc))
  const h = Math.max(1, Math.round(img.height * sc))
  const src = document.createElement('canvas')
  src.width = w; src.height = h
  const sctx = src.getContext('2d')
  sctx.drawImage(img, 0, 0, w, h)

  let data
  try { data = sctx.getImageData(0, 0, w, h).data }
  catch { return src.toDataURL('image/png') } // tainted — skip trim

  let hasAlpha = false
  for (let i = 3; i < data.length; i += 4) { if (data[i] < 250) { hasAlpha = true; break } }
  const bg = [data[0], data[1], data[2]]
  const diff = (i) => Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2])

  // content bounding box (alpha for transparent logos, colour-delta for solid ones)
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const isContent = hasAlpha ? data[i + 3] > 20 : diff(i) > 32
      if (isContent) {
        if (x < minX) minX = x; if (x > maxX) maxX = x
        if (y < minY) minY = y; if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) { minX = 0; minY = 0; maxX = w - 1; maxY = h - 1 } // nothing found → keep all
  const cw = maxX - minX + 1
  const ch = maxY - minY + 1

  const out = document.createElement('canvas')
  out.width = size; out.height = size
  const o = out.getContext('2d')
  o.imageSmoothingEnabled = true
  o.imageSmoothingQuality = 'high'
  if (!hasAlpha) { o.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`; o.fillRect(0, 0, size, size) }

  const avail = size * (1 - pad * 2)
  const s2 = Math.min(avail / cw, avail / ch)
  const dw = cw * s2, dh = ch * s2
  o.drawImage(src, minX, minY, cw, ch, (size - dw) / 2, (size - dh) / 2, dw, dh)
  return out.toDataURL('image/png')
}
