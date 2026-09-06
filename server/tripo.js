// Tripo AI (VAST) image-to-3D.
//
// Verified against the Tripo v3 quick-start docs:
//   base            https://openapi.tripo3d.ai/v3
//   auth            Authorization: Bearer <key>
//   create task     POST /generation/image-to-model  { file_token, model, face_limit }
//   poll            GET  /tasks/{task_id}  -> { status, progress, output.model_url }
//   status values   success | failed | cancelled | banned (plus queued/running)
//   IMPORTANT       returned model URLs expire after 5 minutes
//
// Tripo v2 (api.tripo3d.ai/v2/openapi/task) is retired on 2026-11-01, which is
// during the hackathon — do not fall back to it.
//
// The one piece the public docs would not render for us is the file-upload
// endpoint that mints a file_token. It is isolated here and overridable, so if
// Tripo's path differs you change one env var rather than hunting through code.

const BASE = process.env.TRIPO_BASE_URL || 'https://openapi.tripo3d.ai/v3'
const UPLOAD_PATH = process.env.TRIPO_UPLOAD_PATH || '/upload/sts'
const MODEL = process.env.TRIPO_MODEL || 'P1-20260311'
const FACE_LIMIT = Number(process.env.TRIPO_FACE_LIMIT || 8000)

const key = () => {
  const k = process.env.TRIPO_API_KEY
  if (!k) throw Object.assign(new Error('TRIPO_API_KEY is not set on the server'), { status: 503 })
  return k
}

async function tripo(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key()}`, ...(init.headers || {}) },
  })
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    throw Object.assign(new Error(`Tripo returned non-JSON from ${path}: ${text.slice(0, 200)}`), { status: 502 })
  }
  if (!res.ok || (body.code !== undefined && body.code !== 0)) {
    const detail = body.message || body.error || text.slice(0, 200)
    throw Object.assign(new Error(`Tripo ${path} failed (${res.status}): ${detail}`), { status: res.status === 401 ? 401 : 502 })
  }
  return body.data ?? body
}

/** Upload the sketch and get back the token the generator refers to it by. */
export async function uploadImage(buffer, mediaType = 'image/jpeg') {
  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mediaType }), 'sketch.jpg')

  let data
  try {
    data = await tripo(UPLOAD_PATH, { method: 'POST', body: form })
  } catch (err) {
    if (String(err.message).includes('404')) {
      throw Object.assign(
        new Error(
          `Tripo upload endpoint ${BASE}${UPLOAD_PATH} returned 404. Check the current path in Tripo's docs and set TRIPO_UPLOAD_PATH to match.`,
        ),
        { status: 502 },
      )
    }
    throw err
  }

  const token = data.image_token || data.file_token || data.token
  if (!token) throw Object.assign(new Error('Tripo upload succeeded but returned no file token'), { status: 502 })
  return token
}

export async function createImageToModelTask(fileToken) {
  const data = await tripo('/generation/image-to-model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_token: fileToken, model: MODEL, face_limit: FACE_LIMIT }),
  })
  if (!data.task_id) throw Object.assign(new Error('Tripo did not return a task_id'), { status: 502 })
  return data.task_id
}

export async function getTask(taskId) {
  const data = await tripo(`/tasks/${encodeURIComponent(taskId)}`)
  return {
    status: data.status,
    progress: typeof data.progress === 'number' ? data.progress : 0,
    modelUrl: data.output?.model_url || data.output?.pbr_model || null,
    raw: data,
  }
}

/**
 * Model URLs die after five minutes, so the moment a task succeeds we pull the
 * GLB down and hold it ourselves. The browser is always served by us, never by
 * a URL that may already have expired by the time a child taps it.
 */
export async function downloadModel(url) {
  const res = await fetch(url)
  if (!res.ok) throw Object.assign(new Error(`Could not download the finished model (${res.status})`), { status: 502 })
  return Buffer.from(await res.arrayBuffer())
}

export const tripoConfigured = () => Boolean(process.env.TRIPO_API_KEY)
