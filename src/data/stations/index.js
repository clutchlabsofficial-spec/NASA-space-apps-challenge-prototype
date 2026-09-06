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

// A pick is either the id of a curated option, or a child's own invention
// returned by Claude. Everything downstream — the coupling rules, the manifest,
// the final review — goes through this so it never has to care which.
export const isCustom = (pick) => Boolean(pick) && typeof pick === 'object' && pick.kind === 'custom'

export function resolvePick(stationId, pick) {
  if (!pick) return null
  if (isCustom(pick)) {
    return {
      id: 'custom',
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
  for (const [stationId, pick] of Object.entries(picks)) {
    const resolved = resolvePick(stationId, pick)
    if (resolved) resolved.tags.forEach((t) => tags.add(t))
  }
  return tags
}

/** The curated-option id to draw for a station, custom picks included. */
export function visualIdFor(stationId, pick) {
  if (!pick) return null
  if (isCustom(pick)) return nearestCuratedOption(stationId, pick.tags)?.id ?? null
  return pick
}
