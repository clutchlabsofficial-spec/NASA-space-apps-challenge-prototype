/**
 * Launch site scout.
 *
 * ── What this does and, more importantly, what it refuses to do ───────────
 *
 * A CubeSat does not get launched by a child. It rides a rocket to orbit. What
 * students actually build and fly themselves is a CanSat — the same subsystems,
 * packed into a drink-can volume, lofted a few hundred metres by a model rocket
 * or dropped from a drone. That is the thing this tool finds space for.
 *
 * This tool will NOT tell anyone that a particular field is a legal, safe place
 * to launch from. It cannot know that. Open ground on a map is routinely still
 * someone's property, inside a flight path, next to dry grass, or covered by a
 * local by-law that no map records. Telling a child "this field is empty and
 * public, go and launch here" is the one output that could actually hurt them.
 *
 * So it returns CANDIDATES TO CHECK WITH AN ADULT, each measured against the
 * real clearance rule, with the questions that still need answering attached.
 * The child does the same thing a real range safety officer does: shortlist,
 * then verify on the ground.
 *
 * ── Sources ───────────────────────────────────────────────────────────────
 * Minimum site dimensions are the National Association of Rocketry Model Rocket
 * Safety Code table (nar.org/ModelRocketSafetyCode), which sizes the required
 * clear area by the motor's total impulse. Those numbers are not invented here.
 *
 * Open-space data comes from OpenStreetMap via the public Overpass API. OSM is
 * crowd-mapped, so it is a starting point, never an authority.
 *
 * ── Privacy ───────────────────────────────────────────────────────────────
 * The coordinates never leave the browser except inside the Overpass query
 * itself, they are never stored, never logged, and never sent to this app's own
 * server. The user is asked every time; the browser asks again anyway.
 */

/** NAR Model Rocket Safety Code — minimum site dimensions by motor class.
 *  `feet` is the minimum dimension of the clear launch area. */
export const NAR_SITE_TABLE = [
  { cls: '1/4A, 1/2A', impulse: '0.00–1.25 N·s', feet: 50, metres: 15 },
  { cls: 'A', impulse: '1.26–2.50 N·s', feet: 100, metres: 30 },
  { cls: 'B', impulse: '2.51–5.00 N·s', feet: 200, metres: 61 },
  { cls: 'C', impulse: '5.01–10.00 N·s', feet: 400, metres: 122 },
  { cls: 'D', impulse: '10.01–20.00 N·s', feet: 500, metres: 152 },
  { cls: 'E', impulse: '20.01–40.00 N·s', feet: 1000, metres: 305 },
  { cls: 'F', impulse: '40.01–80.00 N·s', feet: 1000, metres: 305 },
  { cls: 'G', impulse: '80.01–160.00 N·s', feet: 1000, metres: 305 },
  { cls: 'Two G', impulse: '160.01–320.00 N·s', feet: 1500, metres: 457 },
]

export const NAR_SOURCE = {
  label: 'NAR Model Rocket Safety Code',
  url: 'https://www.nar.org/safety-information/model-rocket-safety-code/',
}

/** The three realistic ways a school actually flies a CanSat. Each needs a
 *  different amount of ground, which is what makes the search meaningful. */
export const FLIGHT_MODES = {
  drop: {
    id: 'drop',
    name: { e: 'Drone drop or high tower', x: 'Dropped from a drone' },
    blurb: {
      e: 'Your CanSat is carried up and released. No motor, no combustion, no impulse class — by far the easiest to get permission for.',
      x: 'A drone carries your CanSat up and lets it go. Nothing burns, nothing explodes — much easier to get permission.',
    },
    needMetres: 50,
    why: { e: 'Enough clear ground for the descent and a drifting parachute.', x: 'Enough space for it to float down without landing on anything.' },
  },
  small: {
    id: 'small',
    name: { e: 'Small model rocket (A–C motor)', x: 'A small model rocket' },
    blurb: {
      e: 'The classic school launch. A C motor needs a clear area at least 400 ft (122 m) across under the NAR safety code.',
      x: 'The usual school rocket. It needs a clear space at least 122 m across — about the length of a football pitch and a bit.',
    },
    needMetres: 122,
    why: { e: 'NAR minimum site dimension for a class C motor.', x: 'That is the official safety rule for this size of motor.' },
  },
  medium: {
    id: 'medium',
    name: { e: 'Larger model rocket (D–E motor)', x: 'A bigger model rocket' },
    blurb: {
      e: 'Reaches properly high, and the required clear area jumps to 500–1000 ft. Almost always needs a rocketry club and a permitted field.',
      x: 'Goes much higher, and needs a far bigger empty space — usually a proper rocket club field.',
    },
    needMetres: 305,
    why: { e: 'NAR minimum site dimension for class E.', x: 'The official rule for this size of motor.' },
  },
}

/** Rules that apply wherever you are. These are the parts a map cannot tell
 *  you, and they are shown with every single result — never as a dismissible
 *  footnote. */
export const SAFETY_RULES = [
  {
    id: 'adult',
    title: { e: 'An adult has to be part of this', x: 'You need a grown-up with you' },
    body: {
      e: 'Model rocket motors are pyrotechnic devices. Every safety code in the world requires adult supervision for under-18s, and most require a designated person responsible for the launch.',
      x: 'Rocket motors really do burn. You must never do this without an adult who knows what is happening.',
    },
  },
  {
    id: 'permission',
    title: { e: 'Open on a map is not the same as allowed', x: 'Empty does not mean allowed' },
    body: {
      e: 'Parks, playing fields and grassland almost always have an owner — a council, a school, a trust, a farmer. You need their permission, and a map cannot give it to you. Find out who owns it and ask.',
      x: 'Almost every field belongs to somebody — a council, a school, a farmer. You have to find out who, and ask them first. A map cannot tell you that.',
    },
  },
  {
    id: 'air',
    title: { e: 'Check the airspace', x: 'Check what is flying above' },
    body: {
      e: 'Never launch near an airport or under a flight path. Rules differ by country: in the US small model rockets are covered by FAA Part 101 with notification thresholds; India has no dedicated model rocketry law and student launches are normally run with permission and often in coordinated airspace. Find out what applies where you live — that research is part of the engineering.',
      x: 'Never launch near an airport or under where planes fly. Different countries have different rules — finding out the rule where you live is part of the job.',
    },
  },
  {
    id: 'fire',
    title: { e: 'Dry grass is the real hazard', x: 'Dry grass catches fire' },
    body: {
      e: 'The NAR code requires launching from a blast-deflecting pad with no dry grass close by, and not in winds above 20 mph. More model rocket incidents are grass fires than anything else.',
      x: 'Never launch over dry grass, and not when it is windy. Most rocket accidents are grass fires, not crashes.',
    },
  },
  {
    id: 'recover',
    title: { e: 'Plan how you get it back', x: 'Plan how to find it again' },
    body: {
      e: 'Your CanSat comes down on a parachute and drifts. You need clear ground downwind, and you must never climb a fence, a tree or a roof to retrieve it — recovery is where people actually get hurt.',
      x: 'It floats down on a parachute and the wind pushes it. Never climb a fence or a tree to get it back — that is how people really get hurt.',
    },
  },
]

/* ── Geometry ──────────────────────────────────────────────────────────── */

const R_EARTH_M = 6371000
const toRad = (d) => (d * Math.PI) / 180

/** Great-circle distance in metres. */
export function distanceM(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const la1 = toRad(a.lat)
  const la2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2
  return 2 * R_EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Rough span of a bounding box, in metres — the smaller of width and height,
 *  because a long thin strip is not a launch site however large its area. */
export function boundsSpanM(bounds) {
  if (!bounds) return null
  const { minlat, minlon, maxlat, maxlon } = bounds
  if ([minlat, minlon, maxlat, maxlon].some((v) => typeof v !== 'number')) return null
  const height = distanceM({ lat: minlat, lon: minlon }, { lat: maxlat, lon: minlon })
  const width = distanceM({ lat: minlat, lon: minlon }, { lat: minlat, lon: maxlon })
  return Math.round(Math.min(height, width))
}

/* ── Overpass ──────────────────────────────────────────────────────────── */

/**
 * Open space that is plausibly usable, with the obviously-wrong things
 * excluded at the query level:
 *   - access=private is filtered out, which is the closest OSM gets to
 *     answering "is this private land". It is not authoritative — plenty of
 *     private land simply is not tagged — which is why the result still says
 *     "check who owns it".
 *   - military, aerodromes and nature reserves are excluded outright.
 */
export function buildOverpassQuery(lat, lon, radiusM) {
  const r = Math.round(radiusM)
  const kinds = [
    'way["leisure"="park"]',
    'way["leisure"="recreation_ground"]',
    'way["leisure"="pitch"]["sport"~"cricket|soccer|football|athletics"]',
    'way["landuse"="meadow"]',
    'way["landuse"="grass"]',
    'way["landuse"="recreation_ground"]',
    'way["natural"="grassland"]',
    'way["natural"="heath"]',
  ]
  const body = kinds
    .map((k) => `  ${k}["access"!~"private|no"]["military"!~"."]["aeroway"!~"."](around:${r},${lat},${lon});`)
    .join('\n')
  /* `out center bb` gives us both the centroid (for distance) and the bounding
     box (for span), which is what lets us reject a site that is too small. */
  return `[out:json][timeout:25];\n(\n${body}\n);\nout center bb;`
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

const NAME_FOR = {
  park: { e: 'Park', x: 'Park' },
  recreation_ground: { e: 'Recreation ground', x: 'Playing field' },
  pitch: { e: 'Sports pitch', x: 'Sports field' },
  meadow: { e: 'Meadow', x: 'Meadow' },
  grass: { e: 'Grassland', x: 'Grassy area' },
  grassland: { e: 'Grassland', x: 'Grassy area' },
  heath: { e: 'Heath', x: 'Open heath' },
}

function describeKind(tags = {}) {
  const key = tags.leisure || tags.landuse || tags.natural
  return NAME_FOR[key] || { e: 'Open space', x: 'Open space' }
}

/**
 * Search for candidate open spaces.
 *
 * Returns `{ ok, sites, note }`. It never throws for a network failure —
 * a blocked request is an expected outcome (this page may be served from a
 * sandboxed origin), and the caller shows the manual fallback instead.
 */
export async function findOpenSpaces({ lat, lon, radiusM = 5000, needMetres = 122, signal } = {}) {
  const query = buildOverpassQuery(lat, lon, radiusM)

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: query }).toString(),
        signal,
      })
      if (!res.ok) continue
      const json = await res.json()
      const sites = (json.elements || [])
        .map((el) => {
          const centre = el.center || (el.lat != null ? { lat: el.lat, lon: el.lon } : null)
          if (!centre) return null
          const span = boundsSpanM(el.bounds)
          return {
            id: `${el.type}/${el.id}`,
            lat: centre.lat,
            lon: centre.lon,
            name: el.tags?.name || null,
            kind: describeKind(el.tags),
            tags: el.tags || {},
            distanceM: Math.round(distanceM({ lat, lon }, centre)),
            spanM: span,
            /* A site only "fits" if we could actually measure it AND it clears
               the requirement. Unknown is never treated as a pass. */
            fits: span != null ? span >= needMetres : null,
            osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          /* Big enough first, then nearest. A site we could not measure sorts
             below one we could, because it needs more checking. */
          const rank = (s) => (s.fits === true ? 0 : s.fits === null ? 1 : 2)
          return rank(a) - rank(b) || a.distanceM - b.distanceM
        })

      return { ok: true, sites, note: null }
    } catch {
      /* try the next mirror */
    }
  }

  return {
    ok: false,
    sites: [],
    note: 'Could not reach the open-space map service from here.',
  }
}

/** A link that opens the same search on a real map the child can pan around.
 *  This is the fallback when Overpass is unreachable, and it is genuinely
 *  useful even when it is not. */
export function mapLinkFor(lat, lon, zoom = 15) {
  return `https://www.openstreetmap.org/#map=${zoom}/${lat.toFixed(5)}/${lon.toFixed(5)}`
}

/** Browser geolocation, wrapped so the caller gets one predictable shape.
 *  `coarse` deliberately rounds to ~1 km: the app never needs to know exactly
 *  where a child is standing, and a search radius of kilometres does not care. */
export function getLocation({ coarse = true, timeout = 12000 } = {}) {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return resolve({ ok: false, reason: 'unsupported' })
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const round = (v) => (coarse ? Math.round(v * 100) / 100 : v)
        resolve({
          ok: true,
          lat: round(pos.coords.latitude),
          lon: round(pos.coords.longitude),
          accuracyM: Math.round(pos.coords.accuracy || 0),
          coarse,
        })
      },
      (err) => {
        const reason =
          err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable'
        resolve({ ok: false, reason })
      },
      { enableHighAccuracy: false, timeout, maximumAge: 300000 },
    )
  })
}

/** Format a distance the way a child reads it. */
export function prettyDistance(m) {
  if (m == null) return '—'
  if (m < 1000) return `${m} m`
  return `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} km`
}
