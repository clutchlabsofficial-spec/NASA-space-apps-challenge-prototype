import { useEffect, useState } from 'react'

// @google/model-viewer registers a <model-viewer> custom element. It is a
// sizeable module, so it is imported only when a model actually exists.
let loading = null
const ensureViewer = () => {
  if (!loading) loading = import('@google/model-viewer')
  return loading
}

export default function ModelViewer({ src, alt, poster }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let live = true
    ensureViewer().then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])

  if (!ready) {
    return <div className="modelviewer modelviewer--loading mono">Loading 3D viewer…</div>
  }

  return (
    <model-viewer
      class="modelviewer"
      src={src}
      alt={alt}
      poster={poster}
      camera-controls=""
      auto-rotate=""
      touch-action="pan-y"
      shadow-intensity="0.6"
      exposure="1.1"
    />
  )
}
