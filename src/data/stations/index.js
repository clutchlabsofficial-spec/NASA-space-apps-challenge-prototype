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

// Options marked engineer-only are hidden in Explorer Mode: they are not
// simpler-or-harder versions of the same thing, they are genuinely more
// specialised choices that need the vocabulary to make sense.
export const visibleOptions = (station, mode) =>
  station.options.filter((o) => o.level === 'both' || mode === 'engineer')

// Flatten every tag from the current build, so the consequence rules and the
// final review can ask simple questions of the whole spacecraft at once.
export const tagsFor = (picks) => {
  const tags = new Set()
  for (const [stationId, optionId] of Object.entries(picks)) {
    const opt = getOption(stationId, optionId)
    if (opt) opt.tags.forEach((t) => tags.add(t))
  }
  return tags
}
