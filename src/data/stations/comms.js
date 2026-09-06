export const comms = {
  id: 'comms',
  multi: true,
  order: 9,
  code: 'COM',
  name: { e: 'Communications', x: 'Talking to Earth' },
  subtitle: { e: 'The link that turns data into a mission', x: 'How it sends its answers home' },
  question: { e: 'What radio link will you fly?', x: 'How will your satellite talk to Earth?' },
  primer: {
    e: 'Data that stays on the spacecraft is worth nothing. In low Earth orbit a ground station sees you for only about eight to twelve minutes per pass, and you might get four to six usable passes a day — so your entire mission output is limited to what fits through that window. Higher frequencies carry more data per second, but they need tighter beams, which means better pointing and better ground antennas. That is the whole trade.',
    x: 'Everything your satellite learns is useless until it gets home. The problem is that your satellite whizzes past your ground station in about ten minutes, and then it is gone for hours. So you have a very short window to send everything. Faster radios exist, but they have to aim much more carefully.',
  },
  realTalk: {
    e: 'Radio is regulated. You cannot simply transmit: amateur bands require a licence and a genuine amateur-service purpose with coordination through the IARU, and commercial bands need a national licence such as an FCC authorisation. Many student missions choose UHF specifically because the amateur community will help them coordinate it.',
    x: 'You are not allowed to just switch on a radio in space. Every frequency has rules and you must ask permission first. Many school satellites use the ham-radio bands because ham-radio clubs around the world help them.',
  },
  sources: ['soa-comms'],
  options: [
    {
      id: 'uhf-vhf',
      level: 'both',
      name: { e: 'VHF/UHF amateur-band transceiver', x: 'Simple long-wave radio' },
      blurb: { e: 'The most-flown CubeSat radio. Slow, forgiving, and almost impossible to lose contact with.', x: 'A simple radio, like a walkie-talkie. Slow, but very hard to lose.' },
      how: {
        e: 'A low-power transceiver drives a deployable tape antenna — literally a strip of spring steel like a tape measure, rolled up and released in orbit. At these wavelengths the antenna pattern is nearly omnidirectional, so the link closes no matter which way the satellite is facing. That is the crucial property: it works even while you are still tumbling out of the deployer.',
        x: 'A small radio connected to a springy metal strip like a tape measure, curled up and released in space. The signal goes out in all directions, so it does not matter which way the satellite is facing — you can always hear it, even while it is still spinning.',
      },
      madeOf: {
        e: 'A commercial transceiver board, a burn-wire-released beryllium-copper or steel tape antenna, and a simple modulation scheme. ISISPACE tape antennas are around 89 g.',
        x: 'A small radio board and a rolled-up metal tape that springs out. The whole thing weighs less than an apple.',
      },
      whyChosen: {
        e: 'Chosen when reliability of contact matters more than throughput, and for any mission whose data is small: telemetry, decoded AIS messages, particle counts. It is also the safety net — a satellite whose main radio fails can often still be commanded on UHF.',
        x: 'Picked when you do not have much data to send, or when you simply must not lose contact. It is also the backup if the fancy radio breaks.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Near-omnidirectional: closes the link with no pointing at all.', x: 'Works whichever way the satellite is facing.' },
          { e: 'Cheap, low power, and a worldwide amateur ground-station community that will help you receive it.', x: 'Cheap, and radio hobbyists all over the world will help listen for it.' },
          { e: 'Robust to attitude loss — often the only link that still works in an emergency.', x: 'Still works even if the satellite goes out of control.' },
        ],
        limits: [
          { e: 'Very low data rate — NASA SoA lists VHF/UHF transceivers up to 38.4 kbps.', x: 'Very slow. Sending one photo could take hours.' },
          { e: 'Cannot realistically downlink imagery or hyperspectral data.', x: 'No good for cameras.' },
          { e: 'Crowded, noisy bands with interference from Earth.', x: 'Lots of other radios in the way.' },
        ],
      },
      facts: [
        { label: 'Bands', value: 'VHF: 30–300 MHz. UHF: 300–1000 MHz' },
        { label: 'Maturity', value: 'NASA SoA: "The most mature bands used for CubeSat communication are VHF and UHF frequencies."' },
        { label: 'Data rate', value: 'Up to 38.4 kbps' },
      ],
      flown: 'The default on university CubeSats worldwide',
      sources: ['soa-comms'],
      tags: ['com:uhf', 'com:low-rate', 'com:omni', 'com:no-pointing', 'com:has-deployable', 'com:low-power', 'com:robust'],
    },
    {
      id: 's-band',
      level: 'both',
      name: { e: 'S-band transceiver', x: 'Medium-speed radio' },
      blurb: { e: 'The standard telemetry and command band, and a real step up in throughput.', x: 'A faster radio that needs to aim roughly at the right place.' },
      how: {
        e: 'At 2–4 GHz the wavelength is short enough that a flat patch antenna a few centimetres across has useful gain, so you get a real data-rate improvement without a deployable. Gain means directionality, though: a higher-gain patch has a narrower beam, so now the satellite has to be pointing roughly Earthward during a pass.',
        x: 'This radio uses shorter waves, which means a small flat antenna can focus the signal instead of spraying it everywhere. Focusing makes it much faster — but now the satellite has to be facing roughly the right way when it talks.',
      },
      madeOf: {
        e: 'A patch antenna (often a small ceramic-loaded plate mounted flush to a face) and an S-band transceiver board. Patch gains typically run 6–11.5 dBi.',
        x: 'A small flat square antenna stuck to one side, plus a radio board.',
      },
      whyChosen: {
        e: 'It is the conventional choice for telemetry, tracking and command, and it hits a genuine sweet spot: enough throughput for compressed imagery or a rich science stream, without needing precise pointing or an exotic ground station. Most professional smallsat ground networks support it directly.',
        x: 'It is the middle option — much faster than the simple radio, but not so fussy that you need a perfect aim or a giant dish on the ground.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Big throughput gain over UHF for modest complexity.', x: 'Much faster than the simple radio.' },
          { e: 'No deployable antenna needed — a flush patch works.', x: 'The antenna does not need to unfold.' },
          { e: 'Supported by commercial ground-station networks worldwide.', x: 'Lots of ground stations can talk to it.' },
        ],
        limits: [
          { e: 'Needs coarse Earth pointing during the pass, so it depends on your ADCS working.', x: 'The satellite must be facing roughly the right way.' },
          { e: 'Licensing is a real process; you cannot use amateur coordination.', x: 'You need proper official permission to use it.' },
          { e: 'Higher transmit power than UHF, which hits the power budget during passes.', x: 'Uses more electricity while it talks.' },
        ],
      },
      facts: [
        { label: 'Band', value: 'S-band: 2–4 GHz. "Satellite Tracking, Telemetry & Command (TT&C) is typically conducted over S-band."' },
        { label: 'Demonstrated', value: 'NASA Near Space Network achieved 15 Mbps with 16APSK LDPC 9/10 coding on S-band' },
        { label: 'Antennas', value: 'IQ spacecom S-band high-gain patch: 11.5 dBi, 179 g' },
      ],
      flown: 'Very widely used across commercial and science smallsats',
      sources: ['soa-comms'],
      tags: ['com:sband', 'com:medium-rate', 'com:needs-coarse-pointing', 'com:no-deployable'],
    },
    {
      id: 'x-band',
      level: 'both',
      name: { e: 'X-band high-gain downlink', x: 'Fast focused radio' },
      blurb: { e: 'A narrow, high-gain beam for serious data volume. Point it properly or you get nothing.', x: 'A very fast radio that has to aim carefully, like a torch beam.' },
      how: {
        e: 'At 8–12 GHz you can build genuinely directive antennas at CubeSat scale — a horn, or a flat reflectarray whose surface pattern focuses the beam like a dish without being shaped like one. All the transmitted power goes into a narrow cone instead of spreading over the sky, which is what buys you orders of magnitude more data. The cost is that the cone is narrow, so pointing error translates directly into lost link.',
        x: 'Think of the difference between a bare light bulb and a torch. Same power, but the torch focuses it all into a beam, so it reaches much further. This radio is the torch — brilliant if you aim it right, useless if you miss.',
      },
      madeOf: {
        e: 'A horn, patch array, or deployable reflectarray, plus an X-band transmitter. MarCO flew an X-band reflectarray all the way to Mars; MMA Design’s T-DaHGR reaches 29–42.5 dBi.',
        x: 'A funnel-shaped or flat panel antenna that focuses the radio beam, plus a fast transmitter.',
      },
      whyChosen: {
        e: 'Chosen when the payload generates more data than a slower link can clear: high-resolution imagery, hyperspectral cubes, radar. It is also the deep-space workhorse, which is why MarCO used it.',
        x: 'Used when the satellite takes so many pictures that a slow radio could never send them all home in time.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Very high data rates — NASA SoA lists X-band SDR transceivers up to 6 Gbps.', x: 'Extremely fast.' },
          { e: 'Proven at planetary distance.', x: 'Good enough to reach us from Mars.' },
        ],
        limits: [
          { e: 'Requires accurate attitude control throughout the pass — this option depends on your ADCS choice.', x: 'You must be able to aim the satellite accurately, or it will not work at all.' },
          { e: 'A high-gain deployable antenna is another mechanism that can fail.', x: 'If the antenna needs to unfold, it might jam.' },
          { e: 'Higher power draw and a bigger ground antenna requirement.', x: 'Needs more power, and a bigger dish on the ground.' },
          { e: 'Rain attenuates X-band, so weather at the ground station matters.', x: 'Heavy rain at the ground station can block it.' },
        ],
      },
      facts: [
        { label: 'Band', value: 'X-band: 8–12 GHz' },
        { label: 'Real hardware', value: 'Syrlinks EWC27: X-band, 1.4 Gbps, 235 g. EnduroSat X-band 4×4 antenna: 16 dBi, 53 g' },
        { label: 'Heritage', value: 'MarCO used an X-band reflectarray to relay InSight landing telemetry from Mars' },
        { label: 'Ka-band comparison', value: 'ISARA demonstrated "over 100 Mbps downlink rate" with a Ka-band reflectarray on a 3U' },
      ],
      flown: 'MarCO; widely used on high-data-rate Earth-observation smallsats',
      sources: ['soa-comms', 'nasa-marco'],
      tags: ['com:xband', 'com:high-rate', 'com:needs-fine-pointing', 'com:high-power', 'com:directional'],
    },
    {
      id: 'optical',
      level: 'engineer',
      name: { e: 'Optical (laser) downlink', x: 'Laser beam messages' },
      blurb: { e: 'Send data on a laser beam. Staggering data rates; blocked by a single cloud.', x: 'Send information on a laser. Incredibly fast — unless a cloud gets in the way.' },
      how: {
        e: 'Beam divergence scales as wavelength divided by aperture diameter, and an optical wavelength is about ten thousand times shorter than an X-band one. So a small telescope produces a beam vastly tighter than any radio antenna of the same size — almost none of your transmitted energy is wasted lighting up empty sky. The consequence is that you now have to point a beam only a few tens of microradians wide at a specific telescope on a rotating planet, from an object moving at 7.6 km/s.',
        x: 'Light waves are thousands of times smaller than radio waves, so a small lens can squeeze a laser into an incredibly thin beam. Almost none of it is wasted. The catch: you now have to hit a specific telescope on Earth with a beam thinner than a pencil, while flying past at 7.6 kilometres every second.',
      },
      madeOf: {
        e: 'A laser transmitter, a small telescope, and a fine-pointing mechanism — often a fast steering mirror decoupled from the spacecraft body, because spacecraft ADCS alone is not steady enough.',
        x: 'A laser, a small telescope, and a tiny mirror that can twitch very fast to keep the beam on target.',
      },
      whyChosen: {
        e: 'Chosen only when the data volume is genuinely impossible by radio. TBIRD demonstrated 200 Gbps downlinks from a CubeSat — that is not an incremental improvement over X-band, it is a different category. Optical also needs no spectrum licence, which is increasingly attractive as RF bands congest.',
        x: 'Only used when there is simply too much data for any radio. One NASA experiment sent 200 billion bits every second from a CubeSat.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Data rates no radio link can approach.', x: 'Unbelievably fast.' },
          { e: 'No spectrum licensing, and the narrow beam is inherently hard to intercept or jam.', x: 'No radio licence needed, and very hard to eavesdrop on.' },
        ],
        limits: [
          { e: 'Clouds stop it dead. You need clear sky and usually a network of geographically separated stations.', x: 'A single cloud blocks it completely.' },
          { e: 'Pointing requirement is far beyond ordinary CubeSat ADCS — it needs its own fine-steering stage.', x: 'Needs far better aiming than a normal satellite can manage.' },
          { e: 'Very few ground stations exist, so access is scarce.', x: 'There are hardly any ground stations that can receive it.' },
          { e: 'Immature relative to RF: still largely demonstration missions.', x: 'Still mostly an experiment, not everyday technology.' },
        ],
      },
      facts: [
        { label: 'Record', value: 'MIT Lincoln Laboratory TBIRD: "200 Gbps downlinks" — the most advanced demonstrated' },
        { label: 'Other demos', value: 'Aerospace Corp OCSD: 200 Mbps from a 1.5U to a 40 cm ground station. DLR OSIRISv2: 1 Gbps' },
        { label: 'Crosslinks', value: 'MIT CLICK-A demonstrated 20 Mbps at 25–580 km separation' },
      ],
      flown: 'TBIRD, OCSD, OSIRIS, CLICK',
      sources: ['soa-comms', 'nasa-tbird'],
      tags: ['com:optical', 'com:extreme-rate', 'com:needs-extreme-pointing', 'com:weather-dependent', 'com:immature'],
    },
  ],
}
