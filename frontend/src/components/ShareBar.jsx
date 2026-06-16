import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { downloadPng, shareImageAndLink, platformShare, copyImage, FALLBACK_URL } from '../lib/share'
import {
  IconWhatsApp, IconFacebook, IconX, IconLinkedIn,
  IconDownload, IconCopy, IconShare,
} from './Icons'

/* Social + export actions for a rendered poster. `nodeRef` points at the
   poster DOM node; `text` is the caption; `url` is the link shared with it. */
export default function ShareBar({ nodeRef, text, url = FALLBACK_URL, filename = 'social-studio.png' }) {
  const toast = useToast()
  const [busy, setBusy] = useState('')

  const withNode = (fn) => async () => {
    if (!nodeRef.current) return
    try { await fn(nodeRef.current) }
    catch (e) { if (e?.name !== 'AbortError') toast(e.message || 'Something went wrong') }
  }

  const handlePlatform = (key, label) =>
    withNode(async (node) => {
      setBusy(key)
      try {
        // Best case (mobile / Chrome / Edge): share IMAGE + LINK together, one tap.
        const shared = await shareImageAndLink(node, { text, url, filename })
        if (shared) return

        // Desktop fallback: copy the image to the clipboard + open the chat with
        // the link prefilled — the user just pastes (Ctrl/Cmd+V) the image in.
        const copied = await copyImage(node).catch(() => false)
        platformShare[key](text, url)
        if (copied) {
          toast(`Image copied — press Ctrl/Cmd+V in ${label} to paste it`)
        } else {
          await downloadPng(node, filename)
          toast(`Image downloaded — attach it in ${label}`)
        }
      } finally { setBusy('') }
    })

  const handleDownload = withNode(async (node) => {
    setBusy('download'); await downloadPng(node, filename); toast('Image downloaded'); setBusy('')
  })
  const handleCopy = withNode(async (node) => {
    setBusy('copy')
    const ok = await copyImage(node)
    toast(ok ? 'Image copied to clipboard' : 'Copy not supported — downloaded instead')
    if (!ok) await downloadPng(node, filename)
    setBusy('')
  })

  const SOCIALS = [
    { key: 'whatsapp', label: 'WhatsApp', Icon: IconWhatsApp, color: '#25D366' },
    { key: 'facebook', label: 'Facebook', Icon: IconFacebook, color: '#1877F2' },
    { key: 'x',        label: 'X',        Icon: IconX,        color: '#000000' },
    { key: 'linkedin', label: 'LinkedIn', Icon: IconLinkedIn, color: '#0A66C2' },
  ]

  return (
    <div className="sharebar">
      <div className="sharebar-socials">
        {SOCIALS.map(({ key, label, Icon, color }) => (
          <button key={key} className="social-btn" style={{ '--c': color }}
            onClick={handlePlatform(key, label)} disabled={!!busy} title={`Share to ${label}`}>
            <Icon width={20} height={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="sharebar-actions">
        <button className="btn btn-ghost btn-sm" onClick={handleCopy} disabled={!!busy}>
          <IconCopy width={16} height={16} /> Copy
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleDownload} disabled={!!busy}>
          <IconDownload width={16} height={16} /> Download
        </button>
        <button className="btn btn-soft btn-sm" onClick={withNode((n) => shareImageAndLink(n, { text, url, filename }))} disabled={!!busy}>
          <IconShare width={16} height={16} /> More
        </button>
      </div>
    </div>
  )
}
