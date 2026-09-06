// Every factual claim in this app traces back to one of these.
// Kept in one place so the source chips in the UI and the References
// screen can never drift apart.

export const SOURCES = {
  'soa-gnc': {
    short: 'NASA SoA — GNC',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 5: Guidance, Navigation & Control',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/',
    org: 'NASA Ames / Small Spacecraft Systems Virtual Institute',
  },
  'soa-power': {
    short: 'NASA SoA — Power',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 3: Power',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/power/',
    org: 'NASA Ames / S3VI',
  },
  'soa-prop': {
    short: 'NASA SoA — Propulsion',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 4: In-Space Propulsion',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/in-space-propulsion/',
    org: 'NASA Ames / S3VI',
  },
  'soa-struct': {
    short: 'NASA SoA — Structures',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 6: Structures, Materials & Mechanisms',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/structures-materials-and-mechanisms/',
    org: 'NASA Ames / S3VI',
  },
  'soa-thermal': {
    short: 'NASA SoA — Thermal',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 7: Thermal Control',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/thermal-control/',
    org: 'NASA Ames / S3VI',
  },
  'soa-avionics': {
    short: 'NASA SoA — Avionics',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 8: Small Spacecraft Avionics (C&DH)',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/small-spacecraft-avionics/',
    org: 'NASA Ames / S3VI',
  },
  'soa-comms': {
    short: 'NASA SoA — Comms',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 9: Communications',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/communications/',
    org: 'NASA Ames / S3VI',
  },
  'soa-deorbit': {
    short: 'NASA SoA — Deorbit',
    title: 'NASA State-of-the-Art of Small Spacecraft Technology, Ch. 13: Deorbit Systems',
    url: 'https://www.nasa.gov/smallsat-institute/sst-soa/deorbit-systems/',
    org: 'NASA Ames / S3VI',
  },
  'cubesat101': {
    short: 'NASA CubeSat 101',
    title: 'CubeSat 101: Basic Concepts and Processes for First-Time CubeSat Developers',
    url: 'https://www.nasa.gov/wp-content/uploads/2017/03/nasa_csli_cubesat_101_508.pdf',
    org: 'NASA CubeSat Launch Initiative',
  },
  'cds': {
    short: 'Cal Poly CDS Rev 14.1',
    title: 'CubeSat Design Specification Rev. 14.1',
    url: 'https://static1.squarespace.com/static/5418c831e4b0fa4ecac1bacd/t/62193b7fc9e72e0053f00910/1645820809779/CDS+REV14_1+2022-02-09.pdf',
    org: 'The CubeSat Program, Cal Poly SLO',
  },
  'fcc-5yr': {
    short: 'FCC 5-year rule',
    title: 'FCC Second Report and Order: Mitigation of Orbital Debris in the New Space Age (5-year deorbit rule, Sept 2022)',
    url: 'https://www.fcc.gov/document/fcc-adopts-new-5-year-rule-deorbiting-satellites-0',
    org: 'U.S. Federal Communications Commission',
  },
  'eo-ororatech': {
    short: 'eoPortal — FOREST',
    title: 'FOREST Satellite Series (OroraTech) — thermal-infrared wildfire CubeSats',
    url: 'https://www.eoportal.org/satellite-missions/forest',
    org: 'ESA eoPortal',
  },
  'eo-planet': {
    short: 'eoPortal — Planet',
    title: 'Planet Flock / Dove imaging constellation',
    url: 'https://www.eoportal.org/satellite-missions/planet',
    org: 'ESA eoPortal',
  },
  'eo-spire': {
    short: 'eoPortal — Lemur-2',
    title: 'LEMUR-2 (Spire Global): AIS, ADS-B and GNSS radio occultation from 3U CubeSats',
    url: 'https://www.eoportal.org/satellite-missions/spire-global',
    org: 'ESA eoPortal',
  },
  'eo-csswe': {
    short: 'eoPortal — CSSWE',
    title: 'CSSWE (Colorado Student Space Weather Experiment) and the REPTile particle telescope',
    url: 'https://www.eoportal.org/satellite-missions/csswe',
    org: 'ESA eoPortal',
  },
  'eo-minxss': {
    short: 'eoPortal — MinXSS',
    title: 'MinXSS (Miniature X-ray Solar Spectrometer) 3U CubeSat',
    url: 'https://www.eoportal.org/satellite-missions/minxss',
    org: 'ESA eoPortal',
  },
  'jpl-raincube': {
    short: 'NASA — RainCube',
    title: 'RainCube: a 6U CubeSat carrying a Ka-band precipitation radar',
    url: 'https://www.jpl.nasa.gov/missions/radar-in-a-cubesat-raincube/',
    org: 'NASA JPL',
  },
  'nasa-marco': {
    short: 'NASA — MarCO',
    title: 'MarCO: the first CubeSats to fly to another planet (cold-gas propulsion, X-band reflectarray)',
    url: 'https://www.jpl.nasa.gov/missions/mars-cube-one-marco/',
    org: 'NASA JPL',
  },
  'nasa-tbird': {
    short: 'NASA — TBIRD',
    title: 'TBIRD: 200 Gbps optical downlink demonstration from a CubeSat',
    url: 'https://www.nasa.gov/technology/space-comms/nasa-laser-communications-relay-tbird/',
    org: 'NASA / MIT Lincoln Laboratory',
  },
  'nasa-cfs': {
    short: 'NASA cFS',
    title: 'core Flight System (cFS) — reusable flight software framework',
    url: 'https://cfs.gsfc.nasa.gov/',
    org: 'NASA Goddard',
  },
}

export const sourceList = Object.entries(SOURCES).map(([id, s]) => ({ id, ...s }))
