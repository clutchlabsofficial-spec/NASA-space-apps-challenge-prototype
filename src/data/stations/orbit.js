export const orbit = {
  id: 'orbit',
  multi: false,
  order: 1,
  code: 'ORB',
  name: { e: 'Orbit & Mission Design', x: 'Where Will It Fly?' },
  subtitle: { e: 'The path your satellite takes around Earth', x: 'Your satellite’s racetrack in the sky' },
  question: { e: 'What orbit will you fly?', x: 'Where should your satellite fly?' },
  primer: {
    e: 'Orbit is chosen before almost anything else, because it sets the rules every other subsystem has to obey. Altitude sets how much of Earth you see at once, how strong the atmospheric drag is, and how long you survive without propulsion. Inclination — the tilt of the orbit against the equator — sets which parts of Earth you ever fly over at all. Low Earth orbit means roughly a 90-minute lap, so you get an orbital sunrise and sunset about sixteen times a day.',
    x: 'Before you build anything, you pick where your satellite will fly. Fly low and you see small things clearly, but the tiny bit of air up there slows you down and you fall sooner. Fly high and you last longer but see less detail. Whether you tilt your path over the poles decides which countries you fly above.',
  },
  realTalk: {
    e: 'Most university CubeSats do not choose their orbit at all — they ride along with whatever launch has a spare slot, and the mission is designed around that orbit afterwards.',
    x: 'Fun fact: most school satellites do not get to choose! They hitch a ride with a bigger rocket and go wherever it is going.',
  },
  sources: ['soa-deorbit', 'cubesat101'],
  options: [
    {
      id: 'iss',
      level: 'both',
      name: { e: 'ISS resupply orbit (~400 km, 51.6°)', x: 'Space Station orbit — low and tilted' },
      blurb: {
        e: 'Deployed from the International Space Station. The easiest ride to get, and the shortest life.',
        x: 'Get pushed out of the Space Station by an astronaut-loaded launcher.',
      },
      how: {
        e: 'Your CubeSat launches to the ISS inside a cargo vehicle, is unpacked by the crew, loaded into a deployer on the Japanese module’s airlock, and sprung out by a robotic arm. You inherit the station’s orbit exactly: about 400 km altitude and 51.6° inclination.',
        x: 'Your satellite rides up to the Space Station in a delivery ship. Astronauts unpack it, put it in a spring-loaded launcher, and a robot arm pushes it gently out into space.',
      },
      whyChosen: {
        e: 'It is the most accessible path for student and first-flight missions, and the low altitude means you deorbit naturally within a couple of years with no hardware at all — automatic debris compliance. NASA’s CubeSat Launch Initiative has flown many ELaNa missions this way.',
        x: 'It is the friendliest way to get to space for a first satellite. And because it is so low, the air slowly pulls it back down on its own, so it never becomes space junk.',
      },
      madeOf: {
        e: 'No hardware of your own — the deployer (a NanoRacks or JEM-style spring-loaded tube) belongs to the launch provider. You just have to survive the ride and meet its interface rules.',
        x: 'You do not build anything for this — you just have to fit inside the launcher tube.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Cheapest and most available ride for a first mission.', x: 'Easiest ride to get.' },
          { e: 'Natural decay well inside the 5-year disposal rule with no deorbit hardware.', x: 'Comes down by itself — no space junk.' },
          { e: 'Low altitude means finer ground detail for a given camera.', x: 'You are closer, so you see more detail.' },
        ],
        limits: [
          { e: '51.6° inclination never flies over the poles — no high-latitude coverage at all.', x: 'You never fly over the very top or bottom of Earth.' },
          { e: 'Lighting at a given spot changes every pass, so images are hard to compare over time.', x: 'The sunlight is different every time, so photos do not match each other.' },
          { e: 'Mission life is typically only about 1–2 years before drag pulls you down.', x: 'Your satellite only lasts a year or two.' },
        ],
      },
      facts: [
        { label: 'Altitude', value: '~400 km' },
        { label: 'Inclination', value: '51.6°' },
        { label: 'Natural decay', value: 'NASA SoA: below 400 km, most small satellites decay naturally within 5 years' },
      ],
      flown: 'Dozens of NASA ELaNa CubeSats deployed from the ISS via the JEM airlock',
      sources: ['cubesat101', 'soa-deorbit'],
      tags: ['orbit:iss', 'orbit:low', 'orbit:inclined', 'orbit:short-life', 'orbit:no-poles', 'orbit:variable-lighting'],
    },
    {
      id: 'sso',
      level: 'both',
      name: { e: 'Sun-synchronous orbit (~500–600 km, ~97.7°)', x: 'Sun-following orbit — over the poles' },
      blurb: {
        e: 'Crosses every point on Earth at the same local solar time. The workhorse orbit for Earth observation.',
        x: 'Flies over the North and South poles, and always arrives at the same time of day.',
      },
      how: {
        e: 'Earth is slightly fat around the equator, which tugs on an orbit and slowly rotates its plane. At a specific retrograde inclination near 98°, that drift is exactly one full turn per year — so the orbit plane keeps pace with Earth going round the Sun. The result: you cross the equator at, say, 10:30 am local time on every single orbit, forever.',
        x: 'Earth is a bit squashed, and that gently pushes satellite paths around. If you tilt your orbit just right, that push keeps your satellite lined up with the Sun — so you always arrive at the same time of day, like a very punctual bus.',
      },
      whyChosen: {
        e: 'Consistent lighting is enormously valuable: two images of the same field taken a month apart have the same sun angle and shadows, so a real change in the ground is not confused with a change in the light. Polar coverage also means the whole planet passes underneath you as Earth rotates.',
        x: 'Because the light is always the same, you can compare photos taken weeks apart and be sure any difference is real, not just different shadows.',
      },
      madeOf: {
        e: 'Again, no hardware — it is a launch-vehicle choice. SSO is a very common rideshare destination, so it is realistically obtainable.',
        x: 'Nothing to build — you just book the right rocket.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Repeatable sun angle makes time-series comparison scientifically valid.', x: 'Photos always match, so you can spot real changes.' },
          { e: 'Near-polar inclination gives global coverage including high latitudes.', x: 'You fly over the whole planet, poles included.' },
          { e: 'Long eclipse-free stretches on some SSO planes ease the power budget.', x: 'Lots of sunshine for your solar panels.' },
        ],
        limits: [
          { e: 'At 500–600 km, natural decay usually exceeds 5 years, so a disposal plan is required.', x: 'Too high to fall down on its own — you must plan how to bring it back.' },
          { e: 'A fixed local crossing time means you never observe the same place at other times of day.', x: 'You only ever see each place at one time of day.' },
          { e: 'Higher altitude means coarser detail than a very low orbit for the same optics.', x: 'A bit further away, so slightly less detail.' },
        ],
      },
      facts: [
        { label: 'Typical altitude', value: '475–600 km (Planet operates Doves at 475–525 km)' },
        { label: 'Inclination', value: '~97–98° (retrograde)' },
        { label: 'Disposal', value: 'NASA SoA: 400–800 km generally needs a passive deorbit system to meet 5 years' },
      ],
      flown: 'Planet Dove / SuperDove constellation; most commercial Earth-observation CubeSats',
      sources: ['eo-planet', 'soa-deorbit'],
      tags: ['orbit:sso', 'orbit:polar', 'orbit:consistent-lighting', 'orbit:needs-disposal', 'orbit:medium'],
    },
    {
      id: 'vleo',
      level: 'engineer',
      name: { e: 'Very low Earth orbit (~300 km)', x: 'Super-low orbit — fast and close' },
      blurb: {
        e: 'Skim the top of the atmosphere for maximum resolution and minimum signal loss. Short, aggressive missions only.',
        x: 'Fly really low to see really well — but not for long.',
      },
      how: {
        e: 'At 300 km there is still a thin but real atmosphere. Drag is orders of magnitude stronger than at 600 km and varies with solar activity, so your altitude visibly decays week by week unless you thrust to maintain it.',
        x: 'Even way up at 300 km there is a tiny bit of air. It is enough to slow you down a little every orbit, so you sink lower and lower.',
      },
      whyChosen: {
        e: 'Ground resolution scales with distance, and radio link budget improves as the square of range, so flying low buys you sharper images and stronger signals from smaller hardware. It also guarantees rapid, automatic disposal.',
        x: 'Being closer means sharper pictures and a stronger radio signal with a smaller antenna.',
      },
      madeOf: {
        e: 'Usually a compact, drag-minimising shape, sometimes with atomic-oxygen-resistant coatings, since atomic oxygen at these altitudes erodes exposed polymers and some coatings.',
        x: 'Satellites down here are built slim, and painted with tough coatings, because the thin air slowly wears them away.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Best ground sampling distance and link budget of any option here.', x: 'Sharpest pictures, strongest radio.' },
          { e: 'Disposal is automatic and fast — fully compliant with no hardware.', x: 'Comes down by itself, quickly.' },
        ],
        limits: [
          { e: 'Mission life measured in months without propulsion.', x: 'Only lasts a few months.' },
          { e: 'Atomic oxygen erodes exposed materials; coatings darken faster.', x: 'The thin air slowly eats away at surfaces.' },
          { e: 'Drag torque disturbs attitude, making pointing harder.', x: 'The air pushes it around, so it is harder to hold steady.' },
        ],
      },
      facts: [
        { label: 'Altitude', value: '~300 km' },
        { label: 'Life without propulsion', value: 'Months' },
        { label: 'Solar cycle', value: 'NASA SoA: drag increases at solar maximum, so decay is faster' },
      ],
      flown: 'NASA TechEdSat Exo-Brake experiments operated in this regime (TES-7 reentered from 485–513 km in ~1.3 years)',
      sources: ['soa-deorbit'],
      tags: ['orbit:vleo', 'orbit:low', 'orbit:short-life', 'orbit:high-drag', 'orbit:inclined'],
    },
  ],
}
