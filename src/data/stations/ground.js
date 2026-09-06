export const ground = {
  id: 'ground',
  multi: true,
  order: 10,
  code: 'GND',
  name: { e: 'Ground Segment & Operations', x: 'The Team on Earth' },
  subtitle: { e: 'Half the mission is on the ground, and it is the half people forget', x: 'The part of the mission that stays at home' },
  question: { e: 'Who will you talk to, and how often?', x: 'Who on Earth will listen to your satellite?' },
  primer: {
    e: 'A satellite is only half a system. The other half is the antenna, the receiver, the scheduling software and the people who read the telemetry at three in the morning when something goes wrong. Your ground segment choice sets how often you can talk to your spacecraft, and therefore how quickly you can react to a problem and how much data you can actually get down — a fast radio with only one ground station in one country is still a slow mission.',
    x: 'A satellite on its own is useless — someone on Earth has to listen to it. How many listening stations you have decides how often you can hear from your satellite, and how fast you can help if it gets into trouble. A super-fast radio does not help if nobody is listening.',
  },
  realTalk: {
    e: 'Operations is where student missions most often lose. The satellite works, but nobody planned who is on console at 4 am on a Saturday, so the first anomaly goes unnoticed for a week. NASA CubeSat 101 spends real page count on this.',
    x: 'Lots of school satellites work perfectly and still fail — because nobody was listening when they needed help. Planning who is on duty matters as much as the wiring.',
  },
  sources: ['cubesat101'],
  options: [
    {
      id: 'single-station',
      level: 'both',
      name: { e: 'One ground station you build yourself', x: 'Your own antenna on the roof' },
      blurb: { e: 'A steerable Yagi on a rooftop and a rotator controller. Total control, total dependence.', x: 'Build your own antenna and point it at the sky yourself.' },
      how: {
        e: 'A pair of crossed Yagi antennas on an azimuth-elevation rotator tracks the satellite across the sky using a predicted pass from its orbital elements. A software-defined radio and a laptop handle the modem. You get roughly four to six usable passes a day and only when the orbit brings you overhead.',
        x: 'You put an antenna on the roof on a motor that turns it to follow the satellite across the sky, using a computer prediction of where it will be. You get a handful of chances to talk each day.',
      },
      madeOf: {
        e: 'Crossed-Yagi antennas, an az-el rotator, low-noise amplifier, an SDR dongle or transceiver, and open-source tracking software. It is genuinely buildable by a school club for a modest budget.',
        x: 'Metal antenna rods, a motor to turn them, an amplifier and a computer. A school club really can build this.',
      },
      whyChosen: {
        e: 'It costs almost nothing per pass, it teaches the team enormously, and you own the whole loop. CSSWE was operated from a ground station the students built on the roof of a LASP building.',
        x: 'It is cheap, and you learn a huge amount. A student team really did run a NASA-funded satellite from an antenna they built on their own roof.',
      },
      tradeoffs: {
        strengths: [
          { e: 'No recurring cost and complete operational control.', x: 'Free to use once built, and it is all yours.' },
          { e: 'Superb learning value; the team understands the whole link.', x: 'You learn how everything really works.' },
        ],
        limits: [
          { e: 'Only 4–6 passes a day, each roughly 8–12 minutes, and only over your location.', x: 'You can only talk a few times a day, for about ten minutes each.' },
          { e: 'Weather, hardware faults and staffing all take your only station offline.', x: 'If your antenna breaks, you have no way to talk at all.' },
          { e: 'Total downlink volume is hard-capped regardless of how fast your radio is.', x: 'Even a fast radio cannot send much if you only get ten minutes a day.' },
        ],
      },
      facts: [
        { label: 'Real example', value: 'CSSWE was operated for more than two years from a student-built ground station on a LASP building roof' },
        { label: 'Pass geometry', value: 'A LEO satellite is typically in view for roughly 8–12 minutes per overhead pass' },
      ],
      flown: 'CSSWE, and most university CubeSats',
      sources: ['eo-csswe', 'cubesat101'],
      tags: ['gnd:single', 'gnd:low-contact', 'gnd:cheap', 'gnd:high-latency'],
    },
    {
      id: 'amateur-network',
      level: 'both',
      name: { e: 'Volunteer amateur-radio network', x: 'Radio hobbyists around the world' },
      blurb: { e: 'Thousands of amateur operators worldwide who will receive your beacon and upload it.', x: 'Radio fans everywhere help catch your satellite’s messages.' },
      how: {
        e: 'If you fly an amateur-band beacon with a published, open telemetry format, volunteer operators around the world receive your packets whenever you pass over them and upload them to a shared database such as SatNOGS. You effectively get a global receive network for free — but only for downlink, and only for whatever you broadcast openly.',
        x: 'Radio hobbyists all over the world point their antennas at passing satellites for fun. If you publish how to decode your satellite, they will catch your messages wherever you fly and put them on a website for you.',
      },
      madeOf: {
        e: 'Nothing extra on the spacecraft beyond an amateur-band beacon and published decoding information — plus the community relationship, which you build by coordinating your frequency through the IARU well before launch.',
        x: 'Nothing extra to build! You just have to use the hobby radio bands and tell people how to listen.',
      },
      whyChosen: {
        e: 'It transforms your contact schedule: instead of a handful of passes over one city, you get partial coverage everywhere the network reaches. For early commissioning — when you desperately want to know whether the satellite survived launch — this is invaluable.',
        x: 'Instead of only hearing your satellite when it flies over your school, you hear it from all over the world. That is amazing when you are anxiously waiting to find out if it survived launch.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Near-global receive coverage at no cost.', x: 'People everywhere listening, for free.' },
          { e: 'Enormously helpful in the first days after deployment.', x: 'Brilliant for the scary first few days.' },
        ],
        limits: [
          { e: 'Receive only — you still need your own station to command the satellite.', x: 'They can only listen; you still need your own antenna to send commands.' },
          { e: 'Restricted to amateur bands, which caps your data rate and forbids commercial use.', x: 'Only works on the hobby radio channels, which are slow.' },
          { e: 'Coverage is best-effort, not guaranteed; nobody owes you a pass.', x: 'People help when they can, but nobody has to.' },
        ],
      },
      facts: [
        { label: 'Requirement', value: 'Amateur-band use requires IARU frequency coordination and a genuine amateur-service purpose' },
        { label: 'Coverage', value: 'Volunteer networks provide global receive coverage for open beacon formats' },
      ],
      flown: 'Used by a large fraction of university CubeSats alongside their own station',
      sources: ['cubesat101', 'soa-comms'],
      tags: ['gnd:amateur', 'gnd:global-receive', 'gnd:cheap', 'gnd:uhf-only', 'gnd:no-command'],
    },
    {
      id: 'commercial-network',
      level: 'engineer',
      name: { e: 'Commercial ground-station-as-a-service network', x: 'Rent a worldwide network of dishes' },
      blurb: { e: 'Book time on somebody else’s global antenna network, pay per pass.', x: 'Pay to use big dishes all over the world.' },
      how: {
        e: 'Operators run large steerable dishes at polar and mid-latitude sites and sell scheduled contacts. You submit a pass request through an API, the network points the antenna, demodulates your downlink and delivers the bits to cloud storage. A high-latitude station is especially valuable for a polar orbit, because a satellite in a near-polar orbit passes over the poles on every single revolution.',
        x: 'Some companies own big dishes in lots of countries and rent out time on them. You book a slot, they catch your data and put it in the cloud for you. Dishes near the poles are the best, because a polar satellite flies over the poles every single lap.',
      },
      madeOf: {
        e: 'Nothing on your spacecraft beyond a standards-compliant radio — typically CCSDS-framed S-band or X-band, which is exactly why standards exist.',
        x: 'Nothing extra on the satellite, as long as your radio speaks the standard language everyone else uses.',
      },
      whyChosen: {
        e: 'Chosen when latency or volume is the mission driver. A wildfire alert is worthless six hours late; with a polar network you can be downlinking within minutes of the observation. This is why operational Earth-observation constellations do not run their own single station.',
        x: 'You need this when your news must arrive fast. A fire warning that arrives six hours late is no use to anyone.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Many contacts per day, including high-latitude stations that see every polar orbit.', x: 'Talk to your satellite many times a day.' },
          { e: 'Turns a low-latency mission from impossible into routine.', x: 'Gets urgent news home fast.' },
          { e: 'Professionally maintained; no rooftop hardware to keep working.', x: 'Someone else fixes the antennas.' },
        ],
        limits: [
          { e: 'Real recurring cost per pass — usually out of reach for a student budget.', x: 'You pay every time you use it, which adds up fast.' },
          { e: 'Requires standards-compliant framing and proper licensing.', x: 'Your radio has to follow the official rules exactly.' },
          { e: 'You are one customer among many; scheduling is not always on your terms.', x: 'You have to share with everyone else who booked.' },
        ],
      },
      facts: [
        { label: 'Why polar stations', value: 'A near-polar orbit crosses high latitudes on every revolution, so a polar ground station sees almost every pass' },
        { label: 'Standards', value: 'CCSDS framing is the interoperability standard these networks expect' },
      ],
      flown: 'Standard practice for commercial constellations including Planet and Spire',
      sources: ['soa-comms', 'eo-planet'],
      tags: ['gnd:commercial', 'gnd:high-contact', 'gnd:low-latency', 'gnd:expensive'],
    },
  ],
}
