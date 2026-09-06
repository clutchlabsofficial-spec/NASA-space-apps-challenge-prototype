export const propulsion = {
  id: 'propulsion',
  multi: true,
  order: 11,
  code: 'PROP',
  name: { e: 'Propulsion & End of Life', x: 'Moving, and Coming Home' },
  subtitle: { e: 'Changing your orbit, and being a good citizen when you are done', x: 'How it moves — and how it tidies up after itself' },
  question: { e: 'Will you carry propulsion, and how will you dispose of the spacecraft?', x: 'Will your satellite have an engine, and how will it clean up?' },
  primer: {
    e: 'Most CubeSats have no propulsion at all, and that is a legitimate design. But two things push you toward it: wanting to change your orbit, and needing to leave it. Since September 2022 the FCC has required satellites it licenses in low Earth orbit to be disposed of within five years of launch, down from the previous 25. Below about 400 km, atmospheric drag does that for you automatically. Between 400 and 800 km it usually will not, and you need a plan.',
    x: 'Most small satellites have no engine at all, and that is fine. But there is a rule now: if you launch into low orbit, you must be gone within five years so you do not become space junk. If you fly really low, the thin air pulls you down by itself. Higher up, you have to do something about it.',
  },
  realTalk: {
    e: 'Propulsion is also the hardest thing to get through launch safety review. A pressurised tank or an energetic propellant on a rideshare with somebody else’s expensive primary payload attracts an enormous amount of scrutiny, and that paperwork is often the real cost.',
    x: 'Rocket companies get very nervous about engines and fuel tanks riding along with their expensive main satellite. Getting permission is often harder than building the engine.',
  },
  sources: ['soa-prop', 'soa-deorbit', 'fcc-5yr'],
  options: [
    {
      id: 'none-natural',
      level: 'both',
      name: { e: 'No propulsion — natural orbital decay', x: 'No engine. Let the air bring it down.' },
      blurb: { e: 'Fly where the atmosphere will remove you on its own. Simplest possible answer.', x: 'Fly low enough that the thin air slowly pulls it back to Earth.' },
      how: {
        e: 'Even at 400 km there is a trace atmosphere. Every orbit it takes a little energy out of your orbit, lowering you slightly, into slightly denser air, which takes more energy — so decay accelerates and ends with reentry. How fast depends on your ballistic coefficient: a light satellite with big solar panels comes down noticeably faster than a dense compact one.',
        x: 'Even where satellites fly there is a tiny bit of air left. It rubs against the satellite every lap, slowing it down a little, so it sinks a bit lower — where there is more air, so it slows even faster. Eventually it burns up.',
      },
      madeOf: {
        e: 'Nothing. This is a choice not to build something, which is often the correct engineering decision.',
        x: 'Nothing at all! Sometimes the best engineering is not building something.',
      },
      whyChosen: {
        e: 'It is the right answer for the majority of CubeSats. No tank, no valves, no safety review, no failure mode, and full debris compliance provided your orbit is low enough. The mission just has to be short enough to fit the natural lifetime.',
        x: 'This is what most small satellites do. Nothing to build, nothing to break, and no space junk left behind.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Zero mass, cost, power, complexity and risk.', x: 'Costs nothing and cannot fail.' },
          { e: 'Automatically compliant below roughly 400 km.', x: 'Follows the rules by itself if you fly low.' },
        ],
        limits: [
          { e: 'You cannot change your orbit at all — no altitude maintenance, no phasing, no collision avoidance.', x: 'You can never move out of the way of anything.' },
          { e: 'Your mission ends when the atmosphere decides, not when you do.', x: 'You do not get to choose when it ends.' },
          { e: 'Above ~400 km this may not meet the 5-year rule on its own.', x: 'If you fly higher, this is not enough to follow the rules.' },
        ],
      },
      facts: [
        { label: 'Rule', value: 'FCC, September 2022: LEO satellites (<2000 km) must be disposed of within 5 years post-launch' },
        { label: 'Decay', value: 'NASA SoA: below 400 km, most small satellites decay naturally within 5 years' },
        { label: 'Solar cycle', value: 'Drag increases at solar maximum, so decay is faster' },
      ],
      flown: 'The majority of CubeSats ever launched',
      sources: ['soa-deorbit', 'fcc-5yr'],
      tags: ['prop:none', 'prop:no-manoeuvre', 'eol:natural', 'prop:simple'],
    },
    {
      id: 'drag-sail',
      level: 'both',
      name: { e: 'Drag sail / deorbit device', x: 'A parachute for space' },
      blurb: { e: 'Deploy a large thin membrane at end of mission to multiply your drag and fall out fast.', x: 'Unfold a big thin sheet so the thin air grabs it and pulls it down.' },
      how: {
        e: 'You cannot make the atmosphere thicker, but you can make yourself catch more of it. Deploying a membrane on booms multiplies your cross-sectional area many times over, which slashes your ballistic coefficient and turns a decades-long decay into months or a couple of years. It is deliberately one-way: once it opens, your mission is ending.',
        x: 'You cannot make more air, but you can make yourself bigger so you catch more of it. Unfolding a big thin sheet is like opening a parachute — the tiny bit of air pulls much harder and you come down far sooner.',
      },
      madeOf: {
        e: 'A thin polymer membrane, commonly aluminised Kapton or Mylar a few microns thick, on tape-spring or coilable booms, with a burn-wire or pin-puller release.',
        x: 'A sheet of shiny plastic thinner than a crisp packet, held out by springy metal strips that unroll.',
      },
      whyChosen: {
        e: 'It is the standard way for a satellite above 400 km to meet the disposal rule without carrying propellant. It is entirely passive once deployed, needs no propellant and no power, and it is light: MMA Design’s dragNET is a 2.8 kg module giving 14 m² of drag area.',
        x: 'It is how a satellite that flies too high to come down naturally follows the clean-up rules — without needing any fuel at all.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Passive, propellant-free, and light for the effect it produces.', x: 'No fuel needed, and very light.' },
          { e: 'Flight-proven repeatedly across a range of spacecraft sizes.', x: 'Already worked on lots of real satellites.' },
        ],
        limits: [
          { e: 'A one-shot deployment: if it fails to open, you have no disposal plan at all.', x: 'If it does not open, you are stuck up there.' },
          { e: 'Premature deployment ends the mission early — the failure mode is severe in both directions.', x: 'If it opens too soon, your mission is over.' },
          { e: 'A big sail is a big collision cross-section while it is decaying.', x: 'While it is coming down, it is a much bigger target for other satellites.' },
          { e: 'Cannot help you avoid a collision — it only ends the mission tidily.', x: 'It cannot steer you out of the way of anything.' },
        ],
      },
      facts: [
        { label: 'Real hardware', value: 'MMA Design dragNET: 2.8 kg module, 14 m² drag area; can deorbit a 180 kg spacecraft from 850 km within 10 years' },
        { label: 'Flown', value: 'NanoSail-D2 (2011) deorbited from 650 km. InflateSail (2017) deorbited in "just 72 days"' },
        { label: 'CubeSat scale', value: 'CanX-7 flew four modules each providing 1 m² of drag area from ~700 km SSO' },
      ],
      flown: 'NanoSail-D2, CanX-7, InflateSail, Spinnaker 3',
      sources: ['soa-deorbit'],
      tags: ['prop:none', 'prop:no-manoeuvre', 'eol:dragsail', 'prop:has-deployable'],
    },
    {
      id: 'tether',
      level: 'engineer',
      name: { e: 'Electrodynamic tether', x: 'A long wire that brakes on Earth’s magnetism' },
      blurb: { e: 'Unreel a conductive tape and let Earth’s magnetic field brake you electromagnetically.', x: 'Unroll a long metal ribbon and let Earth’s magnetism drag on it.' },
      how: {
        e: 'A conductive tape moving through Earth’s magnetic field has a voltage induced along it. If current can flow — collected from and emitted into the surrounding ionospheric plasma — then that current in the magnetic field produces a force opposing the motion. You are braking against a planet’s magnetic field with no propellant at all.',
        x: 'Move a wire through a magnet’s field and electricity flows in it. Earth is a giant magnet, so a long ribbon trailing behind a satellite generates a current — and that current pushes back against Earth, slowing the satellite down. No fuel needed at all.',
      },
      madeOf: {
        e: 'A conductive aluminium tape stowed on a spool, with a deployment mechanism and plasma contactors. Tethers Unlimited’s CubeSat Terminator Tape masses just 0.083 kg.',
        x: 'A long thin metal ribbon rolled up on a spool, which unwinds in space.',
      },
      whyChosen: {
        e: 'Chosen for extremely low mass relative to the deorbit effect, particularly on larger spacecraft where a sail would need to be impractically big.',
        x: 'Chosen because it is incredibly light for how well it works.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Very low mass — the CubeSat version is 83 grams.', x: 'Astonishingly light.' },
          { e: 'No propellant and no pressure vessel, so an easy safety review.', x: 'No fuel, so nothing to worry about at launch.' },
        ],
        limits: [
          { e: 'Only works where there is a magnetic field and ionospheric plasma — Earth orbit only.', x: 'Only works around Earth.' },
          { e: 'A long thin tether is vulnerable to being cut by micrometeoroids and debris.', x: 'A tiny bit of space dust could cut the ribbon.' },
          { e: 'Deployment dynamics are complex and hard to test on the ground.', x: 'Very hard to test properly before launch.' },
        ],
      },
      facts: [
        { label: 'Real hardware', value: 'Terminator Tape: NanoSat version 0.808 kg with 70 m of conductive tape; CubeSat version 0.083 kg' },
        { label: 'Demonstrated', value: 'Flown on Prox-1, a 71 kg satellite, in 2019' },
      ],
      flown: 'Prox-1 (2019)',
      sources: ['soa-deorbit'],
      tags: ['prop:none', 'prop:no-manoeuvre', 'eol:tether', 'prop:has-deployable', 'prop:earth-only'],
    },
    {
      id: 'cold-gas',
      level: 'both',
      name: { e: 'Cold gas thrusters', x: 'Puffs of gas' },
      blurb: { e: 'Release stored gas through a nozzle. The simplest real rocket there is.', x: 'Let a stored gas squirt out of a small hole to push the satellite.' },
      how: {
        e: 'A propellant stored under pressure — or as a liquid or solid that turns to gas — is released through a nozzle. There is no combustion and nothing to ignite: the only energy is the pressure you stored on the ground. That makes it the safest and simplest propulsion class, and also the least efficient, because a cold gas carries far less energy per kilogram than a chemical reaction.',
        x: 'Like letting go of a blown-up balloon. Gas rushes out of a small hole, and the satellite gets pushed the other way. Nothing burns, nothing explodes — it is just squeezed gas escaping.',
      },
      madeOf: {
        e: 'A tank, a regulator, solenoid valves and small nozzles. Propellants include gaseous nitrogen, sulfur hexafluoride, the refrigerant R-236fa, and subliming solids such as iodine.',
        x: 'A gas bottle, some valves and tiny nozzles.',
      },
      whyChosen: {
        e: 'Chosen when you need modest, precise, reliable manoeuvres and cannot accept the risk or the paperwork of an energetic propellant. MarCO used R-236fa cold gas — four attitude thrusters and four trajectory-correction thrusters per spacecraft — to fly to Mars and keep its antenna pointed at Earth during InSight’s landing.',
        x: 'Picked when you need small, gentle, dependable nudges. The two MarCO satellites used this to fly all the way to Mars.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Very simple, no combustion, and much easier to get through launch safety review.', x: 'Simple and safe — nothing burns.' },
          { e: 'Precise small impulses, good for attitude control and fine trajectory correction.', x: 'Great for tiny, careful pushes.' },
          { e: 'Genuine deep-space heritage.', x: 'Has really flown to Mars.' },
        ],
        limits: [
          { e: 'Low specific impulse — NASA SoA gives cold gas at 40–110 s, so you carry a lot of mass for little velocity change.', x: 'Very inefficient: you carry lots of gas for a small push.' },
          { e: 'A pressurised tank is still a stored-energy item that launch providers scrutinise.', x: 'A pressure tank still makes rocket people nervous.' },
          { e: 'Valve leakage is a classic long-duration failure mode.', x: 'Valves can leak slowly and waste all your gas.' },
        ],
      },
      facts: [
        { label: 'Performance', value: 'NASA SoA: thrust 10 μN – 3.6 N, specific impulse 40–110 s' },
        { label: 'MarCO', value: 'R-236fa cold gas, eight thrusters total (four attitude control, four trajectory correction), Mars InSight relay, 2018' },
        { label: 'Other flights', value: 'CanX-4/CanX-5 flew liquid sulfur hexafluoride for formation flying in 2014; ThrustMe I2T5 flew iodine in 2019' },
      ],
      flown: 'MarCO-A and MarCO-B, CanX-4/5',
      sources: ['soa-prop', 'nasa-marco'],
      tags: ['prop:coldgas', 'prop:manoeuvre-small', 'prop:low-isp', 'eol:propulsive', 'prop:pressure-vessel'],
    },
    {
      id: 'electric',
      level: 'both',
      name: { e: 'Electric propulsion (electrospray / gridded ion)', x: 'Electric engine' },
      blurb: { e: 'Accelerate charged particles with electric fields. Feeble thrust, extraordinary efficiency.', x: 'Push out tiny electrically charged bits, incredibly fast.' },
      how: {
        e: 'Instead of getting energy from pressure or combustion, you use the spacecraft’s electrical power to accelerate ions to enormous exhaust velocities. An electrospray thruster pulls charged droplets straight out of an ionic liquid with a strong electric field; a gridded ion engine ionises a gas and accelerates it through charged grids. Because exhaust velocity is so high, you need far less propellant for the same velocity change — but the thrust is measured in micronewtons, so you must fire for weeks.',
        x: 'Instead of burning fuel, it uses electricity to fling tiny charged particles out of the back, unbelievably fast. Each particle is minuscule, so the push is gentler than a feather landing on your hand — but it can keep pushing for months, and that adds up to a lot.',
      },
      madeOf: {
        e: 'For electrospray: emitter arrays and extractor electrodes with an ionic liquid propellant. For gridded ion: an ionisation chamber, accelerator grids, a neutraliser, and often xenon or iodine. Both need high-voltage power processing electronics.',
        x: 'Very fine needles or grids with high voltage across them, plus a special propellant and electronics to make the high voltage.',
      },
      whyChosen: {
        e: 'Chosen when total velocity change matters more than how fast you get it. Because specific impulse can be ten to thirty times a cold gas system, you can do orbit raising, constellation phasing, station-keeping and disposal on a propellant mass a CubeSat can actually carry.',
        x: 'Used when you need to change your orbit a lot over a long time. It is so efficient that a tiny amount of propellant goes an enormous way.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Very high specific impulse — electrospray 225–3,000 s, gridded ion 500–3,000 s.', x: 'Uses hardly any propellant for how much it can do.' },
          { e: 'Enables real orbit changes and long-term station-keeping from a CubeSat.', x: 'Lets a tiny satellite genuinely change where it flies.' },
          { e: 'No pressurised combustion, and some propellants are solids at room temperature.', x: 'Nothing burns, and some versions use a solid that never leaks.' },
        ],
        limits: [
          { e: 'Thrust is micronewtons to millinewtons — you cannot do anything quickly.', x: 'The push is so gentle that everything takes weeks.' },
          { e: 'Needs a lot of electrical power, which competes directly with your payload.', x: 'Uses a lot of electricity that your instrument also wants.' },
          { e: 'High-voltage electronics in vacuum bring their own failure modes.', x: 'High voltage in space can arc and break things.' },
          { e: 'Cannot perform an urgent collision-avoidance manoeuvre.', x: 'Too slow to dodge anything in a hurry.' },
        ],
      },
      facts: [
        { label: 'Electrospray', value: 'NASA SoA: 20 μN – 20 mN thrust, 225–3,000 s Isp, ionic liquid propellants' },
        { label: 'Gridded ion', value: '0.1–20 mN thrust, 500–3,000 s Isp' },
        { label: 'Iodine', value: 'ThrustMe I2T5 was the "First iodine propulsion system to be spaceflight tested, flown on the Xiaoxiang 1-08 satellite in 2019."' },
      ],
      flown: 'ThrustMe I2T5; Enpulsion and Busek units across many smallsats',
      sources: ['soa-prop'],
      tags: ['prop:electric', 'prop:manoeuvre-large', 'prop:high-isp', 'prop:high-power', 'prop:slow', 'eol:propulsive'],
    },
    {
      id: 'green-mono',
      level: 'engineer',
      name: { e: 'Green monopropellant', x: 'A safer chemical rocket' },
      blurb: { e: 'A high-performance chemical thruster using a propellant far less toxic than hydrazine.', x: 'A real little rocket engine that uses much safer fuel.' },
      how: {
        e: 'The propellant flows over a heated catalyst bed and decomposes exothermically into hot gas, which expands through a nozzle. No oxidiser tank and no ignition system — the catalyst does the work. Green propellants like ASCENT (AF-M315E) and LMP-103S replace hydrazine, which is acutely toxic and requires suited handling crews.',
        x: 'The liquid flows over a special hot metal surface that makes it break apart into hot gas all by itself. That gas rushes out of the nozzle and pushes the satellite. The old fuel for this was so poisonous that people had to wear spacesuits to load it — the new stuff is far safer.',
      },
      madeOf: {
        e: 'A propellant tank, a catalyst bed with a preheater, valves and a nozzle. Lunar Flashlight used four 0.1 N ASCENT thrusters with additively manufactured propellant management devices.',
        x: 'A fuel tank, a heated catalyst, valves and a nozzle — a proper miniature rocket engine.',
      },
      whyChosen: {
        e: 'Chosen when you need meaningful thrust with reasonable efficiency and cannot wait weeks for an electric thruster: escaping Earth orbit, capturing into a lunar orbit, or executing a time-critical manoeuvre.',
        x: 'Used when you need a real push right now — like leaving Earth orbit to go to the Moon.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Far better Isp than cold gas with real thrust levels.', x: 'Much stronger and more efficient than gas puffs.' },
          { e: 'Substantially safer to handle than hydrazine.', x: 'Much safer than the old poisonous fuel.' },
          { e: 'Flight-demonstrated on GPIM and Lunar Flashlight.', x: 'Already tested in real missions.' },
        ],
        limits: [
          { e: 'Still an energetic propellant with a pressurised system — the hardest safety review here.', x: 'Still a fuel tank, so still the hardest to get permission for.' },
          { e: 'The catalyst bed needs preheating, which costs power before every burn.', x: 'It has to warm up before every firing, which uses power.' },
          { e: 'Complex and expensive relative to everything else on this list.', x: 'Complicated and expensive.' },
        ],
      },
      facts: [
        { label: 'Performance', value: 'NASA SoA: green propellants sit in the 200–310 s Isp band; hydrazine monoprop is 180–285 s at 0.25–28 N' },
        { label: 'GPIM', value: 'Five 1-N ASCENT thrusters, launched June 2019 on Falcon Heavy' },
        { label: 'Lunar Flashlight', value: 'Four 0.1-N ASCENT thrusters (Rubicon Space Systems), launched December 2022' },
      ],
      flown: 'GPIM (2019), Lunar Flashlight (2022)',
      sources: ['soa-prop'],
      tags: ['prop:chemical', 'prop:manoeuvre-large', 'prop:fast', 'prop:pressure-vessel', 'prop:complex', 'eol:propulsive'],
    },
  ],
}
