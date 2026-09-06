// Two transports, one interface.
//
//  proxy    — the normal build. Calls our own Express server, which holds the
//             Anthropic and Tripo keys. No key ever reaches the browser.
//  artifact — the published standalone build. There is no server of ours, so
//             idea review goes through the page's `sample` capability and
//             sketch-to-3D is unavailable (the sandbox cannot reach Tripo).

import { reviewIdeaViaSample, describeSketchViaSample } from './sampleClient.js'

const IS_ARTIFACT = import.meta.env.VITE_TARGET === 'artifact'

export const isArtifactBuild = () => IS_ARTIFACT

const SESSION_KEY = 'cubesat-session-id'

function sessionId() {
  let id = null
  try {
    id = sessionStorage.getItem(SESSION_KEY)
  } catch {
    /* private mode — fall through to a per-load id */
  }
  if (!id) {
    id = (crypto.randomUUID?.() || `s-${Date.now()}-${Math.random().toString(36).slice(2)}`).toLowerCase()
    try {
      sessionStorage.setItem(SESSION_KEY, id)
    } catch {
      /* ignore */
    }
  }
  return id
}

async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-session-id': sessionId() },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({ error: 'The server sent something unreadable' }))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

async function get(path) {
  const res = await fetch(path, { headers: { 'x-session-id': sessionId() } })
  const data = await res.json().catch(() => ({ error: 'The server sent something unreadable' }))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const health = () => get('/api/health')

export const reviewIdea = (payload) =>
  IS_ARTIFACT ? reviewIdeaViaSample(payload) : post('/api/idea', payload)
/**
 * Turn a photographed drawing into a 3D parts list. Claude reads the sketch;
 * the page assembles the model. Works identically in both builds.
 */
export const describeSketch = (payload) =>
  IS_ARTIFACT ? describeSketchViaSample(payload) : post('/api/sketch3d', payload)

/**
 * Downscale before upload. A modern phone photo is several megabytes; Tripo and
 * Claude both work fine from ~1024px, and it keeps the round trip quick on
 * venue wifi.
 */
export function fileToDownscaledDataUrl(file, maxEdge = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('That is not an image file'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      // Sketches are usually pencil on white; a white matte stops PNG
      // transparency turning into black in the JPEG.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That image could not be read'))
    }
    img.src = url
  })
}
