import { orbit } from './orbit.js'
import { payload } from './payload.js'
import { structure } from './structure.js'
import { power } from './power.js'
import { battery } from './battery.js'
import { brain } from './brain.js'
import { adcs } from './adcs.js'
import { thermal } from './thermal.js'
import { comms } from './comms.js'
import { ground } from './ground.js'
import { propulsion } from './propulsion.js'

export const STATIONS = [
  orbit,
  payload,
  structure,
  power,
  battery,
  brain,
  adcs,
  thermal,
  comms,
  ground,
  propulsion,
].sort((a, b) => a.order - b.order)

export const getStation = (id) => STATIONS.find((s) => s.id === id)

export const getOption = (stationId, optionId) =>
  getStation(stationId)?.options.find((o) => o.id === optionId)

// A station holds an ARRAY of picks. Real spacecraft combine hardware within a
// subsystem — magnetorquers and reaction wheels, coatings and MLI and heaters —
// so multi-select is the honest model, and single-select stations simply hold an
// array of one. Each entry is either a curated option id or a child's own
// invention returned by Claude.
export const isCustom = (pick) => Boolean(pick) && typeof pick === 'object' && pick.kind === 'custom'

/** Always an array, whatever shape the caller has. */
export const asList = (value) => (value == null ? [] : Array.isArray(value) ? value : [value])

export const pickKey = (pick) => (isCustom(pick) ? `custom:${pick.name}` : pick)

function resolveOne(stationId, pick) {
  if (!pick) return null
  if (isCustom(pick)) {
    return {
      id: pickKey(pick),
      custom: true,
      name: { e: pick.name, x: pick.name },
      blurb: { e: pick.summary, x: pick.summary },
      tags: pick.tags || [],
      detail: pick,
    }
  }
  const opt = getOption(stationId, pick)
  return opt ? { ...opt, custom: false } : null
}

/** Every resolved choice at a station. */
export const resolvePicks = (stationId, picks) =>
  asList(picks?.[stationId]).map((p) => resolveOne(stationId, p)).filter(Boolean)

/** The first choice at a station — for places that can only show one thing. */
export const resolvePick = (stationId, value) => resolveOne(stationId, asList(value)[0])

export const isChosen = (picks, stationId, optionId) =>
  asList(picks?.[stationId]).some((p) => pickKey(p) === optionId)

export const stationDone = (picks, stationId) => asList(picks?.[stationId]).length > 0

/**
 * The closest curated option to an invention, by tag overlap. Used only to
 * decide which piece of the cutaway drawing to reuse — the child's own idea is
 * still what the app describes and reasons about.
 */
export function nearestCuratedOption(stationId, tags = []) {
  const station = getStation(stationId)
  if (!station || !tags.length) return null
  let best = null
  let bestScore = 0
  for (const o of station.options) {
    const score = o.tags.filter((t) => tags.includes(t)).length
    if (score > bestScore) {
      best = o
      bestScore = score
    }
  }
  return bestScore > 0 ? best : null
}

// Options marked engineer-only are hidden in Explorer Mode: they are not
// simpler-or-harder versions of the same thing, they are genuinely more
// specialised choices that need the vocabulary to make sense.
export const visibleOptions = (station, mode) =>
  station.options.filter((o) => o.level === 'both' || mode === 'engineer')

// Flatten every tag from the current build, so the consequence rules and the
// final review can ask simple questions of the whole spacecraft at once.
export const tagsFor = (picks) => {
  const tags = new Set()
  for (const stationId of Object.keys(picks || {})) {
    for (const resolved of resolvePicks(stationId, picks)) {
      resolved.tags.forEach((t) => tags.add(t))
    }
  }
  return tags
}

/** Curated-option ids to draw for a station, inventions mapped to their nearest. */
export function visualIdsFor(stationId, value) {
  return asList(value)
    .map((pick) => (isCustom(pick) ? nearestCuratedOption(stationId, pick.tags)?.id ?? null : pick))
    .filter(Boolean)
}

export const totalPicks = (picks) =>
  Object.keys(picks || {}).reduce((n, sid) => n + asList(picks[sid]).length, 0)
