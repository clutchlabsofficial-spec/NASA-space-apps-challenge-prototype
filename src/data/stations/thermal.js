export const thermal = {
  id: 'thermal',
  multi: true,
  order: 8,
  code: 'TCS',
  name: { e: 'Thermal Control', x: 'Hot and Cold' },
  subtitle: { e: 'Managing heat where there is nothing to carry it away', x: 'Keeping it from cooking or freezing' },
  question: { e: 'How will you control temperature?', x: 'How will you keep your satellite comfortable?' },
  primer: {
    e: 'In vacuum there is no air, so two of the three ways heat moves are simply unavailable: no convection and no conduction to the outside. Radiation is the only path off the spacecraft. That means every watt your electronics consume has to be radiated away as infrared from a surface, and if there is not enough cold surface pointing at empty space, the temperature rises until there is. Then you pass into eclipse and the same physics works against you: you radiate to a 3 K sky and get very cold, very fast, because a CubeSat has almost no thermal mass to coast on.',
    x: 'On Earth, hot things cool down because air carries heat away. In space there is no air, so the only way to lose heat is to glow it away as invisible infrared light. If your satellite cannot glow enough heat away, it cooks. And in Earth’s shadow the opposite happens: it dumps heat into empty space and freezes — and because it is so small and light, it changes temperature really fast.',
  },
  realTalk: {
    e: 'NASA’s SoA is blunt about the small-satellite penalty: low thermal mass causes reactive transient behaviour, external surface area is contested by solar cells and instrument apertures, and multi-layer insulation "generally does not perform as well on small spacecraft than on larger spacecraft" because edge effects dominate at small sizes.',
    x: 'Small satellites have a harder time with heat than big ones. They warm up and cool down very quickly, and there is barely any spare outside wall left over once you have added solar panels and a camera hole.',
  },
  sources: ['soa-thermal'],
  options: [
    {
      id: 'passive-coatings',
      level: 'both',
      name: { e: 'Passive: surface coatings and paints', x: 'Special paint' },
      blurb: { e: 'Choose the optical properties of every outside surface and let physics do the rest.', x: 'Paint it the right colours and let it look after itself.' },
      how: {
        e: 'Every surface has two independent optical properties: solar absorptivity (how much sunlight it takes in) and infrared emissivity (how well it radiates heat away). Their ratio sets the equilibrium temperature. White paint has low absorptivity and high emissivity, so it stays cold in sunlight — that is why it makes a good radiator. Black paint absorbs and emits strongly. Polished metal does neither and is a good insulator. You tune the whole spacecraft by choosing which surface goes where.',
        x: 'Colours matter enormously in space. White paint takes in very little sunlight but is brilliant at glowing heat away, so white surfaces stay cold. Black takes in lots and gives out lots. Shiny metal does neither, so it acts like a blanket. Engineers plan every single surface.',
      },
      madeOf: {
        e: 'Space-qualified white and black paints, second-surface silvered FEP tape, aluminised Kapton, and optical solar reflectors. NASA SoA notes second-surface silver FEP tapes "offer excellent performance as radiator coatings".',
        x: 'Special space paints and shiny silver tapes made to survive sunlight without going yellow.',
      },
      whyChosen: {
        e: 'It costs almost nothing in mass, volume, power or complexity, and it never fails. Most small CubeSats fly entirely passive thermal control and are fine, because the electronics dissipate only a few watts.',
        x: 'It weighs nothing, costs nothing, uses no power and cannot break. Most small satellites do only this.',
      },
      tradeoffs: {
        strengths: [
          { e: 'No mass, no power, no failure modes.', x: 'Free, and it cannot break.' },
          { e: 'Well characterised and easy to model.', x: 'Easy to plan and predict.' },
        ],
        limits: [
          { e: 'Coatings degrade: NASA SoA notes darkening from atomic oxygen in LEO and UV higher up, so you must design to end-of-life properties, not beginning-of-life.', x: 'Space slowly darkens the paint, so it works less well as the years pass — you have to plan for that.' },
          { e: 'No ability to respond: you get one fixed thermal design for all mission phases.', x: 'It cannot adjust — it does the same thing hot or cold.' },
          { e: 'Cannot keep a battery above 0 °C through a long eclipse on its own.', x: 'It cannot stop the battery getting too cold in the dark.' },
        ],
      },
      facts: [
        { label: 'Radiator surfaces', value: 'Matte white paint: "low solar absorptivity and high IR emissivity"' },
        { label: 'Real use', value: 'BioSentinel (6U) "made extensive use of Sheldahl metallized tape coatings and second-surface silvered FEP tapes"' },
      ],
      flown: 'Nearly every CubeSat; BioSentinel is a well-documented example',
      sources: ['soa-thermal'],
      tags: ['tcs:passive', 'tcs:no-power', 'tcs:no-heater', 'tcs:reliable'],
    },
    {
      id: 'mli-straps',
      level: 'both',
      name: { e: 'Passive: insulation and conductive straps', x: 'Space blankets and heat highways' },
      blurb: { e: 'Insulate what must stay warm, and physically route heat from hot parts to cold surfaces.', x: 'Wrap the cold bits, and build metal paths to carry heat away from the hot bits.' },
      how: {
        e: 'Multi-layer insulation is not a thick blanket — it is many thin reflective layers separated by netting, so heat has to radiate across dozens of low-emissivity gaps in series. Thermal straps do the opposite job: a flexible high-conductivity link that carries heat from a component that is overheating to a radiator panel, without mechanically constraining either.',
        x: 'A space blanket is lots of very thin shiny sheets with tiny gaps between them — heat has to hop across every single layer, which is slow, so it stays trapped. A thermal strap is the opposite: a bendy metal rope that carries heat quickly away from something hot to somewhere cool.',
      },
      madeOf: {
        e: 'MLI from aluminised Kapton or Mylar with Dacron netting spacers. Straps from copper braid, aluminium foil stacks, or pyrolytic graphite sheet — NASA SoA notes PGS "demonstrate superior performance compared to metal foils".',
        x: 'Shiny plastic sheets for the blanket. For the heat pipes-and-ropes: copper, aluminium, or a special layered carbon material that carries heat even better.',
      },
      whyChosen: {
        e: 'Chosen when one part of the spacecraft has a different temperature requirement from the rest — a battery that must stay above freezing, or a detector that must stay cool while the radio next to it runs hot. Straps let you decouple them without redesigning the layout.',
        x: 'Used when one part needs to be warm and another needs to be cold. You wrap up the one that must stay warm, and run a metal rope from the hot one to a cold wall.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Still fully passive — no power, no control loop.', x: 'Uses no electricity.' },
          { e: 'Lets you give different components different temperatures.', x: 'Different parts can be different temperatures.' },
          { e: 'Graphite straps are very light for their conductivity.', x: 'The carbon ropes are very light.' },
        ],
        limits: [
          { e: 'NASA SoA warns MLI "generally does not perform as well on small spacecraft" — compression and edge heat leaks dominate at CubeSat scale.', x: 'Space blankets do not work as well on tiny satellites, because heat sneaks out around the edges.' },
          { e: 'Straps are a permanent thermal short: they help in the hot case and hurt in the cold case.', x: 'A heat rope always carries heat away — even when you would rather stay warm.' },
          { e: 'MLI adds volume and is fiddly to install without creating leak paths.', x: 'Blankets are awkward to fit properly.' },
        ],
      },
      facts: [
        { label: 'Strap materials', value: 'Copper, aluminium, or pyrolytic graphite sheet (PGS), which outperforms metal foils' },
        { label: 'Small-sat caveat', value: 'MLI underperforms on CubeSat form factors due to compression risk and edge heat transfer' },
      ],
      flown: 'Standard practice across small spacecraft',
      sources: ['soa-thermal'],
      tags: ['tcs:passive', 'tcs:no-power', 'tcs:straps', 'tcs:no-heater', 'tcs:decoupling'],
    },
    {
      id: 'heaters',
      level: 'both',
      name: { e: 'Active: thermostatically controlled heaters', x: 'Electric warmers' },
      blurb: { e: 'Thin film heaters bonded to the battery and anything else that must not freeze.', x: 'Little electric blankets that switch on when things get too cold.' },
      how: {
        e: 'A thin polyimide film heater is bonded directly to the component. A thermistor measures temperature and either a mechanical thermostat or the flight software closes the loop, switching the heater on below a set point. On most CubeSats the battery is the item that forces this, because charging lithium-ion below 0 °C permanently damages the cell.',
        x: 'A flat sticky heating pad is glued to the cold part. A little thermometer watches the temperature, and when it drops too low the heater switches on. Batteries need this most — charging a cold battery ruins it.',
      },
      madeOf: {
        e: 'Etched-foil resistive elements laminated in Kapton (polyimide), with thermistors and either a bimetallic thermostat or software control through the EPS.',
        x: 'A thin orange plastic pad with a wire pattern inside, plus a temperature sensor.',
      },
      whyChosen: {
        e: 'It is the only practical way to guarantee a minimum temperature during eclipse, and it is the standard answer for battery survival heating. It is mature: NASA SoA puts electrical heaters at TRL 7–9 in LEO.',
        x: 'It is the only reliable way to stop something freezing in the dark. Almost every satellite with a battery has one.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Directly solves the cold case, which passive design cannot.', x: 'Actually fixes the freezing problem.' },
          { e: 'Cheap, light, simple, and very well proven.', x: 'Cheap, light and reliable.' },
        ],
        limits: [
          { e: 'It spends power — often a significant fraction of the orbit-average budget, and always at the worst time, in eclipse.', x: 'It uses electricity exactly when you have least: in the dark.' },
          { e: 'Heaters only add heat; they cannot help you when you are too hot.', x: 'A heater cannot cool anything down.' },
          { e: 'A stuck-on heater is a real failure mode that can overheat the component it was protecting.', x: 'If it gets stuck on, it can cook the very thing it was meant to protect.' },
        ],
      },
      facts: [
        { label: 'Maturity', value: 'NASA SoA: "TRL values for electrical heaters on SmallSats are 7-9 in LEO environments."' },
        { label: 'Power density', value: '0.4 to 7.75 W/cm² depending on design' },
        { label: 'Temperature range', value: 'Most Kapton constructions: −200 °C to 200 °C' },
      ],
      flown: 'Effectively universal on satellites carrying lithium batteries',
      sources: ['soa-thermal', 'soa-power'],
      tags: ['tcs:heaters', 'tcs:active', 'tcs:uses-power', 'tcs:protects-battery'],
    },
    {
      id: 'pcm-heatpipe',
      level: 'engineer',
      name: { e: 'Heat pipes and phase-change material', x: 'Heat sponges and heat pipes' },
      blurb: { e: 'Move heat passively across the spacecraft, or absorb a burst of it and release it slowly.', x: 'A tube that moves heat by itself, and wax that soaks up heat.' },
      how: {
        e: 'A heat pipe is a sealed tube with a working fluid and a wick. At the hot end the fluid boils, absorbing a large latent heat; the vapour flows to the cold end and condenses, releasing it; capillary action in the wick pulls the liquid back. It moves heat far better than solid metal, with no pump and no power. Phase-change material solves the opposite problem: a burst load like a radar pulse or a transmit window melts a wax, and the wax absorbs a large amount of energy at a nearly constant temperature, then refreezes slowly.',
        x: 'A heat pipe is a sealed tube with liquid inside. At the hot end it boils into steam, which rushes to the cold end and turns back into liquid, dumping its heat there. Then it soaks back along the inside. It moves heat brilliantly with no pump at all. Phase-change wax is different: it melts when things get hot, soaking up loads of heat while staying the same temperature — like ice in a drink.',
      },
      madeOf: {
        e: 'Metal pipe with an internal wick and a working fluid (often ammonia or water depending on temperature range). PCM units are typically paraffin wax in a metal housing with internal fins.',
        x: 'A metal tube with liquid inside, and a metal box packed with special wax.',
      },
      whyChosen: {
        e: 'Chosen for spacecraft with a strongly pulsed thermal load or a big hot spot that cannot sit next to a radiator. RainCube-class radars and burst high-rate downlinks are exactly this pattern: intense heat for a few minutes per orbit.',
        x: 'Used when the satellite gets very hot for only a few minutes at a time — like when a radar fires or the radio blasts data home.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Passive: no power and no moving parts, yet very high effective conductivity.', x: 'Moves heat brilliantly without using any electricity.' },
          { e: 'PCM flattens temperature spikes without oversizing the radiator.', x: 'Smooths out sudden heat bursts.' },
        ],
        limits: [
          { e: 'PCM only buys you time — the heat still has to leave eventually.', x: 'The wax only delays the problem; the heat still has to go somewhere.' },
          { e: 'Heat pipes have an orientation and acceleration sensitivity that complicates ground testing.', x: 'Hard to test properly on Earth, because gravity changes how they work.' },
          { e: 'Adds mass and volume that a CubeSat can rarely spare.', x: 'Heavy and bulky for a small satellite.' },
        ],
      },
      facts: [
        { label: 'PCM materials', value: 'Paraffin: 20–60 °C melting point, 140–280 kJ/kg heat of fusion. Water: 0 °C, 333 kJ/kg' },
        { label: 'Flown hardware', value: 'Redwire FlexCool heat pipe flew on TechEdSat-10, a 6U deployed from the ISS in 2020' },
      ],
      flown: 'TechEdSat-10; Redwire Q-Store and Q-Cache phase-change products',
      sources: ['soa-thermal'],
      tags: ['tcs:heatpipe', 'tcs:pcm', 'tcs:passive', 'tcs:pulse-load', 'tcs:mass'],
    },
    {
      id: 'cryocooler',
      level: 'engineer',
      name: { e: 'Cryocooler', x: 'A tiny fridge for the instrument' },
      blurb: { e: 'A miniature mechanical refrigerator to hold a detector far below ambient.', x: 'A real, working fridge small enough to fit in a satellite.' },
      how: {
        e: 'A Stirling or pulse-tube cryocooler cyclically compresses and expands a working gas, moving heat from a cold tip to a warm rejection surface. The cold tip is thermally strapped to the detector. This is the only way to reach the ~80–150 K where certain infrared detectors have acceptable dark current.',
        x: 'It squeezes and releases a gas over and over. Squeezing makes gas hot, letting it expand makes it cold — so it pumps heat out of the detector and dumps it outside. That is how it gets things far colder than space usually would.',
      },
      madeOf: {
        e: 'A compressor with a moving piston or displacer, a regenerator, and a cold finger, plus its drive electronics and a rejection radiator that must actually be able to dump the waste heat.',
        x: 'A tiny pump with moving parts, plus a cold metal finger that touches the detector.',
      },
      whyChosen: {
        e: 'Only chosen when the physics demands it: cooled mid-wave and long-wave infrared spectrometers cannot work warm. Lunar IceCube flew a 600 mW cryocooler for its BIRCHES spectrometer, and LunIR flew a Lockheed Martin MICRO1-1.',
        x: 'Only used when the instrument genuinely will not work unless it is freezing cold. Some space telescopes need this.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Enables detector classes that are otherwise impossible on a CubeSat.', x: 'Lets you fly instruments that could not work any other way.' },
          { e: 'Flight-proven at 6U scale.', x: 'Already done on a small satellite.' },
        ],
        limits: [
          { e: 'High continuous power draw — often the largest single load on the spacecraft.', x: 'Uses a huge amount of electricity, all the time.' },
          { e: 'Moving parts running for the whole mission: the dominant wear-out item.', x: 'It has moving parts running constantly, so it wears out.' },
          { e: 'Exports vibration straight into the instrument it is cooling.', x: 'It buzzes, and that buzz can blur the very instrument it is helping.' },
          { e: 'Needs a real radiator to reject the heat it pumps.', x: 'It has to dump the heat somewhere, so you need a big cold panel too.' },
        ],
      },
      facts: [
        { label: 'Real units', value: 'Lockheed Martin MICRO1-1: 1 W cooling at 150 K cold tip, flown on LunIR (Artemis I). Ricor K508N: 0.2 W at 80 K, 0.475 kg' },
        { label: 'Real mission', value: 'Lunar IceCube (6U, Artemis I 2022): 600 mW cryocooler for the BIRCHES spectrometer' },
      ],
      flown: 'LunIR, Lunar IceCube',
      sources: ['soa-thermal'],
      tags: ['tcs:cryo', 'tcs:active', 'tcs:very-high-power', 'tcs:jitter', 'tcs:moving-parts', 'tcs:needs-radiator'],
    },
  ],
}
