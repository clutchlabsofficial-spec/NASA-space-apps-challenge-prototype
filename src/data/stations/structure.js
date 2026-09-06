export const structure = {
  id: 'structure',
  order: 3,
  code: 'STR',
  name: { e: 'Structure & Mechanisms', x: 'The Frame' },
  subtitle: { e: 'The chassis everything else bolts to', x: 'The skeleton that holds it all together' },
  question: { e: 'What form factor and frame will you build?', x: 'How big will your satellite be?' },
  primer: {
    e: 'A CubeSat’s structure has three jobs: survive launch, define the interface with the deployer, and give every other subsystem somewhere to mount. The unit — 1U — is a 10 cm cube, and sizes stack from there. The rails along the corners are the only part that touches the deployer, so they are machined to tight tolerance and hard-anodised so aluminium does not cold-weld to aluminium in vacuum.',
    x: 'The frame is the skeleton. It has to survive the rocket ride, which shakes harder than anything on Earth, and it has to fit exactly inside the launcher tube. One "U" is a 10 cm cube — about the size of a large apple — and you can stack them.',
  },
  realTalk: {
    e: 'NASA’s CubeSat Launch Initiative requires CubeSats to survive a GEVS random-vibration environment of approximately 10 Grms over a two-minute period. That test, not orbit, is what breaks most first-time hardware.',
    x: 'Before it flies, your satellite gets strapped to a shaker table and rattled hard for two minutes. That is the test that breaks most first satellites — not space itself.',
  },
  sources: ['cds', 'soa-struct', 'cubesat101'],
  options: [
    {
      id: '1u',
      level: 'both',
      name: { e: '1U — a single 10 cm cube', x: '1U — one little cube' },
      blurb: { e: 'The original unit. Minimum viable spacecraft.', x: 'The smallest kind — about the size of a big apple.' },
      how: {
        e: 'A skeletonised aluminium frame with four corner rails and internal mounting features. Boards usually stack on the PC/104 pattern with standoffs, so the electronics themselves become part of the structural load path.',
        x: 'A little metal cage with four rails at the corners. The circuit boards stack up inside like a sandwich, held apart by little posts.',
      },
      madeOf: {
        e: 'Machined aluminium 6061-T6 or 7075. The rails are hard-anodised: bare aluminium sliding on bare aluminium in vacuum can cold-weld, which would jam you in the deployer.',
        x: 'Made from aluminium, with a special hard coating on the rails so it does not stick inside the launcher tube.',
      },
      whyChosen: {
        e: 'Cheapest to build, cheapest to launch, and small enough that a school team can actually finish it. If your payload is a particle detector or a radio, 1U is genuinely enough.',
        x: 'Cheap, quick to build, and a small team can actually finish one. If your job is listening or counting, this is plenty big.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Lowest cost and shortest build schedule.', x: 'Cheapest and fastest to build.' },
          { e: 'Widest choice of rideshare slots.', x: 'Easiest to find a rocket for.' },
        ],
        limits: [
          { e: 'Very little internal volume once the bus is installed — often under half a unit for payload.', x: 'Almost no room left inside once you add the batteries and computer.' },
          { e: 'Small surface area caps body-mounted solar power hard.', x: 'Not much room for solar panels.' },
          { e: 'No space for optics with a meaningful focal length.', x: 'Not enough room for a good telescope.' },
        ],
      },
      facts: [
        { label: 'Dimensions', value: '100 × 100 × 113.5 mm (NASA SoA)' },
        { label: 'Standard', value: 'Cal Poly CubeSat Design Specification Rev. 14.1' },
      ],
      flown: 'Hundreds of university 1U missions since 2003',
      sources: ['soa-struct', 'cds'],
      tags: ['struct:1u', 'struct:tiny', 'struct:low-area'],
    },
    {
      id: '3u',
      level: 'both',
      name: { e: '3U — three units in a row', x: '3U — three cubes in a line' },
      blurb: { e: 'The most-flown CubeSat size. A loaf of bread with solar panels.', x: 'About the size of a loaf of bread. The most common size.' },
      how: {
        e: 'The same rail architecture stretched to 340.5 mm. The extra length lets you put the payload at one end and the bus at the other, which physically separates a sensitive instrument from noisy power electronics and gives you a longer optical path.',
        x: 'Same idea as 1U, just three times as long. That means you can put the job-tool at one end and all the boring bits at the other, so they do not get in each other’s way.',
      },
      madeOf: {
        e: 'Aluminium 6061 or 7075 frame; increasingly with carbon-fibre or additively manufactured secondary structure to save mass.',
        x: 'Aluminium, sometimes with lightweight carbon fibre parts.',
      },
      whyChosen: {
        e: 'It is the sweet spot: enough volume and surface area for a real instrument, deployable panels and a proper ADCS, while still being a cheap, standard rideshare. Planet, Spire and most commercial CubeSat operators standardised on it.',
        x: 'It is the "just right" size — big enough to do a real job, small enough to stay cheap. Most real satellite companies use this size.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Enough room for a real payload plus a full bus.', x: 'Room for a proper tool and everything it needs.' },
          { e: 'Long axis gives a useful focal length for optics and a gravity-gradient-friendly shape.', x: 'Being long helps cameras focus and helps it hang steady.' },
          { e: 'By far the best-supported size for off-the-shelf parts.', x: 'You can buy ready-made parts for this size.' },
        ],
        limits: [
          { e: 'Still tight for anything needing a deployable dish or a cryocooler.', x: 'Still too small for a folding dish or a fridge.' },
          { e: 'Body-mounted solar alone will not power a demanding payload.', x: 'Needs fold-out solar panels for hungry tools.' },
        ],
      },
      facts: [
        { label: 'Dimensions', value: '100 × 100 × 340.5 mm (NASA SoA)' },
        { label: 'Real example', value: 'Planet Dove: 3U, ~5.2 kg launch mass; Spire Lemur-2: 3U, ~4.6 kg' },
      ],
      flown: 'Planet Dove, Spire Lemur-2, CSSWE, MinXSS, FOREST-1',
      sources: ['soa-struct', 'eo-planet', 'eo-spire'],
      tags: ['struct:3u', 'struct:medium', 'struct:long-axis'],
    },
    {
      id: '6u',
      level: 'both',
      name: { e: '6U — two rows of three', x: '6U — six cubes, like a shoebox' },
      blurb: { e: 'The size where deployable dishes, cryocoolers and propulsion start to fit.', x: 'A shoebox-sized satellite that can carry big equipment.' },
      how: {
        e: 'A wider, flatter box, usually with a large flat face that suits a folding solar wing or a deployable antenna. The wider cross-section also gives you somewhere to put a radiator that is not competing with solar cells.',
        x: 'A wider, flatter box. The big flat side is perfect for folding out large solar wings or an antenna dish.',
      },
      madeOf: {
        e: 'Machined aluminium, frequently combined with composite panels; multifunctional structures that double as thermal paths are commercially available in 6U (for example Thermal Management Technologies’ SPOT structures).',
        x: 'Aluminium plus lightweight panels. Some frames are cleverly built to also carry heat away from hot parts.',
      },
      whyChosen: {
        e: 'Chosen when the instrument demands it: RainCube needed 6U for its deployable radar antenna, Lunar IceCube needed it for a cryocooled spectrometer, BioSentinel needed it for biology hardware. MarCO flew 6U to Mars.',
        x: 'You go to this size when your tool simply will not fit in anything smaller — like a folding dish or a fridge.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Fits deployable antennas, cryocoolers, and real propulsion.', x: 'Room for dishes, fridges and rocket engines.' },
          { e: 'More surface area for both power generation and heat rejection.', x: 'More room for solar panels and for getting rid of heat.' },
        ],
        limits: [
          { e: 'Materially more expensive to build and to launch.', x: 'Costs a lot more.' },
          { e: 'Fewer rideshare slots than 3U; more scheduling risk.', x: 'Harder to find a ride.' },
          { e: 'A bigger structure means more mass to point, so ADCS actuators grow too.', x: 'Heavier, so it needs stronger equipment to turn it.' },
        ],
      },
      facts: [
        { label: 'Dimensions', value: '100 × 226.3 × 366 mm (NASA SoA)' },
        { label: 'Real missions', value: 'RainCube, MarCO, BioSentinel, Lunar IceCube, TechEdSat-10' },
      ],
      flown: 'MarCO-A and MarCO-B relayed InSight’s Mars landing telemetry in 2018',
      sources: ['soa-struct', 'nasa-marco', 'jpl-raincube'],
      tags: ['struct:6u', 'struct:large', 'struct:high-area'],
    },
    {
      id: '12u',
      level: 'engineer',
      name: { e: '12U — the top of the CubeSat class', x: '12U — the biggest cube-satellite' },
      blurb: { e: 'Where CubeSats stop being small and start being small spacecraft.', x: 'A big one — nearly a microwave oven.' },
      how: {
        e: 'A 226.3 mm square cross-section, 366 mm long. At this scale the PC/104 board stack stops being the organising principle and the design starts to look like a conventional spacecraft with panels, harness runs and dedicated equipment decks.',
        x: 'Big enough that it stops being built like a stack of circuit boards and starts being built like a proper spaceship, with separate rooms for different parts.',
      },
      madeOf: {
        e: 'Machined aluminium primary structure with composite or honeycomb panels; conventional aerospace practice at reduced scale.',
        x: 'Aluminium frame with light stiff panels, built like a real spacecraft.',
      },
      whyChosen: {
        e: 'Chosen for missions that genuinely need power and propellant: CAPSTONE was a 12U, roughly 25 kg CubeSat that flew to a lunar near-rectilinear halo orbit using pump-fed hydrazine.',
        x: 'You need this size for missions that go really far, like to the Moon, because you need lots of fuel and power.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Enough power and propellant volume for interplanetary or cislunar missions.', x: 'Can carry enough fuel to leave Earth orbit.' },
          { e: 'Room for redundant systems.', x: 'Room for spare parts in case something breaks.' },
        ],
        limits: [
          { e: 'Cost approaches that of a small conventional satellite, eroding the CubeSat cost argument.', x: 'So expensive it stops being a cheap satellite.' },
          { e: 'Limited deployer availability.', x: 'Very few rockets can launch it.' },
        ],
      },
      facts: [
        { label: 'Dimensions', value: '226.3 × 226.3 × 366 mm (NASA SoA)' },
        { label: 'Real mission', value: 'CAPSTONE: 12U, 25 kg, pump-fed hydrazine, launched June 2022 on Rocket Lab Electron' },
      ],
      flown: 'CAPSTONE (lunar)',
      sources: ['soa-struct', 'soa-prop'],
      tags: ['struct:12u', 'struct:large', 'struct:high-area'],
    },
  ],
}
