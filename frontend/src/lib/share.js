import { toPng } from 'html-to-image'

/* ============================================================
   Export + share helpers.
   We render the live card DOM to a PNG, then either use the
   native Web Share API (mobile, supports image files) or open
   the relevant platform's share intent with prefilled text.
   ============================================================ */

/* Wait until every <img> inside the node has actually decoded — otherwise
   the capture can race and miss the logo / car photo. */
function waitForImages(node) {
  const imgs = [...node.querySelectorAll('img')]
  return Promise.all(imgs.map((img) =>
    img.complete && img.naturalWidth
      ? Promise.resolve()
      : new Promise((res) => { img.onload = res; img.onerror = res })))
}

export async function nodeToPng(node, { scale = 2 } = {}) {
  await waitForImages(node)
  if (document.fonts?.ready) { try { await document.fonts.ready } catch { /* ignore */ } }

  const opts = {
    // NOTE: cacheBust must stay OFF — it appends "?..." to <img> src and
    // corrupts data: URLs (our logo & car image), dropping them from the PNG.
    cacheBust: false,
    pixelRatio: scale,
    backgroundColor: '#ffffff',
    width: node.offsetWidth,
    height: node.offsetHeight,
  }
  // Flatten the rounded corners during capture so the exported PNG is a clean
  // full rectangle (otherwise the radius leaves white triangle corners).
  node.classList.add('capturing')
  try {
    // First pass can miss freshly-decoded images/fonts; a second pass is reliable.
    await toPng(node, opts)
    return await toPng(node, opts)
  } finally {
    node.classList.remove('capturing')
  }
}

export async function downloadPng(node, filename = 'social-studio.png') {
  const dataUrl = await nodeToPng(node)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export const FALLBACK_URL = 'https://1now.app'

async function fileFrom(node, filename = '1now-post.png') {
  const dataUrl = await nodeToPng(node)
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], filename, { type: 'image/png' })
}

/** Share the post IMAGE together with the caption + LINK in a single share.
   Works on mobile and file-share-capable desktops (Chrome/Edge). Returns
   false if the browser can't share files, so callers can fall back. */
export async function shareImageAndLink(node, { text = '', url = FALLBACK_URL, filename } = {}) {
  const file = await fileFrom(node, filename)
  const caption = [text, url].filter(Boolean).join('\n')
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], text: caption })
    return true
  }
  return false
}

/** Platform share intents (text + link). Used as a fallback when the browser
   can't attach the image; the image is downloaded so it can be attached. */
export const platformShare = {
  whatsapp: (text, url) =>
    open(`https://wa.me/?text=${encodeURIComponent([text, url].filter(Boolean).join('\n'))}`),
  facebook: (text, url) =>
    open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`),
  x: (text, url) =>
    open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`),
  linkedin: (text, url) =>
    open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
}

function open(url) {
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=720')
}

export async function copyImage(node) {
  const dataUrl = await nodeToPng(node)
  const blob = await (await fetch(dataUrl)).blob()
  if (navigator.clipboard && window.ClipboardItem) {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  }
  return false
}
