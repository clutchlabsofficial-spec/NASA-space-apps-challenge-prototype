import { useRef, useState } from 'react'
import { fileToDownscaledDataUrl, describeSketch } from '../lib/api.js'
import Model3D from './Model3D.jsx'
import { MascotSays } from './Mascot.jsx'

const NOTICE_KEY = 'cubesat-sketch-notice-seen'

/**
 * Draw it, photograph it, watch it become a 3D model you can spin.
 * The notice is shown once per browser and is deliberately about what leaves
 * the device, because at a public booth the person tapping this is a child.
 */
export default function SketchStudio({ mode, label, context, existingModel, onModel }) {
  const [acknowledged, setAcknowledged] = useState(() => {
    try {
      return sessionStorage.getItem(NOTICE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState(existingModel ? 'done' : 'idle')
  const [error, setError] = useState(null)
  const [model, setModel] = useState(existingModel || null)
  const [hovered, setHovered] = useState(null)
  const fileInput = useRef(null)
  const cameraInput = useRef(null)

  const acknowledge = () => {
    setAcknowledged(true)
    try {
      sessionStorage.setItem(NOTICE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setStatus('working')
    try {
      const dataUrl = await fileToDownscaledDataUrl(file)
      setPreview(dataUrl)
      const built = await describeSketch({ image: dataUrl, mode, context })
      setModel(built)
      setStatus('done')
      onModel?.(built)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (!acknowledged) {
    return (
      <div className="sketch sketch--notice">
        <span className="label">{mode === 'explorer' ? 'Before you take a photo' : 'Before you use the camera'}</span>
        <p>
          {mode === 'explorer'
            ? 'Take a photo of your drawing — not of people. Claude looks at the picture to work out what you drew, then it is thrown away. It is not saved and nobody keeps it.'
            : 'Photograph your drawing, not people. The image is sent to Claude to be read as an engineering sketch and is not stored anywhere.'}
        </p>
        <button className="btn" onClick={acknowledge}>
          {mode === 'explorer' ? 'Got it' : 'Understood'}
        </button>
      </div>
    )
  }

  return (
    <div className="sketch">
      <span className="label">{label}</span>

      {status !== 'done' && (
        <>
          <p className="sketch__hint">
            {mode === 'explorer'
              ? 'Draw it big, with a dark pen, then take a photo from straight above.'
              : 'A bold line drawing photographed square-on reads far better than a shaded sketch.'}
          </p>
          <div className="sketch__row">
            <button className="btn btn--big" onClick={() => cameraInput.current?.click()} disabled={status === 'working'}>
              📷 {mode === 'explorer' ? 'Take a photo' : 'Use camera'}
            </button>
            <button className="btn btn--bare" onClick={() => fileInput.current?.click()} disabled={status === 'working'}>
              {mode === 'explorer' ? 'Pick a picture' : 'Upload a file'}
            </button>
          </div>
          <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </>
      )}

      {preview && status !== 'done' && (
        <div className="sketch__preview">
          <img src={preview} alt="Your drawing" />
        </div>
      )}

      {status === 'working' && (
        <div className="sketch__working">
          <span className="sketch__spinner" aria-hidden="true" />
          <span className="mono">
            {mode === 'explorer' ? 'Looking at your drawing…' : 'Reading the sketch and rebuilding it…'}
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="sketch__error">
          <p>{error}</p>
          <button className="btn btn--bare" onClick={() => { setStatus('idle'); setError(null) }}>
            Try again
          </button>
        </div>
      )}

      {status === 'done' && model && (
        <div className="sketch__result">
          {model.reading && (
            <MascotSays mood="excited" size={62}>{model.reading}</MascotSays>
          )}
          <h4 className="sketch__name">{model.name}</h4>
          <Model3D model={model} onPartHover={setHovered} />
          <div className="sketch__row sketch__row--under">
            <span className="label">
              {hovered
                ? `▸ ${hovered}`
                : mode === 'explorer' ? 'Drag it to spin · touch a part to name it' : 'Drag to orbit · hover a part to name it'}
            </span>
            <button className="btn btn--bare" onClick={() => { setStatus('idle'); setPreview(null); setModel(null) }}>
              {mode === 'explorer' ? 'Draw another' : 'Replace'}
            </button>
          </div>
          <div className="sketch__parts">
            {model.parts.map((p, i) => (
              <span key={i} className="sketch__part mono">{p.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
