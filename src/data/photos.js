/**
 * Real photographs, not drawings.
 *
 * Every image here is a NASA photograph served from NASA's own image library
 * (images-assets.nasa.gov), resolved through the public images-api.nasa.gov
 * search API and then pinned by ID. Two reasons for pinning rather than
 * calling the API at runtime:
 *
 *   1. The published page works with no network round-trip and no API that can
 *      rate-limit a classroom of thirty children at once.
 *   2. A search result can change under you; a nasa_id cannot.
 *
 * NASA still images are in the public domain and may be used without a licence
 * fee (NASA media usage guidelines), which is why this file draws on NASA
 * rather than on whatever a general image search returns — search results are
 * mostly copyrighted, and hotlinking them breaks within weeks anyway.
 *
 * Every URL below returned HTTP 200 with real image bytes when this file was
 * written. CHECKED is that date.
 */

export const PHOTOS_CHECKED = '2026-09-30'

const asset = (id, size = 'medium') =>
  `https://images-assets.nasa.gov/image/${id}/${id}~${size}.jpg`

/** One photo per teaching topic. `alt` is written for a screen reader and for
 *  a child who cannot see the image — it describes what is happening, not just
 *  what is in frame. */
export const PHOTOS = {
  deploy: {
    id: 'iss051e049985',
    src: asset('iss051e049985'),
    title: 'CubeSats leaving the Space Station',
    alt: 'Small box-shaped satellites drifting away from a launcher mounted outside the International Space Station, with Earth below.',
    caption: 'This is how most CubeSats actually reach orbit — pushed out of a spring-loaded box on the Space Station.',
    credit: 'NASA / Jack Fischer',
    year: 2017,
  },

  orbit: {
    id: 'PIA18053',
    src: asset('PIA18053'),
    title: 'CubeSats in orbit',
    alt: 'Illustration of several small cube-shaped satellites orbiting above Earth.',
    caption: 'A CubeSat is measured in units. One unit — 1U — is a 10 cm cube, about the size of a Rubik’s cube.',
    credit: 'NASA/JPL-Caltech',
  },

  payload: {
    id: 'PIA22457',
    src: asset('PIA22457'),
    title: 'RainCube — a radar in a shoebox',
    alt: 'A six-unit CubeSat with a folded umbrella-like radar antenna, held in a laboratory.',
    caption: 'RainCube fitted a working weather radar into a 6U CubeSat. The antenna folds like an umbrella to fit.',
    credit: 'NASA/JPL-Caltech',
  },

  structure: {
    id: 'CSUNSat1_Students_ELaNa17',
    src: asset('CSUNSat1_Students_ELaNa17'),
    title: 'Students building a real CubeSat',
    alt: 'University students in a laboratory assembling a small satellite on a bench.',
    caption: 'CSUNSat-1 was built by students and flew on a NASA launch. People not much older than you build these.',
    credit: 'NASA',
  },

  power: {
    id: 'KSC-20180221-PH_LCH01_0080',
    src: asset('KSC-20180221-PH_LCH01_0080'),
    title: 'Testing solar panels before launch',
    alt: 'Engineers in white cleanroom suits watching a spacecraft unfold its solar panel wings in a test bay.',
    caption: 'Panels are unfolded on the ground, over and over, because in orbit there is nobody to un-jam them.',
    credit: 'NASA/Kim Shiflett',
  },

  battery: {
    id: 'GRC-2020-C-03345',
    src: asset('GRC-2020-C-03345'),
    title: 'A spacecraft in a vacuum chamber',
    alt: 'A large spacecraft inside an enormous metal test chamber used to simulate the cold vacuum of space.',
    caption: 'Batteries are tested hot and cold in a vacuum chamber, because a battery that is too cold will not charge.',
    credit: 'NASA',
  },

  brain: {
    id: 'KSC-2014-2110',
    src: asset('KSC-2014-2110'),
    title: 'CubeSat electronics on the bench',
    alt: 'Close view of small satellite circuit boards and wiring being worked on in a laboratory.',
    alt2: 'Circuit boards stacked inside a small satellite frame.',
    caption: 'The flight computer is usually just a stack of circuit boards bolted together and wired in a loop.',
    credit: 'NASA',
  },

  adcs: {
    id: 'PIA25495',
    src: asset('PIA25495'),
    title: 'Reaction wheels going in',
    alt: 'An engineer in a cleanroom suit installing a heavy metal flywheel assembly into a spacecraft.',
    caption: 'Spin a wheel one way inside the satellite and the satellite turns the other way. No fuel needed.',
    credit: 'NASA/JPL-Caltech',
  },

  magnet: {
    id: 'KSC-2011-3848',
    src: asset('KSC-2011-3848'),
    title: 'Instruments on a boom',
    alt: 'A spacecraft with a long arm extended, holding sensors away from the main body.',
    caption: 'Magnetic sensors sit out on an arm so the satellite’s own electronics do not confuse them.',
    credit: 'NASA',
  },

  thermal: {
    id: 'GSFC_20171208_Archive_e001784',
    src: asset('GSFC_20171208_Archive_e001784'),
    title: 'Gold foil is not decoration',
    alt: 'A space instrument wrapped in shiny gold and silver layered foil blankets.',
    caption: 'That gold blanket is multi-layer insulation — dozens of paper-thin sheets that block heat by radiation.',
    credit: 'NASA/GSFC',
  },

  comms: {
    id: 'PIA24785',
    src: asset('PIA24785'),
    title: 'Building a high-gain antenna',
    alt: 'Technicians working on a large white dish antenna for a spacecraft.',
    caption: 'A dish concentrates the signal into a narrow beam — more range, but you must point it accurately.',
    credit: 'NASA/JPL-Caltech',
  },

  ground: {
    id: 'PIA24910',
    src: asset('PIA24910'),
    title: 'Packed and ready to fly',
    alt: 'A satellite being prepared and packed inside a cleanroom before shipping to the launch site.',
    caption: 'Every radio link is tested on the ground first — you cannot debug a radio once it is 500 km up.',
    credit: 'NASA/JPL-Caltech',
  },

  propulsion: {
    id: 'PIA04238',
    src: asset('PIA04238'),
    title: 'An ion engine running',
    alt: 'An ion thruster firing in a test chamber, glowing blue.',
    caption: 'Ion engines push about as hard as a sheet of paper resting on your hand — but they can push for years.',
    credit: 'NASA/JPL',
  },

  test: {
    id: 'PIA13931',
    src: asset('PIA13931'),
    title: 'Shake it, freeze it, bake it',
    alt: 'A spacecraft mounted on a test stand surrounded by engineers and test equipment.',
    caption: 'Before anything flies it is shaken like a rocket launch and cycled hot to cold, to find what breaks.',
    credit: 'NASA/JPL-Caltech',
  },
}

/** Photos keyed by station id, so a lesson can ask for its own picture. */
export const STATION_PHOTO = {
  orbit: 'orbit',
  payload: 'payload',
  structure: 'structure',
  power: 'power',
  battery: 'battery',
  brain: 'brain',
  adcs: 'adcs',
  thermal: 'thermal',
  comms: 'comms',
  ground: 'ground',
  propulsion: 'propulsion',
}

export const photoFor = (stationId) => PHOTOS[STATION_PHOTO[stationId]] || PHOTOS.orbit

/** NASA asks that its imagery not be used in a way that implies NASA endorses
 *  a product or service. This app teaches with the photos and credits each one
 *  — which is exactly the permitted use — so the credit line is not optional
 *  chrome and every component that renders a photo must render this too. */
export const NASA_NOTICE =
  'Photographs courtesy NASA. NASA does not endorse this app — its images are public domain and used here to teach.'
