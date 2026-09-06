// Cost and abuse guards. A booth demo runs unattended for hours with a queue of
// children at it, so both the per-session cap and the global cap are real
// requirements rather than defensive decoration.

const SESSION_IDEA_LIMIT = Number(process.env.SESSION_IDEA_LIMIT || 40)
const SESSION_MODEL_LIMIT = Number(process.env.SESSION_MODEL_LIMIT || 4)
const GLOBAL_MODEL_LIMIT = Number(process.env.GLOBAL_MODEL_LIMIT || 200)
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = Number(process.env.MAX_REQUESTS_PER_MINUTE || 20)

const sessions = new Map()
let globalModels = 0

const now = () => Date.now()

function session(id) {
  let s = sessions.get(id)
  if (!s) {
    s = { ideas: 0, models: 0, hits: [], created: now() }
    sessions.set(id, s)
  }
  return s
}

// Sessions are ephemeral by design — nothing about a child persists past the
// process, and stale entries are swept so a long-running booth does not grow.
setInterval(() => {
  const cutoff = now() - 6 * 60 * 60 * 1000
  for (const [id, s] of sessions) if (s.created < cutoff) sessions.delete(id)
}, 30 * 60 * 1000).unref?.()

export function rateLimit(sessionId) {
  const s = session(sessionId)
  const cutoff = now() - WINDOW_MS
  s.hits = s.hits.filter((t) => t > cutoff)
  if (s.hits.length >= MAX_PER_WINDOW) {
    throw Object.assign(new Error('Slow down a moment — too many requests in the last minute.'), { status: 429 })
  }
  s.hits.push(now())
}

export function chargeIdea(sessionId) {
  const s = session(sessionId)
  if (s.ideas >= SESSION_IDEA_LIMIT) {
    throw Object.assign(
      new Error(`You have used all ${SESSION_IDEA_LIMIT} idea reviews for this session. Start a new mission to reset.`),
      { status: 429 },
    )
  }
  s.ideas += 1
  return { used: s.ideas, limit: SESSION_IDEA_LIMIT }
}

export function chargeModel(sessionId) {
  const s = session(sessionId)
  if (globalModels >= GLOBAL_MODEL_LIMIT) {
    throw Object.assign(new Error('The 3D model budget for today has run out.'), { status: 429 })
  }
  if (s.models >= SESSION_MODEL_LIMIT) {
    throw Object.assign(
      new Error(`You have made all ${SESSION_MODEL_LIMIT} 3D models for this session. Start a new mission for more.`),
      { status: 429 },
    )
  }
  s.models += 1
  globalModels += 1
  return { used: s.models, limit: SESSION_MODEL_LIMIT }
}

export function refundModel(sessionId) {
  const s = sessions.get(sessionId)
  if (s && s.models > 0) s.models -= 1
  if (globalModels > 0) globalModels -= 1
}

export const budget = (sessionId) => {
  const s = session(sessionId)
  return {
    ideas: { used: s.ideas, limit: SESSION_IDEA_LIMIT },
    models: { used: s.models, limit: SESSION_MODEL_LIMIT },
    globalModels: { used: globalModels, limit: GLOBAL_MODEL_LIMIT },
  }
}
