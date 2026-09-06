import { STATIONS } from './stations/index.js'

// The consequence engine and the final review both work purely off tags.
// That is what lets a child's invented part behave exactly like a curated
// one: Claude is required to describe the invention using this same closed
// vocabulary, so every coupling rule keeps firing.

export const ALLOWED_TAGS = [...new Set(STATIONS.flatMap((s) => s.options.flatMap((o) => o.tags)))].sort()

export const TAGS_BY_STATION = Object.fromEntries(
  STATIONS.map((s) => [s.id, [...new Set(s.options.flatMap((o) => o.tags))].sort()]),
)

// Short meanings for the tags whose choice actually changes the review, so the
// model is not guessing from the string alone.
export const TAG_GLOSSARY = {
  'need:pointing-loose': 'instrument tolerates several degrees of pointing error',
  'need:pointing-moderate': 'instrument needs roughly nadir or target pointing, about a degree',
  'need:pointing-tight': 'instrument smears or fails without sub-degree, imaging-grade stability',
  'need:low-data': 'produces kilobytes per pass',
  'need:medium-data': 'produces megabytes per pass',
  'need:high-data': 'produces imagery-scale data that a slow link cannot clear',
  'need:very-high-data': 'produces data volumes that force onboard reduction',
  'need:high-power': 'actively transmits or runs a continuous heavy load',
  'need:thermal-stability': 'performance depends on holding a steady known temperature',
  'need:sunlight': 'only works in reflected sunlight, so blind at night and through cloud',
  'need:rad-tolerance': 'deliberately operates in an energetic particle environment',
  'need:deployable-antenna': 'requires a mechanism to unfold in orbit',
  'need:volume': 'needs more internal volume than a 1U can offer',
  'need:volume-6u': 'physically cannot fit below a 6U',
  'need:precise-timing': 'depends on a very stable clock and precise orbit knowledge',
  'cap:sees-heat': 'can detect thermal emission',
  'cap:night': 'works in darkness',
  'cap:through-smoke': 'sees through smoke',
  'cap:sees-colour': 'images in visible or near-infrared bands',
  'cap:high-res': 'resolves metre-scale ground detail',
  'cap:listens-radio': 'receives radio transmissions from the surface',
  'cap:all-weather': 'unaffected by cloud and darkness',
  'cap:profiles-atmosphere': 'measures vertical atmospheric structure',
  'cap:detects-particles': 'measures energetic particles or photons directly',
  'cap:identifies-materials': 'distinguishes materials by spectral signature',
  'cap:sees-inside-storms': 'senses the internal structure of precipitation',
  'adcs:coarse': 'attitude accuracy measured in degrees',
  'adcs:fine': 'sub-degree attitude accuracy',
  'adcs:very-fine': 'arcsecond-class attitude knowledge',
  'adcs:no-power': 'needs no electrical power at all',
  'adcs:standby-power': 'draws power continuously even when holding still',
  'adcs:moving-parts': 'contains a continuously moving wear item',
  'power:low': 'generation limited to the satellite body area',
  'power:medium': 'deployed panels, several times body area',
  'power:high': 'deployed and sun-tracking',
  'power:has-deployable': 'includes a one-shot deployment',
  'com:low-rate': 'kilobits per second',
  'com:medium-rate': 'megabits per second',
  'com:high-rate': 'hundreds of megabits per second or more',
  'com:omni': 'link closes regardless of attitude',
  'com:needs-fine-pointing': 'narrow beam, link fails on a pointing error',
  'tcs:no-heater': 'cannot hold a minimum temperature through eclipse',
  'tcs:uses-power': 'consumes electrical power, typically in eclipse',
  'tcs:passive': 'no power and no moving parts',
  'bat:cold-sensitive': 'permanently damaged by charging below freezing',
  'bat:needs-heater': 'requires survival heating',
  'cdh:low-rad': 'commercial silicon, expect radiation-induced resets',
  'cdh:onboard-processing': 'can reduce or triage data before downlink',
  'prop:no-manoeuvre': 'cannot change its orbit',
  'prop:has-deployable': 'includes a one-shot deployment',
  'eol:natural': 'relies on atmospheric drag alone for disposal',
  'eol:dragsail': 'deploys a passive drag device for disposal',
  'eol:propulsive': 'can perform a deliberate deorbit burn',
  'struct:tiny': '1U-class internal volume',
  'struct:low-area': 'very little external surface for cells or radiators',
}

/** The slice of vocabulary a given station's invention is allowed to use. */
export function tagMenuFor(stationId) {
  const own = TAGS_BY_STATION[stationId] || []
  // Payload inventions also drive the rest of the bus, so they may declare
  // the need:/cap: vocabulary in full.
  const cross = stationId === 'payload'
    ? ALLOWED_TAGS.filter((t) => t.startsWith('need:') || t.startsWith('cap:'))
    : []
  return [...new Set([...own, ...cross])].sort()
}
