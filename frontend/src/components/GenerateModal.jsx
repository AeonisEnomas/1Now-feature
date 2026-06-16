import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { suggestDescription, generateSpec, isAIConfigured } from '../lib/ollama'
import { templatesFor } from '../lib/templates'
import { useToast } from '../context/ToastContext'
import CardPreview from './CardPreview'
import ShareBar from './ShareBar'
import { IconClose, IconSparkle, IconBack, IconEdit, IconCheck } from './Icons'

/* The full generation flow in a modal:
   compose (description + template + AI-suggest)  ->  result (poster + share). */
export default function GenerateModal({ type, data, onClose }) {
  const toast = useToast()
  const posterRef = useRef(null)

  const [stage, setStage] = useState('compose') // compose | result
  const [description, setDescription] = useState('')
  const [templateId, setTemplateId] = useState(null)
  const [spec, setSpec] = useState(null)
  const [suggesting, setSuggesting] = useState(false)
  const [generating, setGenerating] = useState(false)

  const isCar = type === 'car_post'
  const title = isCar ? 'Generate Car Post' : 'Generate Business Card'

  const shareText = isCar
    ? `🚗 ${[data.year, data.make, data.model].filter(Boolean).join(' ')} available for rent${data.price ? ` — ${data.price}/day` : ''}! ${data.location ? `📍 ${data.location}. ` : ''}Book now.`
    : `${data.companyName || 'Our company'}${data.tagline ? ` — ${data.tagline}` : ''} ${data.phone ? `📞 ${data.phone}` : ''}`.trim()

  // Link shared alongside the image. Use the company's own domain when available.
  const cleanDomain = (data.domain || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
  const shareUrl = cleanDomain ? `https://${cleanDomain}` : 'https://1now.app'

  const handleSuggest = async () => {
    setSuggesting(true)
    try {
      const text = await suggestDescription({ type, data })
      setDescription(text)
      toast(isAIConfigured ? 'AI drafted a description' : 'Added a starter description')
    } catch (e) {
      toast(e.message || 'Could not suggest a description')
    } finally {
      setSuggesting(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const result = await generateSpec({ type, data, description, templateId })
      setSpec(result)
      setStage('result')
    } catch (e) {
      toast(e.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleRemake = () => { setStage('compose') }

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'modal' + (stage === 'result' ? ' wide' : '')}>
        <div className="modal-head">
          <div className="row" style={{ alignItems: 'center', gap: 10 }}>
            <span className="modal-ic"><IconSparkle width={18} height={18} /></span>
            <h3>{stage === 'result' ? 'Your design is ready' : title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><IconClose width={18} height={18} /></button>
        </div>

        {stage === 'compose' && (
          <div className="modal-body">
            <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
              Describe how you want it to look — or let AI draft it, or start from a template.
              You can always remake it.
            </p>

            <div className="field">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Style description</label>
                <button className="link-btn" onClick={handleSuggest} disabled={suggesting}>
                  {suggesting ? <span className="spinner dark" /> : <IconSparkle width={15} height={15} />}
                  {isAIConfigured ? 'Suggest with AI' : 'Auto-fill'}
                </button>
              </div>
              <textarea
                className="textarea" rows={4}
                placeholder={isCar
                  ? 'e.g. Bold, energetic post with a big price, sunset-orange accents, 3 standout specs…'
                  : 'e.g. Clean and minimal, name front and center, warm orange accent, professional…'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="field" style={{ marginTop: 18 }}>
              <label>Start from a template <span className="hint">(optional)</span></label>
              <div className="template-grid">
                {templatesFor(type).map((t) => (
                  <button key={t.id}
                    className={'template-card' + (templateId === t.id ? ' active' : '')}
                    onClick={() => setTemplateId(templateId === t.id ? null : t.id)}>
                    <span className="template-swatch" style={{ background: t.swatch }} />
                    <span className="template-name">{t.name}</span>
                    {templateId === t.id && <span className="template-check"><IconCheck width={13} height={13} /></span>}
                  </button>
                ))}
              </div>
              <p className="hint" style={{ marginTop: 10 }}>
                {templateId
                  ? '✦ AI keeps this layout — it only restyles colors & copy to your description.'
                  : '✦ No template picked — AI designs a unique layout & color palette from your description.'}
              </p>
            </div>

            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? <><span className="spinner" /> Generating…</> : <><IconSparkle width={17} height={17} /> Generate</>}
              </button>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="modal-body result">
            <div className={'result-grid' + (isCar ? ' landscape' : '')}>
              <div className="result-poster">
                <CardPreview ref={posterRef} spec={spec} />
              </div>
              <div className="result-side">
                <div className="chip"><IconCheck width={14} height={14} /> Generated</div>
                <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>
                  Share it straight to social, or go back and remake it with a different look.
                </p>

                <ShareBar nodeRef={posterRef} text={shareText} url={shareUrl}
                  filename={`1now-${type}.png`} />

                <div className="row" style={{ marginTop: 18 }}>
                  <button className="btn btn-ghost btn-block" onClick={handleRemake}>
                    <IconBack width={16} height={16} /> Edit &amp; remake
                  </button>
                </div>
                <button className="btn btn-soft btn-block" style={{ marginTop: 10 }} onClick={onClose}>
                  <IconEdit width={16} height={16} /> Back to fields
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
