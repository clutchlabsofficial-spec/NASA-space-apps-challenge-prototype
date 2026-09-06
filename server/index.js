import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { reviewIdea, STATION_IDS } from './claude.js'
import { uploadImage, createImageToModelTask, getTask, downloadModel, tripoConfigured } from './tripo.js'
import { rateLimit, chargeIdea, chargeModel, refundModel, budget } from './guard.js'

const app = express()
// Sketches arrive as base64 in JSON. The client downscales before sending, but
// leave headroom for a full-resolution phone photo.
app.use(express.json({ limit: '12mb' }))
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }))

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_TEXT = 1200

// Finished models live here only. Nothing a child submits is ever written to
// disk, and a model is dropped an hour after it is made.
const models = new Map()
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000
  for (const [id, m] of models) if (m.created < cutoff) models.delete(id)
}, 10 * 60 * 1000).unref?.()

const sessionOf = (req) => {
  const id = req.get('x-session-id')
  if (!id || !/^[a-z0-9-]{8,64}$/i.test(id)) {
    throw Object.assign(new Error('Missing or malformed session id'), { status: 400 })
  }
  return id
}

function decodeImage(dataUrl) {
  if (!dataUrl) return null
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!m) throw Object.assign(new Error('Image must be a JPEG, PNG or WebP data URL'), { status: 400 })
  const buffer = Buffer.from(m[2], 'base64')
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('That photo is too large — try again with a smaller one'), { status: 413 })
  }
  return { mediaType: m[1], base64: m[2], buffer }
}

const wrap = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    const status = err.status || 500
    if (status >= 500) console.error(`[${req.method} ${req.path}]`, err)
    res.status(status).json({ error: err.message || 'Something went wrong' })
  })
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    claude: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN),
    tripo: tripoConfigured(),
  })
})

app.get('/api/budget', wrap(async (req, res) => res.json(budget(sessionOf(req)))))

/** Claude reviews a child's own idea for one subsystem. */
app.post('/api/idea', wrap(async (req, res) => {
  const sessionId = sessionOf(req)
  rateLimit(sessionId)

  const { stationId, missionId, mode, text, image, picks } = req.body || {}
  if (!STATION_IDS.includes(stationId)) {
    throw Object.assign(new Error('Unknown subsystem'), { status: 400 })
  }
  const img = decodeImage(image)
  if (!text?.trim() && !img) {
    throw Object.assign(new Error('Write your idea or add a drawing first'), { status: 400 })
  }

  const spend = chargeIdea(sessionId)
  const result = await reviewIdea({
    stationId,
    missionId,
    mode: mode === 'explorer' ? 'explorer' : 'engineer',
    text: typeof text === 'string' ? text.slice(0, MAX_TEXT) : '',
    imageBase64: img?.base64,
    imageMediaType: img?.mediaType,
    picks: picks && typeof picks === 'object' ? picks : {},
  })

  res.json({ ...result, spend })
}))

/** Turn a photographed sketch into a 3D model via Tripo. */
app.post('/api/sketch', wrap(async (req, res) => {
  const sessionId = sessionOf(req)
  rateLimit(sessionId)

  const img = decodeImage(req.body?.image)
  if (!img) throw Object.assign(new Error('Add a photo of your drawing first'), { status: 400 })

  const spend = chargeModel(sessionId)
  try {
    const fileToken = await uploadImage(img.buffer, img.mediaType)
    const taskId = await createImageToModelTask(fileToken)
    res.json({ taskId, spend })
  } catch (err) {
    // A failure before Tripo accepted the job should not cost the child one of
    // their models.
    refundModel(sessionId)
    throw err
  }
}))

app.get('/api/sketch/:taskId', wrap(async (req, res) => {
  const sessionId = sessionOf(req)
  const { taskId } = req.params

  if (models.has(taskId)) {
    return res.json({ status: 'success', progress: 100, modelPath: `/api/model/${taskId}.glb` })
  }

  const task = await getTask(taskId)

  if (task.status === 'success' && task.modelUrl) {
    // Fetch it right now — the URL Tripo handed us expires in five minutes.
    const glb = await downloadModel(task.modelUrl)
    models.set(taskId, { glb, created: Date.now() })
    return res.json({ status: 'success', progress: 100, modelPath: `/api/model/${taskId}.glb` })
  }

  if (['failed', 'cancelled', 'banned'].includes(task.status)) {
    refundModel(sessionId)
    return res.json({
      status: 'failed',
      progress: task.progress,
      error:
        task.status === 'banned'
          ? 'That picture could not be turned into a model. Try a drawing of your satellite on plain paper.'
          : 'The 3D model did not come out. Try photographing the drawing again with more light.',
    })
  }

  res.json({ status: task.status || 'running', progress: task.progress })
}))

app.get('/api/model/:file', wrap(async (req, res) => {
  const taskId = req.params.file.replace(/\.glb$/, '')
  const entry = models.get(taskId)
  if (!entry) throw Object.assign(new Error('That model has expired'), { status: 404 })
  res.type('model/gltf-binary').send(entry.glb)
}))

const port = Number(process.env.PORT || 8787)
app.listen(port, () => {
  console.log(`CubeSat Builder API on http://localhost:${port}`)
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.warn('  ANTHROPIC_API_KEY not set — "Design your own" will fail until it is.')
  }
  if (!tripoConfigured()) {
    console.warn('  TRIPO_API_KEY not set — sketch-to-3D will fail until it is.')
  }
})
