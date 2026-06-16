import { useMemo, useState } from 'react'
import { useSavedForm } from '../lib/useSavedForm'
import { buildSpec } from '../lib/templates'
import { useToast } from '../context/ToastContext'
import CardPreview from './CardPreview'
import GenerateModal from './GenerateModal'
import ImageField from './ImageField'
import { IconSparkle, IconCheck, IconChevron } from './Icons'

/* A details page (e.g. Settings → Company Info, or Fleet → Car Details).
   The record's fields live here and persist; the Generate button in the
   right-hand action panel launches the card/post generator popup. */
export default function FeaturePage({
  type, section, breadcrumb, tabs, panelTitle, recordId, generateLabel,
  fields, defaults,
}) {
  const { form, setField, status, loaded, saveNow, reload } = useSavedForm(section, defaults)
  const toast = useToast()
  const [open, setOpen] = useState(false)

  const requiredKeys = fields.filter((f) => f.required).map((f) => f.key)
  const missing = requiredKeys.filter((k) => !String(form[k] || '').trim())
  const canGenerate = loaded && missing.length === 0

  const livePreview = useMemo(() => buildSpec(type, form), [type, form])
  const isLandscape = type === 'car_post'

  const handleSave = async () => { await saveNow(); toast('Changes saved') }
  const handleDiscard = async () => { await reload(); toast('Changes discarded') }

  return (
    <div className="page">
      <nav className="breadcrumb">
        <span className="crumb brand-crumb">1NOW</span>
        {breadcrumb.map((c, i) => (
          <span key={c} className="crumb-group">
            <IconChevron className="crumb-sep" width={14} height={14} />
            <span className={'crumb' + (i === breadcrumb.length - 1 ? ' current' : '')}>{c}</span>
          </span>
        ))}
      </nav>

      {tabs && (
        <div className="tabs">
          {tabs.map((t, i) => (
            <button key={t} className={'tab' + (i === 0 ? ' active' : '')} disabled={i !== 0}>{t}</button>
          ))}
        </div>
      )}

      <div className="builder">
        {/* ---- Details form ---- */}
        <section className="surface builder-form">
          <div className="builder-form-head">
            <h3>{panelTitle}</h3>
            {recordId && <span className="record-id">{recordId}</span>}
          </div>

          {!loaded ? (
            <div className="center" style={{ padding: 48 }}><span className="spinner dark" /></div>
          ) : (
            <div className="form-grid">
              {fields.map((f) =>
                f.type === 'image' ? (
                  <ImageField key={f.key} label={f.label} hint={f.hint} required={f.required} kind={f.kind}
                    value={form[f.key] || ''} onChange={(v) => setField(f.key, v)} />
                ) : (
                  <div className={'field' + (f.half ? ' half' : '')} key={f.key}>
                    <label>{f.label}{f.required && <span className="req">*</span>}</label>
                    {f.type === 'select' ? (
                      <select className="select" value={form[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)}>
                        <option value="">{f.placeholder || 'Select…'}</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea className="textarea" placeholder={f.placeholder}
                        value={form[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} />
                    ) : (
                      <input className="input" type={f.type || 'text'} placeholder={f.placeholder}
                        value={form[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} />
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {/* ---- Action panel (matches the app's Update/Discard placement) ---- */}
        <aside className="builder-side">
          <div className="action-panel">
            <button className="btn btn-primary btn-lg btn-block" disabled={!canGenerate} onClick={() => setOpen(true)}>
              <IconSparkle width={18} height={18} /> {generateLabel}
            </button>
            <button className="btn btn-ghost btn-block" onClick={handleSave}>Update Changes</button>
            <button className="btn btn-danger-soft btn-block" onClick={handleDiscard}>Discard Changes</button>
            {!canGenerate && loaded
              ? <p className="action-hint missing">Fill the required field{missing.length > 1 ? 's' : ''} to generate</p>
              : <p className="action-hint">{status === 'saving' ? 'Saving…' : 'Saved automatically · stays filled after logout'}</p>}
          </div>

          {!isLandscape && (
            <div className="builder-preview">
              <div className="preview-label"><IconCheck width={14} height={14} /> Live preview</div>
              <div className="preview-stage">
                <CardPreview spec={livePreview} />
              </div>
              <p className="hint" style={{ textAlign: 'center' }}>Updates as you type. Generate for AI variations.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Landscape (car) preview spans full width below the form */}
      {isLandscape && (
        <div className="builder-preview wide">
          <div className="preview-label"><IconCheck width={14} height={14} /> Live preview</div>
          <div className="preview-stage">
            <CardPreview spec={livePreview} />
          </div>
          <p className="hint" style={{ textAlign: 'center' }}>Updates as you type. Generate for AI variations.</p>
        </div>
      )}

      {open && <GenerateModal type={type} data={form} onClose={() => setOpen(false)} />}
    </div>
  )
}
