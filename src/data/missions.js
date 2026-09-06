// Five mission goals, each modelled on real flown CubeSat missions.
// A mission is not a scoring rubric — it's a set of honest engineering
// requirements the final review checks the player's build against.

export const MISSIONS = [
  {
    id: 'wildfire',
    codename: 'EMBER',
    name: { e: 'Wildfire Watch', x: 'Find Fires From Space' },
    tagline: {
      e: 'Detect and map active fire fronts by their heat, day or night.',
      x: 'Spot fires while they are still small — even in the dark.',
    },
    brief: {
      e: 'Fires give off far more long-wave and mid-wave infrared light than the ground around them, so a thermal camera sees a fire front even through smoke and darkness. This is the same trick OroraTech uses on its FOREST CubeSats.',
      x: 'A fire is much hotter than the trees around it. Special heat-cameras can see that hot spot even at night or through smoke — regular cameras cannot.',
    },
    realAnalog: 'OroraTech FOREST-1 (3U), FOREST-2 (6U) — uncooled microbolometer thermal imagers, ~200 m ground sampling distance, ±1 °C absolute temperature accuracy',
    needs: ['sees-heat', 'frequent-revisit', 'low-latency-downlink', 'stable-pointing'],
    // Payload ids that genuinely serve this mission, with an honest verdict.
    payloadFit: {
      'thermal-ir': 'ideal',
      'vis-multispectral': 'partial',
      hyperspectral: 'partial',
      'sdr-receiver': 'no',
      'gnss-ro': 'no',
      'particle-telescope': 'no',
      'ka-radar': 'no',
    },
    sources: ['eo-ororatech'],
  },
  {
    id: 'maritime',
    codename: 'BEACON',
    name: { e: 'Ships & Planes Tracker', x: 'Listen for Ships and Planes' },
    tagline: {
      e: 'Receive AIS and ADS-B beacons from ships and aircraft far beyond coastal radio range.',
      x: 'Hear the little "I am here!" radio messages ships and planes send out.',
    },
    brief: {
      e: 'Ships broadcast AIS position messages on VHF and aircraft broadcast ADS-B; both are line-of-sight from the ground but wide open from orbit. A satellite is essentially a very tall radio mast, so a software-defined radio can log thousands of vessels per pass. Spire flies exactly this on 3U Lemur-2 buses.',
      x: 'Ships and planes shout out where they are on the radio. From the ground you can only hear them nearby — but from space you can hear a whole ocean at once.',
    },
    realAnalog: 'Spire Global Lemur-2 (3U, ~4.6 kg) carrying SENSE (AIS) and an ADS-B receiver; 100+ satellites at 400–600 km',
    needs: ['listens-radio', 'wide-field', 'modest-downlink'],
    payloadFit: {
      'sdr-receiver': 'ideal',
      'gnss-ro': 'partial',
      'thermal-ir': 'no',
      'vis-multispectral': 'no',
      hyperspectral: 'no',
      'particle-telescope': 'no',
      'ka-radar': 'no',
    },
    sources: ['eo-spire'],
  },
  {
    id: 'weather',
    codename: 'SOUNDER',
    name: { e: 'Weather & Atmosphere', x: 'Measure the Air and Storms' },
    tagline: {
      e: 'Profile temperature and humidity through the atmosphere, or see inside a raincloud.',
      x: 'Find out how warm and wet the air is all the way up — and peek inside storms.',
    },
    brief: {
      e: 'GNSS radio occultation watches a GPS signal bend as it grazes the atmosphere; the bending angle gives a vertical profile of density, temperature and water vapour. A miniaturised Ka-band radar can instead look straight down inside precipitation. Both are flying today on CubeSats.',
      x: 'Radio signals bend when they pass through air, and they bend more through thick or wet air. By measuring the bending, a satellite can work out the weather high above the clouds.',
    },
    realAnalog: 'Spire STRATOS GNSS-RO receivers; NASA JPL RainCube — a 6U CubeSat that flew a working Ka-band precipitation radar with a deployable mesh antenna',
    needs: ['profiles-atmosphere', 'precise-timing', 'modest-downlink'],
    payloadFit: {
      'gnss-ro': 'ideal',
      'ka-radar': 'ideal',
      hyperspectral: 'no',
      'sdr-receiver': 'partial',
      'thermal-ir': 'no',
      'vis-multispectral': 'no',
      'particle-telescope': 'no',
    },
    sources: ['eo-spire', 'jpl-raincube'],
  },
  {
    id: 'spaceweather',
    codename: 'AURORA',
    name: { e: 'Space Weather Sentinel', x: 'Watch the Sun Attack' },
    tagline: {
      e: 'Measure solar energetic particles, radiation-belt electrons, or solar soft X-ray flares.',
      x: 'Count the tiny bits of the Sun that come flying at Earth.',
    },
    brief: {
      e: 'The Sun throws high-energy protons and electrons at Earth, and flares brighten sharply in soft X-rays. A small particle telescope or X-ray spectrometer measures those directly from orbit. Two university CubeSats — CSSWE and MinXSS — did this and published real peer-reviewed science.',
      x: 'The Sun sometimes throws storms of tiny particles at Earth. They can break satellites and make the northern lights. A small detector can count them as they arrive.',
    },
    realAnalog: 'CSSWE (3U, CU Boulder) with the REPTile particle telescope; MinXSS-1 (3U) soft X-ray spectrometer, flown 2016–2017',
    needs: ['detects-particles', 'radiation-hard', 'modest-downlink'],
    payloadFit: {
      'particle-telescope': 'ideal',
      'gnss-ro': 'partial',
      'sdr-receiver': 'no',
      'thermal-ir': 'no',
      'vis-multispectral': 'no',
      hyperspectral: 'no',
      'ka-radar': 'no',
    },
    sources: ['eo-csswe', 'eo-minxss'],
  },
  {
    id: 'landcover',
    codename: 'VERDANT',
    name: { e: 'Farm & Forest Health', x: 'Check on Plants From Space' },
    tagline: {
      e: 'Image crops and forests in visible and near-infrared to measure plant health.',
      x: 'Take special photos that show which plants are healthy and which are thirsty.',
    },
    brief: {
      e: 'Healthy chlorophyll absorbs red light and reflects near-infrared hard. Comparing those two bands (the basis of NDVI) turns an ordinary-looking image into a map of plant stress. Planet flies ~3–5 m resolution multispectral imagers on 3U Doves in sun-synchronous orbit to do this daily.',
      x: 'Healthy leaves bounce back a colour our eyes cannot see. If a satellite camera can see that colour, it can tell healthy plants from sick ones — from hundreds of kilometres up.',
    },
    realAnalog: 'Planet Dove / SuperDove — 3U CubeSats, ~3–5 m resolution, operating around 475–525 km sun-synchronous orbit',
    needs: ['sees-colour', 'consistent-lighting', 'high-downlink', 'stable-pointing'],
    payloadFit: {
      'vis-multispectral': 'ideal',
      hyperspectral: 'ideal',
      'thermal-ir': 'partial',
      'sdr-receiver': 'no',
      'gnss-ro': 'no',
      'particle-telescope': 'no',
      'ka-radar': 'no',
    },
    sources: ['eo-planet'],
  },
]

export const getMission = (id) => MISSIONS.find((m) => m.id === id)
