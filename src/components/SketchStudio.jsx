import { useEffect, useRef, useState } from 'react'
import { fileToDownscaledDataUrl, startSketch, pollSketch, sketchSupported } from '../lib/api.js'
import ModelViewer from './ModelViewer.jsx'

const NOTICE_KEY = 'cubesat-sketch-notice-seen'

/**
 * Photograph a drawing, send it to Tripo, get a spinning 3D model back.
 * The notice is shown once per browser and is deliberately about what leaves
 * the device, because at a public booth the person tapping this is a child.
 */
export default function SketchStudio({ mode, label, onModel, existingModel, disabled }) {
  const [acknowledged, setAcknowledged] = useState(() => {
    try {
      return sessionStorage.getItem(NOTICE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('idle') // idle | working | done | error
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [modelPath, setModelPath] = useState(existingModel || null)
  const fileInput = useRef(null)
  const cameraInput = useRef(null)
  const cancelled = useRef(false)

  // StrictMode mounts, unmounts and remounts in development. Without resetting
  // the flag on mount, the first cleanup would cancel every later poll loop.
  useEffect(() => {
    cancelled.current = false
    return () => {
      cancelled.current = true
    }
  }, [])

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
    setProgress(0)
    try {
      const dataUrl = await fileToDownscaledDataUrl(file)
      setPreview(dataUrl)
      const { taskId } = await startSketch(dataUrl)
      await watch(taskId)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function watch(taskId) {
    // Tripo's own guidance is to poll every couple of seconds; generation
    // typically takes 10-120s.
    const deadline = Date.now() + 4 * 60 * 1000
    while (!cancelled.current && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 2500))
      if (cancelled.current) return
      const res = await pollSketch(taskId)
      setProgress(res.progress || 0)
      if (res.status === 'success') {
        setModelPath(res.modelPath)
        setStatus('done')
        onModel?.(res.modelPath)
        return
      }
      if (res.status === 'failed') {
        setError(res.error || 'That did not work')
        setStatus('error')
        return
      }
    }
    if (!cancelled.current) {
      setError('That is taking longer than expected. Try again with a simpler drawing.')
      setStatus('error')
    }
  }

  // In the published standalone page there is no server to reach Tripo with,
  // and saying so plainly beats a camera button that always fails.
  if (!sketchSupported()) {
    return (
      <div className="sketch sketch--unavailable">
        <span className="label">{label}</span>
        <p>
          {mode === 'explorer'
            ? 'Turning your drawing into a spinning 3D model needs the full version of this app running on a computer. Everything else here works!'
            : 'Sketch-to-3D needs the local server, which holds the Tripo credentials and can make the outbound call. Run the project locally to enable it — the rest of the build is unaffected.'}
        </p>
      </div>
    )
  }

  if (!acknowledged) {
    return (
      <div className="sketch sketch--notice">
        <span className="label">{mode === 'explorer' ? 'Before you take a photo' : 'Before you use the camera'}</span>
        <p>
          {mode === 'explorer'
            ? 'Take a photo of your drawing — not of people. Your picture gets sent to a computer somewhere else that turns drawings into 3D models, and then it is thrown away. It is not saved and nobody keeps it.'
            : 'Photograph your drawing, not people. The image is sent to Tripo AI to be converted into a 3D model and to Claude to be read as an engineering sketch. Nothing is stored on our server, and the model is deleted an hour after it is made.'}
        </p>
        <div className="sketch__row">
          <button className="btn" onClick={acknowledge}>
            {mode === 'explorer' ? 'Got it' : 'Understood'}
          </button>
        </div>
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
              ? 'Draw it on plain paper with a dark pen, then take a photo from straight above.'
              : 'A dark line drawing on plain paper, photographed square-on in even light, converts far better than a shaded sketch.'}
          </p>
          <div className="sketch__row">
            <button className="btn btn--ghost" onClick={() => cameraInput.current?.click()} disabled={disabled || status === 'working'}>
              📷 {mode === 'explorer' ? 'Take a photo' : 'Use camera'}
            </button>
            <button className="btn btn--bare" onClick={() => fileInput.current?.click()} disabled={disabled || status === 'working'}>
              {mode === 'explorer' ? 'Pick a picture' : 'Upload a file'}
            </button>
          </div>
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </>
      )}

      {preview && status !== 'done' && (
        <div className="sketch__preview">
          <img src={preview} alt="Your drawing" />
        </div>
      )}

      {status === 'working' && (
        <div className="sketch__progress">
          <div className="sketch__bar">
            <span style={{ width: `${Math.max(6, progress)}%` }} />
          </div>
          <span className="mono">
            {mode === 'explorer' ? 'Building your 3D model…' : 'Generating mesh…'} {progress}%
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="sketch__error">
          <p>{error}</p>
          <button className="btn btn--bare" onClick={() => setStatus('idle')}>
            Try again
          </button>
        </div>
      )}

      {status === 'done' && modelPath && (
        <div className="sketch__result">
          <ModelViewer src={modelPath} alt="A 3D model made from your drawing" poster={preview} />
          <div className="sketch__row">
            <span className="label">{mode === 'explorer' ? 'Drag it to spin it around' : 'Drag to orbit · scroll to zoom'}</span>
            <button className="btn btn--bare" onClick={() => { setStatus('idle'); setPreview(null) }}>
              {mode === 'explorer' ? 'Draw another' : 'Replace'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
