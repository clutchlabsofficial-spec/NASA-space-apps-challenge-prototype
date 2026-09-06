export const power = {
  id: 'power',
  order: 4,
  code: 'EPS',
  name: { e: 'Power — Solar Arrays & EPS', x: 'Making Electricity' },
  subtitle: { e: 'Turning sunlight into every watt the spacecraft will ever use', x: 'Catching sunshine and turning it into power' },
  question: { e: 'How will you generate power?', x: 'How will your satellite make electricity?' },
  primer: {
    e: 'A satellite has no fuel line and no plug. Everything it does for its whole life comes from sunlight hitting solar cells. In low Earth orbit you get roughly 90-minute laps, and you spend a large part of each one in Earth’s shadow, so the array has to generate not just what you use in daylight but also everything the battery must store for the dark half.',
    x: 'There is no plug socket in space. Every bit of electricity your satellite will ever use has to come from sunlight. And it goes round Earth so fast that it passes into Earth’s shadow about sixteen times a day — so it also has to make extra power to save up for the dark bits.',
  },
  realTalk: {
    e: 'Space solar cells are not the silicon panels on a house roof. They are multi-junction III-V semiconductor stacks: several sub-cells layered so each one absorbs a different slice of the spectrum, reaching efficiencies household silicon cannot approach.',
    x: 'Space solar cells are special. Instead of one layer, they have several layers stacked up, each catching a different colour of sunlight — so they waste much less of it.',
  },
  sources: ['soa-power'],
  options: [
    {
      id: 'body-mounted',
      level: 'both',
      name: { e: 'Body-mounted cells', x: 'Panels stuck on the sides' },
      blurb: { e: 'Cells bonded directly to the satellite’s outside faces. Nothing to deploy, nothing to fail.', x: 'Solar cells glued straight onto the satellite’s walls.' },
      how: {
        e: 'Multi-junction cells are bonded to the outer panels and wired into strings. Because the faces point in fixed directions, only the ones currently facing the Sun generate anything, and they lose output by the cosine of the angle — a face 60° off the Sun gives you half its rated power.',
        x: 'The cells are glued straight onto the outside walls. Only the walls facing the Sun make power, and the more sideways they are, the less they make.',
      },
      madeOf: {
        e: 'Triple-junction gallium arsenide cells (typically ~29–32% efficient) with a coverglass, bonded to a printed circuit board or aluminium substrate.',
        x: 'Special layered solar cells with a glass cover, stuck onto a stiff board.',
      },
      whyChosen: {
        e: 'It is the only option with no deployment event, which removes an entire class of mission-ending failure. For a low-power payload — a radio receiver, a particle detector — it is genuinely sufficient, and it is what you fly if reliability matters more than watts.',
        x: 'Nothing has to unfold, so nothing can get stuck. If your satellite does not need much power, this is the safest choice by far.',
      },
      tradeoffs: {
        strengths: [
          { e: 'No mechanism, so no deployment failure mode.', x: 'Nothing to unfold, nothing to jam.' },
          { e: 'No deployment torque disturbing attitude; simple, compact, cheap.', x: 'Simple and cheap.' },
        ],
        limits: [
          { e: 'Power scales with the small outside area of the satellite — the hard ceiling on this option.', x: 'A small satellite has small walls, so you only get a little power.' },
          { e: 'Cosine losses: most of your cells are pointing the wrong way at any moment.', x: 'Most of the cells are facing away from the Sun most of the time.' },
          { e: 'Cells compete for the same faces as radiators, antennas and instrument apertures.', x: 'The walls are crowded — cameras and antennas want that space too.' },
        ],
      },
      facts: [
        { label: 'Cell efficiency', value: 'NASA SoA: space multi-junction cells reach "spectral efficiencies of 30-34%"' },
        { label: 'Examples', value: 'AZUR Space 3G30-Adv 29.5%; Rocket Lab ZTJ Omega 30.2%; Boeing-Spectrolab XTE-SF 32.2%' },
      ],
      flown: 'Standard on 1U university CubeSats and on low-power 3U buses',
      sources: ['soa-power'],
      tags: ['power:body', 'power:low', 'power:no-deployable', 'power:reliable'],
    },
    {
      id: 'deployable-fixed',
      level: 'both',
      name: { e: 'Deployable fixed panels', x: 'Fold-out wings' },
      blurb: { e: 'Hinged panels that spring open once clear of the deployer. The standard answer.', x: 'Panels folded flat that pop open in space, like wings.' },
      how: {
        e: 'Panels are folded against the body and held by a hold-down — commonly a nylon cord cut by a burn-wire resistor. When the flight computer passes current through the resistor it melts the cord, and torsion springs in the hinges swing the panels out and latch them. They then stay in a fixed geometry relative to the body.',
        x: 'The panels are folded up and tied down with a string. In space, the computer heats a little wire until the string melts, and springs flick the wings open with a click.',
      },
      madeOf: {
        e: 'Same triple-junction cells, on rigid PCB, carbon-fibre or aluminium-honeycomb substrates, with spring-loaded hinges and a burn-wire or pin-puller release.',
        x: 'The same special solar cells, mounted on stiff lightweight boards, with springy hinges.',
      },
      whyChosen: {
        e: 'This is the pragmatic middle: it multiplies your collecting area several times over for one mechanism and no ongoing power cost. Almost every imaging or radar CubeSat flies deployables because body-mounted power simply cannot feed them.',
        x: 'You get several times more power for one unfolding. Almost every camera satellite does this, because sticking panels on the walls just does not make enough electricity.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Several times the area of body-mounted for modest mass.', x: 'Much more power, not much more weight.' },
          { e: 'Once deployed, no moving parts and no standby power.', x: 'After it opens, nothing else moves or uses power.' },
        ],
        limits: [
          { e: 'One-shot mechanism: a failed deployment usually ends the mission.', x: 'If the wings do not open, the mission is over.' },
          { e: 'Large panels increase drag and give the atmosphere more leverage to twist you.', x: 'Big wings catch the thin air and push the satellite around.' },
          { e: 'Panels can shadow the instrument or the antenna depending on geometry.', x: 'The wings can get in the camera’s way.' },
        ],
      },
      facts: [
        { label: 'Specific power', value: 'NASA SoA: triple/quadruple deployable configurations offer 34–70 W/kg' },
        { label: 'Typical', value: 'Missions cluster "around ~30 W/kg" specific power' },
      ],
      flown: 'Planet Dove, Spire Lemur-2, most 3U and 6U commercial CubeSats',
      sources: ['soa-power'],
      tags: ['power:deployable', 'power:medium', 'power:has-deployable', 'power:drag'],
    },
    {
      id: 'articulated',
      level: 'engineer',
      name: { e: 'Deployable + sun-tracking (articulated) arrays', x: 'Wings that turn to follow the Sun' },
      blurb: { e: 'Motorised wings that rotate to hold the Sun square on. Maximum power, maximum complexity.', x: 'Wings on little motors that keep turning to face the Sun.' },
      how: {
        e: 'After deployment, a solar array drive assembly rotates the wings on one or two axes, using sun-sensor feedback so the cells stay near normal incidence regardless of how the body is pointed. This decouples power generation from attitude — the instrument can stare at the ground while the wings keep facing the Sun.',
        x: 'After the wings open, little motors keep turning them so they always face the Sun — even while the satellite itself is looking down at Earth.',
      },
      madeOf: {
        e: 'Deployable substrates plus a solar array drive assembly: a small geared motor, slip rings or a twist capsule to pass current across the rotating joint, and position feedback.',
        x: 'Fold-out panels plus a little motor and a clever electrical joint that lets power flow across a spinning connection.',
      },
      whyChosen: {
        e: 'Chosen when the payload is power-hungry and simultaneously demands a fixed pointing direction — an active radar, a high-rate transmitter, or electric propulsion. It removes the conflict between "point at the target" and "point at the Sun".',
        x: 'You need this when your tool must stare at one thing while the satellite still needs lots of power. Otherwise you would have to choose between looking and charging.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Highest and most consistent power generation available at CubeSat scale.', x: 'The most electricity you can get.' },
          { e: 'Frees the spacecraft to point the payload wherever it needs.', x: 'The satellite can look anywhere and still charge.' },
        ],
        limits: [
          { e: 'A continuously operating mechanism with slip rings — a real wear and lifetime item.', x: 'The motor keeps running, and things that keep moving eventually wear out.' },
          { e: 'The drive consumes power and injects jitter, which can blur a sensitive instrument.', x: 'The motor shakes the satellite slightly, which can blur pictures.' },
          { e: 'Most complex and expensive option, and rarely justified below 6U.', x: 'Complicated and expensive — usually only on bigger satellites.' },
        ],
      },
      facts: [
        { label: 'Specific power', value: 'NASA SoA lists multi-deployable configurations at 34–70 W/kg' },
        { label: 'PMAD efficiency', value: 'Power management systems typically 85–99% efficient (e.g. Pumpkin AMPS at 99%)' },
      ],
      flown: 'Common on ESPA-class small satellites; used on the larger CubeSat platforms',
      sources: ['soa-power'],
      tags: ['power:articulated', 'power:high', 'power:has-deployable', 'power:jitter', 'power:mechanism'],
    },
  ],
}
