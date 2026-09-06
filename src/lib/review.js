import { STATIONS, getOption, tagsFor } from '../data/stations/index.js'
import { getMission } from '../data/missions.js'
import { flightNotes } from './consequences.js'

// The end-of-build synthesis. Nothing here is scored and nothing is simulated —
// every statement is assembled from what is genuinely true of the real hardware
// the player picked.

const T = (e, x) => ({ e, x })

export const isComplete = (picks) => STATIONS.every((s) => picks[s.id])

// ---------------------------------------------------------------------------
// What the spacecraft could actually do
// ---------------------------------------------------------------------------

function capabilityClauses(picks, tags) {
  const out = []
  const pl = picks.payload

  if (pl === 'thermal-ir') {
    out.push(T(
      'Detect and map active fire fronts by their thermal emission — hardware of this class resolves hotspots down to roughly 4 m across, at around 200 m ground sampling, with about ±1 °C absolute temperature accuracy.',
      'Spot fires — even small ones, about the size of a bedroom — and measure how hot they are.',
    ))
    out.push(T(
      'Work at night and through smoke, because it senses emitted heat rather than reflected sunlight.',
      'See at night and straight through smoke, because it looks for heat instead of light.',
    ))
  }
  if (pl === 'vis-multispectral') {
    out.push(T(
      'Image the ground at roughly 3–5 m resolution in visible and near-infrared bands — enough to see individual fields, buildings and roads.',
      'Take sharp photos where you can make out fields, roads and buildings.',
    ))
    out.push(T(
      'Measure plant health by comparing red and near-infrared reflectance, the basis of vegetation indices used in agriculture worldwide.',
      'Tell healthy plants from struggling ones, by looking at a colour our eyes cannot see.',
    ))
  }
  if (pl === 'hyperspectral') {
    out.push(T(
      'Identify surface materials rather than just imaging them — distinguishing crop species, mineral types, water quality or gas plumes by their spectral signature.',
      'Work out what things are actually made of, not just what they look like.',
    ))
  }
  if (pl === 'sdr-receiver') {
    out.push(T(
      'Log AIS and ADS-B broadcasts from thousands of ships and aircraft per pass, over open ocean and airspace with no ground infrastructure at all.',
      'Hear thousands of ships and planes calling out their positions — even in the middle of the ocean.',
    ))
    out.push(T(
      'Be reprogrammed in orbit to decode a different signal format, because the demodulation is software.',
      'Be taught to listen for something completely different after launch, just by sending it new software.',
    ))
  }
  if (pl === 'gnss-ro') {
    out.push(T(
      'Produce vertical profiles of atmospheric temperature, pressure and humidity from GNSS signal bending — self-calibrating measurements that weather models can assimilate directly.',
      'Measure how warm and damp the air is, all the way up through the sky.',
    ))
    out.push(T(
      'Operate through cloud, at night, and over ocean, since it measures radio delay rather than light.',
      'Work through clouds, at night and over the sea.',
    ))
  }
  if (pl === 'particle-telescope') {
    out.push(T(
      'Measure the flux and energy of solar energetic particles and radiation-belt electrons along your orbit track — the same measurement class that produced peer-reviewed results from CSSWE and MinXSS.',
      'Count the tiny fast particles the Sun throws at Earth, and measure how much punch they carry.',
    ))
  }
  if (pl === 'ka-radar') {
    out.push(T(
      'See the internal vertical structure of precipitation — not just where clouds are, but where the rain is inside them, day or night.',
      'Look inside a storm and see where the rain actually is.',
    ))
  }

  // Orbit shapes what the instrument can be pointed at.
  if (tags.has('orbit:polar')) {
    out.push(T(
      'Cover the entire planet including high latitudes, and revisit each location at a consistent local solar time so images taken weeks apart are directly comparable.',
      'Fly over the whole world, poles included, and always arrive at the same time of day so your photos match.',
    ))
  }
  if (tags.has('orbit:no-poles')) {
    out.push(T(
      'Cover the mid-latitudes only — at 51.6° inclination the polar regions never pass beneath you, and lighting conditions differ on every pass.',
      'See most of the world, but never the very top or bottom — and the sunlight is different every time.',
    ))
  }
  if (tags.has('orbit:low') && (pl === 'vis-multispectral' || pl === 'hyperspectral' || pl === 'thermal-ir')) {
    out.push(T(
      'Get finer ground detail than the same optics would give from a higher orbit, simply because you are closer.',
      'See a bit more detail than usual, because you are flying lower.',
    ))
  }

  // Onboard processing genuinely changes what the mission can deliver.
  if (tags.has('cdh:onboard-processing')) {
    out.push(T(
      'Process data onboard before downlinking — detecting events in the raw stream and sending conclusions instead of gigabytes, which is what makes a fast alert possible on a slow link.',
      'Think about its own data before sending it, so it can send a short message instead of a huge file.',
    ))
  }
  if (tags.has('adcs:very-fine') || tags.has('adcs:fine')) {
    out.push(T(
      'Point at a chosen target and hold it steady enough for imaging, and slew between targets within a single pass.',
      'Aim at whatever you choose and hold still enough for sharp photos.',
    ))
  }
  if (tags.has('prop:manoeuvre-large')) {
    out.push(T(
      'Change its own orbit over time — raise or lower altitude, adjust phasing within a constellation, and manoeuvre for collision avoidance given enough warning.',
      'Move itself to a different orbit, slowly, over weeks.',
    ))
  }

  return out
}

// ---------------------------------------------------------------------------
// Honest limits
// ---------------------------------------------------------------------------

function limitClauses(picks, tags) {
  const out = []

  if (tags.has('need:sunlight')) {
    out.push(T(
      'It cannot see at night, and cloud or thick smoke will block the observation entirely.',
      'It cannot see in the dark, and clouds get in the way.',
    ))
  }
  if (tags.has('com:low-rate') && tags.has('need:high-data') && !tags.has('cdh:onboard-processing')) {
    out.push(T(
      'The downlink is the binding constraint: most of what the instrument collects will never reach the ground.',
      'The radio is far too slow — most of what it sees would never get home.',
    ))
  }
  if (tags.has('adcs:coarse') && tags.has('need:pointing-tight')) {
    out.push(T(
      'Attitude control is not tight enough for the instrument: expect motion smear over an exposure.',
      'It cannot hold still enough for this camera, so photos would be blurry.',
    ))
  }
  if (tags.has('adcs:nadir-only')) {
    out.push(T(
      'It can only look straight down. Off-nadir targeting and rotation about the vertical are uncontrolled.',
      'It can only look straight down, and it can still spin around like a top.',
    ))
  }
  if (tags.has('adcs:no-target-choice')) {
    out.push(T(
      'You do not get to choose the orientation — the spacecraft aligns with the local magnetic field, which rotates as you orbit.',
      'You do not get to pick which way it faces. It just lines up with Earth’s magnetism.',
    ))
  }
  if (tags.has('prop:no-manoeuvre')) {
    out.push(T(
      'It cannot change orbit or move out of the way of a conjunction warning.',
      'It cannot move out of the way of anything.',
    ))
  }
  if (tags.has('gnd:low-contact')) {
    out.push(T(
      'With a single ground station you get roughly four to six contacts a day, each about eight to twelve minutes, so anything urgent may wait hours.',
      'You can only talk to it a few times a day, for about ten minutes — so news can be hours late.',
    ))
  }
  if (tags.has('com:weather-dependent')) {
    out.push(T(
      'Cloud over the ground station stops the downlink completely, so operations depend on the weather at your receiving sites.',
      'A cloud over your ground station stops it from talking at all.',
    ))
  }
  if (tags.has('cdh:low-rad')) {
    out.push(T(
      'Expect occasional radiation-induced resets, and expect the processor to accumulate total ionising dose over the mission.',
      'Space radiation will sometimes crash the computer, and slowly wear the chip out.',
    ))
  }
  return out
}

// ---------------------------------------------------------------------------
// How long it would realistically last, and what ends it
// ---------------------------------------------------------------------------

function lifetime(picks, tags) {
  let orbitLife = T('unclear', 'unclear')
  if (tags.has('orbit:vleo')) {
    orbitLife = T(
      'At about 300 km, drag reentry within months.',
      'Only a few months before the air pulls it down.',
    )
  } else if (tags.has('orbit:iss')) {
    orbitLife = T(
      'At about 400 km, natural decay in roughly one to two years — NASA SoA notes that below 400 km most small satellites decay naturally within 5 years.',
      'About one or two years before it falls back to Earth by itself.',
    )
  } else if (tags.has('orbit:sso')) {
    if (tags.has('eol:natural')) {
      orbitLife = T(
        'At 475–600 km the orbit would persist well beyond 5 years — this does not comply with the FCC disposal rule, and a launch provider would require you to fix it.',
        'Up here it would stay in orbit far too long. That breaks the space-junk rules — you need a way to bring it down.',
      )
    } else {
      orbitLife = T(
        'Several years of operation, then a deliberate disposal that meets the 5-year rule.',
        'Several years of work, then it brings itself home on purpose.',
      )
    }
  }

  const limiters = []
  if (tags.has('cdh:low-rad')) {
    limiters.push(T(
      'Total ionising dose on a commercial processor (typically rated 20–40 krad) will eventually limit useful life before the orbit does.',
      'The computer chip slowly gets damaged by radiation, and that will probably stop the mission before the orbit does.',
    ))
  }
  if (tags.has('adcs:moving-parts')) {
    limiters.push(T(
      'Reaction wheel bearings are a wear item; a wheel failure late in life usually cannot be worked around.',
      'The spinning wheels wear out, and if one dies you cannot fix it.',
    ))
  }
  if (tags.has('tcs:moving-parts')) {
    limiters.push(T(
      'A mechanical cryocooler runs continuously and is typically the dominant wear-out item on the spacecraft.',
      'The fridge never stops running, so it wears out faster than anything else.',
    ))
  }
  if (tags.has('bat:cold-sensitive') && tags.has('tcs:no-heater')) {
    limiters.push(T(
      'Repeated cold charging will erode battery capacity faster than normal cycling would, shortening useful life significantly.',
      'Charging the battery when it is freezing damages it a bit more every single time.',
    ))
  }
  if (!limiters.length) {
    limiters.push(T(
      'Battery capacity fade from roughly 5,800 eclipse cycles a year is the normal life-limiting mechanism here.',
      'The battery slowly wears out from being used and refilled thousands of times a year.',
    ))
  }
  return { orbitLife, limiters }
}

// ---------------------------------------------------------------------------
// Disposal compliance — a real regulatory check, not a score
// ---------------------------------------------------------------------------

function disposal(tags) {
  if (tags.has('eol:propulsive')) {
    return {
      status: 'ok',
      text: T(
        'You carry propulsion, so you can perform a controlled deorbit burn at end of mission. This satisfies the FCC 5-year disposal requirement and gives you the option of a targeted reentry.',
        'You have an engine, so you can push yourself back down to Earth when you are finished. That follows the rules.',
      ),
    }
  }
  if (tags.has('eol:dragsail') || tags.has('eol:tether')) {
    return {
      status: 'ok',
      text: T(
        'Your passive deorbit device multiplies drag at end of mission, bringing you down well inside the 5-year window. It is a one-shot deployment, so its reliability is your compliance.',
        'Your space parachute makes the air grab you and pull you down. It only gets one chance to open, so it has to work.',
      ),
    }
  }
  if (tags.has('orbit:needs-disposal')) {
    return {
      status: 'fail',
      text: T(
        'Nothing in this build removes the spacecraft from a 475–600 km orbit. NASA SoA notes that satellites in the 400–800 km band typically need a passive deorbit system to comply, and the FCC has required disposal within 5 years of launch since September 2022. As designed, this spacecraft would become long-lived debris.',
        'Nothing in your design brings the satellite home, and it is flying too high to come down by itself. It would be left up there as space junk — and that is against the rules now.',
      ),
    }
  }
  return {
    status: 'ok',
    text: T(
      'Your orbit is low enough that atmospheric drag disposes of the spacecraft naturally, well inside the 5-year requirement. No hardware needed — the best kind of compliance.',
      'You are flying low enough that the air brings you home all by itself. Nothing to build, nothing to break.',
    ),
  }
}

// ---------------------------------------------------------------------------
// Does the build actually answer the mission question?
// ---------------------------------------------------------------------------

function missionVerdict(missionId, picks, tags) {
  const mission = getMission(missionId)
  const fit = mission.payloadFit[picks.payload] || 'no'
  const plOpt = getOption('payload', picks.payload)

  const base = {
    ideal: T(
      `This is the right instrument for ${mission.name.e}. It is the same class of payload real missions fly for this job.`,
      `This is exactly the right tool for the job. Real satellites doing this use the same kind of thing.`,
    ),
    partial: T(
      `This instrument can contribute to ${mission.name.e}, but it is not the primary sensor a real mission would choose. You would get partial answers.`,
      `This tool can help a bit, but it is not really the right one. You would only get part of the answer.`,
    ),
    no: T(
      `This instrument does not answer the ${mission.name.e} question. The spacecraft would work perfectly and return data that does not address the mission — which is exactly how real missions fail.`,
      `This tool cannot do this job. Your satellite would work perfectly and still not answer your question — which is how real missions go wrong.`,
    ),
  }[fit]

  const blockers = []
  if (mission.needs.includes('low-latency-downlink') && tags.has('gnd:low-contact')) {
    blockers.push(T(
      'This mission needs fast alerts, and a single ground station gives you a handful of contacts a day. The observation is fine; the delivery is too slow.',
      'This job needs fast news, but with one antenna you only talk a few times a day. The satellite sees the fire — nobody hears about it in time.',
    ))
  }
  if (mission.needs.includes('consistent-lighting') && tags.has('orbit:variable-lighting')) {
    blockers.push(T(
      'Comparing plant health over time requires the same sun angle each visit. From an inclined, non-sun-synchronous orbit the lighting changes every pass, so a real change on the ground is hard to separate from a change in illumination.',
      'To see whether plants are getting healthier, your photos need the same sunlight every time. From this orbit the light is different each visit, so you cannot tell what really changed.',
    ))
  }
  if (mission.needs.includes('stable-pointing') && tags.has('adcs:coarse')) {
    blockers.push(T(
      'The mission needs imaging-grade stability and this attitude system does not provide it.',
      'This job needs the satellite to hold very still, and your pointing system cannot.',
    ))
  }
  if (mission.needs.includes('high-downlink') && tags.has('com:low-rate') && !tags.has('cdh:onboard-processing')) {
    blockers.push(T(
      'The mission produces imagery and your link cannot carry it.',
      'This job makes big photos and your radio is far too slow to send them.',
    ))
  }
  if (mission.needs.includes('radiation-hard') && tags.has('cdh:low-rad')) {
    blockers.push(T(
      'You are deliberately flying through energetic particles with a commercial processor. Survivable with good fault handling, but plan for resets and protect your science data.',
      'You are flying into space storms with an ordinary computer chip. It will get knocked over sometimes — make sure it can always restart.',
    ))
  }

  return { fit, base, blockers, plOpt, mission }
}

// ---------------------------------------------------------------------------

export function buildReview(missionId, picks) {
  const tags = tagsFor(picks)
  return {
    tags,
    capabilities: capabilityClauses(picks, tags),
    limits: limitClauses(picks, tags),
    lifetime: lifetime(picks, tags),
    disposal: disposal(tags),
    mission: missionVerdict(missionId, picks, tags),
    notes: flightNotes(picks),
  }
}

// What a real team would have to do next, before any of this flies.
export const NEXT_STEPS = [
  {
    title: T('Random vibration test', 'The shaking test'),
    body: T(
      'NASA’s CubeSat Launch Initiative requires the spacecraft to survive a GEVS random-vibration environment of approximately 10 Grms over a two-minute period. This is what breaks most first-time hardware — fasteners back out, connectors unseat, solder joints crack.',
      'Your satellite gets bolted to a shaker table and rattled hard for two minutes, to prove it can survive the rocket. This is what breaks most first satellites.',
    ),
    sources: ['soa-struct', 'cubesat101'],
  },
  {
    title: T('Thermal vacuum test and bakeout', 'The hot-and-cold vacuum test'),
    body: T(
      'The spacecraft is pumped down to vacuum and cycled between its hot and cold survival limits. Bakeout also drives off volatiles that would otherwise outgas in orbit and condense on optics and radiators.',
      'Your satellite goes into a chamber with all the air sucked out, then gets baked hot and frozen cold over and over — to prove it still works, and to cook out anything that would fog up its camera in space.',
    ),
    sources: ['cubesat101', 'soa-thermal'],
  },
  {
    title: T('Deployment and inhibit verification', 'Proving it stays switched off — then opens'),
    body: T(
      'Every deployable is released dozens of times to prove repeatability, and the inhibit chain is verified: a CubeSat must stay electrically off inside the deployer and must not transmit or deploy immediately after ejection. Deployment switches and RF-silence timers exist so a stuck satellite cannot damage the launch vehicle or its neighbours.',
      'Everything that unfolds gets tested again and again. Engineers also prove the satellite stays completely switched off inside the launcher, and waits quietly after it is released, so it cannot hurt anything nearby.',
    ),
    sources: ['cubesat101', 'cds'],
  },
  {
    title: T('Frequency coordination and licensing', 'Getting permission to use your radio'),
    body: T(
      'You cannot legally transmit without authorisation. Amateur-band missions coordinate through the IARU; other bands need a national licence such as an FCC authorisation. This process starts many months before launch and has ended missions that left it too late.',
      'You are not allowed to switch on a radio in space without asking first. It takes months to get permission — and some teams have missed their launch because they left it too late.',
    ),
    sources: ['cubesat101', 'soa-comms'],
  },
  {
    title: T('Orbital debris assessment', 'Proving you will clean up'),
    body: T(
      'You must show analytically that the spacecraft will be disposed of within 5 years of launch, and that it will not survive reentry in a way that endangers anyone on the ground. This is a licensing requirement, not a courtesy.',
      'You have to prove with maths that your satellite will come back down within five years, and burn up safely on the way.',
    ),
    sources: ['fcc-5yr', 'soa-deorbit'],
  },
  {
    title: T('Day-in-the-life operations rehearsal', 'Practising a real day in space'),
    body: T(
      'The full ground segment, flight software and operations team run a realistic sequence end to end before launch, including injected faults. The most common reason a working satellite returns no science is that nobody rehearsed what to do when it stopped answering.',
      'Before launch, the whole team practises a real day of running the satellite — including pretending things go wrong. Lots of satellites work fine and still fail, just because nobody practised.',
    ),
    sources: ['cubesat101'],
  },
]
