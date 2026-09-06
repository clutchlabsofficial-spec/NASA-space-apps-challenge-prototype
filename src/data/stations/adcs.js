export const adcs = {
  id: 'adcs',
  order: 7,
  code: 'ADCS',
  name: { e: 'ADCS — Attitude Determination & Control', x: 'Pointing the Right Way' },
  subtitle: { e: 'Knowing which way you are facing, and changing it', x: 'Working out which way it is facing, and turning it' },
  question: { e: 'How will you control your attitude?', x: 'How will your satellite turn and hold still?' },
  primer: {
    e: 'Attitude is which way the spacecraft is facing. Determination is knowing it; control is changing it. These are two different problems and you need both. A satellite in orbit is in free fall with almost nothing to push against, so you cannot just steer — every torque has to come from either spinning a mass inside the spacecraft, pushing against Earth’s magnetic field, throwing propellant overboard, or exploiting a gradient in gravity. Meanwhile small torques from atmospheric drag, solar radiation pressure and magnetic residuals are constantly nudging you off target.',
    x: 'Your satellite is falling around Earth with nothing to push against — no air, no ground, no brakes. So how do you turn it? There are only a few honest ways: spin a heavy wheel inside it, push against Earth’s magnetism like a compass needle, or squirt out some gas. Meanwhile tiny forces keep trying to tip it over, so you can never stop correcting.',
  },
  realTalk: {
    e: 'Pointing requirement comes from the payload, and it is the number that most often forces a redesign. A radio receiver may need 10°. A camera needs its image not to smear during the exposure. A laser downlink needs arcseconds.',
    x: 'How steady you must be depends entirely on your job. A radio ear can be sloppy. A camera must hold very still. A laser must be almost perfect.',
  },
  sources: ['soa-gnc'],
  options: [
    {
      id: 'passive-magnetic',
      level: 'both',
      name: { e: 'Passive magnetic stabilisation', x: 'Compass-needle satellite' },
      blurb: { e: 'A permanent magnet plus hysteresis rods. No power, no software, no failure modes.', x: 'A magnet inside makes it line up with Earth, like a compass.' },
      how: {
        e: 'A permanent magnet aligns the satellite with Earth’s magnetic field, exactly as a compass needle does. On its own that would leave the satellite oscillating about the field line forever, so soft-magnetic hysteresis rods are added: as the field direction changes relative to the satellite, the rods repeatedly magnetise and demagnetise, and the energy lost to that hysteresis loop damps the wobble out.',
        x: 'A magnet inside pulls the satellite into line with Earth’s own magnetism, like a compass needle. But a compass needle wobbles before it settles — so soft metal rods are added that soak up the wobbling energy and turn it into a tiny bit of heat.',
      },
      madeOf: {
        e: 'A hard permanent magnet (typically AlNiCo or samarium-cobalt) and soft-magnetic hysteresis rods, usually a nickel-iron alloy such as Permalloy or HyMu-80.',
        x: 'One strong magnet, and a couple of soft metal rods.',
      },
      whyChosen: {
        e: 'It uses zero power, has no moving parts, needs no software and cannot fail. For a mission where you only need a rough, stable orientation — an omnidirectional radio receiver, a simple particle detector — it is genuinely the right engineering answer, not a compromise.',
        x: 'It uses no electricity, has nothing that can break, and needs no computer at all. If you only need to be roughly the right way up, it is honestly the best choice.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Zero power, zero software, effectively zero failure probability.', x: 'Cannot break, uses no power.' },
          { e: 'Very cheap and very light.', x: 'Cheap and light.' },
        ],
        limits: [
          { e: 'You get one orientation — aligned with the local field — and it is not one you chose.', x: 'You do not get to pick which way it faces.' },
          { e: 'The field direction changes around the orbit, so your pointing tumbles slowly relative to Earth or the Sun.', x: 'Earth’s magnetism points different ways in different places, so your satellite keeps rolling over.' },
          { e: 'Accuracy is a matter of degrees, not fractions of a degree.', x: 'Nowhere near precise enough for a camera.' },
        ],
      },
      facts: [
        { label: 'Accuracy class', value: 'Degrees; alignment is to the local magnetic field, not to a chosen target' },
        { label: 'Power', value: 'None' },
      ],
      flown: 'Many early 1U university CubeSats, including several ELaNa missions',
      sources: ['soa-gnc'],
      tags: ['adcs:passive', 'adcs:no-power', 'adcs:coarse', 'adcs:no-target-choice', 'adcs:reliable'],
    },
    {
      id: 'magnetorquers',
      level: 'both',
      name: { e: 'Magnetorquers (torque rods and coils)', x: 'Electromagnet pushers' },
      blurb: { e: 'Electromagnets that push against Earth’s magnetic field. Cheap, robust, and fundamentally limited.', x: 'Electromagnets that push against Earth itself to turn the satellite.' },
      how: {
        e: 'Running current through a coil creates a magnetic dipole, and a dipole in Earth’s field feels a torque. Crucially, the torque is the cross product of your dipole and the field, so you can only ever generate torque perpendicular to the field line — you have no authority at all about the field axis itself. As the satellite orbits, the field direction rotates relative to you, so over a full orbit you can control all three axes, just never all at the same instant.',
        x: 'Send electricity through a coil of wire and it becomes a magnet. Earth is also a magnet, so the two push against each other and the satellite turns. The catch: you can only push sideways to Earth’s magnetism, never along it — so at any moment there is one direction you simply cannot turn.',
      },
      madeOf: {
        e: 'Copper wire wound on a high-permeability ferromagnetic core (rods) or as an air-core coil, sometimes etched directly into the solar panel PCB to save volume.',
        x: 'Coils of copper wire, sometimes wound around a metal rod, sometimes printed flat onto a circuit board.',
      },
      whyChosen: {
        e: 'No moving parts, no propellant, and it runs on the electricity you already have. It is also the standard way to detumble after deployment: you come out of the deployer spinning, and a simple control law using only magnetorquers and a magnetometer will reliably bleed off that rotation.',
        x: 'Nothing moves, so nothing wears out, and it only needs electricity. It is also how satellites stop spinning after they are pushed out of the rocket.',
      },
      tradeoffs: {
        strengths: [
          { e: 'No moving parts, no consumables — it works as long as you have power.', x: 'Never runs out and never wears out.' },
          { e: 'Very light, cheap, and low risk; excellent for detumbling.', x: 'Light, cheap and safe.' },
        ],
        limits: [
          { e: 'NASA SoA is explicit: "magnetic torquers alone cannot typically provide three-axis stabilization".', x: 'On their own they cannot hold the satellite steady in all directions.' },
          { e: 'Torque is tiny, so slewing to a new target takes many minutes.', x: 'Very slow to turn.' },
          { e: 'Depends on Earth’s field, so it weakens with altitude and does not work at all away from Earth.', x: 'Useless once you leave Earth — the Moon has no magnetic field to push against.' },
          { e: 'Your own coils interfere with your magnetometer, so you cannot always measure and torque at once.', x: 'The coils confuse the satellite’s own compass.' },
        ],
      },
      facts: [
        { label: 'Real device', value: 'CubeSpace CubeTorquer CR0002: 0.2 A·m² dipole, 0.0165 kg' },
        { label: 'Fundamental limit', value: 'NASA SoA: torque is only available perpendicular to the local magnetic field' },
      ],
      flown: 'Nearly universal — almost every CubeSat carries magnetorquers even when it also has wheels',
      sources: ['soa-gnc'],
      tags: ['adcs:torquers', 'adcs:coarse', 'adcs:no-consumables', 'adcs:slow-slew', 'adcs:earth-only', 'adcs:reliable'],
    },
    {
      id: 'wheels-plus-torquers',
      level: 'both',
      name: { e: 'Reaction wheels + magnetorquers', x: 'Spinning wheels inside' },
      blurb: { e: 'Three spinning wheels give real three-axis control; torquers dump the momentum they build up.', x: 'Spin a wheel one way, and the satellite turns the other way.' },
      how: {
        e: 'Conservation of angular momentum: spin a flywheel faster in one direction and the spacecraft rotates the other way. Three wheels mounted orthogonally give full three-axis control, and you can slew to a target in seconds. The problem is that the disturbance torques never stop, so the wheels spin faster and faster to hold attitude until they saturate at maximum speed and stop being useful. Magnetorquers then apply an external torque against Earth’s field to bleed the momentum back out — desaturation, or momentum dumping.',
        x: 'If you spin a wheel inside the satellite one way, the satellite turns the other way. Three wheels let you turn any direction you like, quickly. But tiny forces keep nudging the satellite, so the wheels have to spin faster and faster to fight back — until they hit their top speed. Then the electromagnets push against Earth to let the wheels slow down again.',
      },
      madeOf: {
        e: 'A brushless DC motor spinning a machined metal flywheel on precision bearings, with a motor controller and tachometer, plus the magnetorquers for desaturation.',
        x: 'Little electric motors spinning heavy metal discs on very good bearings.',
      },
      whyChosen: {
        e: 'This is the standard architecture for any CubeSat that has to point an instrument. It is the cheapest way to get genuine sub-degree, three-axis, target-of-your-choice pointing, and it needs no propellant.',
        x: 'This is what almost every camera satellite uses. It is the cheapest way to point precisely at whatever you want, and it never runs out of fuel.',
      },
      tradeoffs: {
        strengths: [
          { e: 'True three-axis control with fast slews to arbitrary targets.', x: 'Can point anywhere you want, quickly.' },
          { e: 'Sub-degree pointing, enough for imaging and directional antennas.', x: 'Steady enough for sharp photos.' },
          { e: 'No propellant — limited by wear, not by fuel.', x: 'Never runs out of fuel.' },
        ],
        limits: [
          { e: 'Bearings are the only continuously moving part on the satellite, and a wheel failure is usually permanent.', x: 'The spinning parts wear out, and if a wheel dies you cannot fix it.' },
          { e: 'Wheels draw standby power all the time, not just when slewing.', x: 'They use electricity constantly, even when just holding still.' },
          { e: 'Wheel imbalance injects jitter, which can blur a long exposure.', x: 'The spinning makes a tiny buzz that can blur photos.' },
          { e: 'Desaturation still depends on magnetorquers, so it still depends on Earth’s field.', x: 'You still need Earth’s magnetism to reset the wheels.' },
        ],
      },
      facts: [
        { label: 'Real devices', value: 'AAC Clyde Space RW210: 0.0001 Nm peak torque, 0.006 Nms momentum. Blue Canyon RWp015: 0.004 Nm, 0.015 Nms' },
        { label: 'Range', value: 'NASA SoA: reaction/momentum wheels and CMGs span 0.04–45 Nms capability across small spacecraft' },
        { label: 'Requirement', value: 'NASA SoA: "reaction wheels must be periodically desaturated using an actuator that provides an external torque, such as thrusters or magnetic torquers."' },
      ],
      flown: 'Planet Dove, FOREST, and essentially every imaging CubeSat',
      sources: ['soa-gnc'],
      tags: ['adcs:wheels', 'adcs:fine', 'adcs:fast-slew', 'adcs:standby-power', 'adcs:jitter', 'adcs:moving-parts', 'adcs:earth-only'],
    },
    {
      id: 'integrated-startracker',
      level: 'both',
      name: { e: 'Integrated ADCS with star tracker', x: 'Star-navigating autopilot' },
      blurb: { e: 'A single sealed unit: wheels, torquers, star tracker, sun sensors and the control software.', x: 'One box that looks at the stars to work out exactly which way it is facing.' },
      how: {
        e: 'A star tracker photographs a patch of sky, identifies the stars by their geometric pattern against an onboard catalogue, and from that computes absolute three-axis orientation directly — no drift, no reference to Earth. That is fundamentally better information than a magnetometer or sun sensor can give. Package that with wheels, torquers and a tuned control loop in one qualified unit and you get precise pointing without designing an ADCS yourself.',
        x: 'A tiny camera takes a photo of the stars and recognises the patterns, exactly like you would recognise the Big Dipper. Because stars never move, it knows precisely which way it is facing. All of that comes in one sealed box you just bolt on.',
      },
      madeOf: {
        e: 'A baffled camera and star catalogue processor, reaction wheels, magnetorquers, sun sensors, magnetometer and an MEMS gyro, all in one housing with a single data interface.',
        x: 'A small camera with a light shade, spinning wheels, magnets, sun detectors and a computer — all in one box.',
      },
      whyChosen: {
        e: 'Chosen when the pointing requirement is genuinely tight, or when the team does not have the expertise or schedule to build and tune an ADCS. Blue Canyon’s XACT family flew on MarCO all the way to Mars — a good demonstration that this class of unit is trusted for real missions.',
        x: 'Picked when you must point very precisely, or when your team has no time to build a pointing system from scratch. This kind of box went to Mars on the MarCO satellites.',
      },
      tradeoffs: {
        strengths: [
          { e: 'The best pointing available at this scale — arcsecond-class knowledge.', x: 'By far the most precise option.' },
          { e: 'One qualified unit removes an entire subsystem design task.', x: 'You buy it working instead of building it.' },
          { e: 'Works away from Earth, since stars are everywhere.', x: 'Works anywhere in the solar system.' },
        ],
        limits: [
          { e: 'Expensive — often the single costliest item on a CubeSat.', x: 'Very expensive.' },
          { e: 'A star tracker is blinded by the Sun and by a bright Earth limb in its field of view.', x: 'If the Sun shines into it, it goes blind for a while.' },
          { e: 'Substantial volume and standby power for a 3U.', x: 'Takes up room and uses power.' },
          { e: 'A sealed commercial unit is a black box — hard to debug when it misbehaves.', x: 'If it goes wrong, you cannot look inside to see why.' },
        ],
      },
      facts: [
        { label: 'Real unit', value: 'Blue Canyon XACT-15: wheels + star tracker + sun sensors + magnetometer, 0.885 kg, 0.003°/0.007° pointing accuracy' },
        { label: 'Star trackers', value: 'Arcsec Sagitta: 6 arcsec cross-axis accuracy, 0.275 kg. CubeSpace CubeStar: 0.02° cross-axis, 0.047 kg' },
        { label: 'Sun sensors', value: 'Digital sun sensors reach ±0.01° to ±0.05°' },
      ],
      flown: 'MarCO (XACT, to Mars), MinXSS, many science CubeSats',
      sources: ['soa-gnc', 'nasa-marco'],
      tags: ['adcs:integrated', 'adcs:very-fine', 'adcs:fast-slew', 'adcs:standby-power', 'adcs:expensive', 'adcs:works-deep-space', 'adcs:moving-parts'],
    },
    {
      id: 'gravity-gradient',
      level: 'engineer',
      name: { e: 'Gravity-gradient boom', x: 'A long pole that keeps it upright' },
      blurb: { e: 'Deploy a mass on a boom and let tidal forces hold you nadir-pointing for free.', x: 'Stick out a long arm and Earth’s pull keeps the satellite the right way up.' },
      how: {
        e: 'Gravity is very slightly stronger at the near end of a long object than the far end. That difference produces a restoring torque that pulls the long axis into alignment with the local vertical, so one face permanently looks down at Earth. Deploying a boom with a tip mass massively increases the effect by increasing the difference in moments of inertia between the long axis and the other two.',
        x: 'Earth pulls a tiny bit harder on the near end of a long satellite than the far end. That difference is enough to keep the long end pointing down at Earth — for free, forever. Sticking out a long pole makes it much stronger.',
      },
      madeOf: {
        e: 'A coilable or tape-spring boom (often carbon-fibre composite) with a tip mass, plus damping — commonly hysteresis rods or a viscous damper — to stop libration about the vertical.',
        x: 'A springy pole that unrolls, with a weight on the end, plus something to soak up the swinging.',
      },
      whyChosen: {
        e: 'It gives permanent nadir pointing at zero power and near-zero complexity. If your instrument needs to look down and does not care about rotation about the vertical, this is a beautifully economical answer.',
        x: 'It keeps your satellite looking down at Earth forever, without using any electricity at all.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Zero power, permanent nadir pointing.', x: 'Free, forever, no electricity.' },
          { e: 'No consumables and nothing to saturate.', x: 'Never runs out.' },
        ],
        limits: [
          { e: 'Only constrains two axes — the satellite can still rotate freely about the vertical.', x: 'It can still spin around like a top.' },
          { e: 'Accuracy of several degrees, with slow libration you must damp.', x: 'It swings gently, so it is never perfectly still.' },
          { e: 'The boom is a deployable mechanism and increases drag and stowed volume.', x: 'The pole has to unfold, and unfolding things can jam.' },
          { e: 'It cannot tell you which way you are facing; you still need sensors.', x: 'It does not know where it is pointing — it just points.' },
        ],
      },
      facts: [
        { label: 'Accuracy class', value: 'Several degrees, nadir-locked, uncontrolled in yaw' },
        { label: 'Booms', value: 'NASA Deployable Composite Booms offer high stiffness with "25% less weight than metallic booms"' },
      ],
      flown: 'A classic technique on early small satellites; still used where simplicity dominates',
      sources: ['soa-gnc', 'soa-struct'],
      tags: ['adcs:gravgrad', 'adcs:no-power', 'adcs:coarse', 'adcs:nadir-only', 'adcs:has-deployable', 'adcs:earth-only'],
    },
  ],
}
