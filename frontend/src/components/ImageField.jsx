import { useRef, useState } from 'react'
import { fileToResizedDataURL, processLogo } from '../lib/image'
import { useToast } from '../context/ToastContext'
import { IconUpload, IconClose } from './Icons'

/* Drag-or-select image upload, mirroring the app's "Drop or select file"
   pattern. Stores a data URL via onChange so it persists.
   kind="logo" auto-trims + squares the upload so any logo fits well. */
export default function ImageField({ label, hint, value, onChange, required, max = 800, kind }) {
  const inputRef = useRef(null)
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const result = kind === 'logo'
        ? await processLogo(file)
        : await fileToResizedDataURL(file, { max })
      onChange(result)
    } catch (e) {
      toast(e.message || 'Could not load that image')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="field">
      <label>{label}{required && <span className="req">*</span>}</label>

      {value ? (
        <div className="image-preview">
          <img src={value} alt="" />
          <div className="image-preview-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>
              <IconClose width={15} height={15} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={'dropzone' + (drag ? ' drag' : '')}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
        >
          <span className="dropzone-ic">
            {busy ? <span className="spinner dark" /> : <IconUpload width={22} height={22} />}
          </span>
          <span className="dropzone-text">{busy ? 'Processing…' : 'Drop or select file'}</span>
          {hint && <span className="hint">{hint}</span>}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
