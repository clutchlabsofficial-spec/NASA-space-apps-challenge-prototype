export const payload = {
  id: 'payload',
  order: 2,
  code: 'PL',
  name: { e: 'Payload — the Instrument', x: 'The Job Tool' },
  subtitle: { e: 'The one part that is not there to keep the satellite alive', x: 'The part that actually does the job' },
  question: { e: 'What instrument will you fly?', x: 'What will your satellite use to do its job?' },
  primer: {
    e: 'Everything else on a satellite exists to serve the payload. Engineers say the payload drives the bus: the instrument decides how much power you need, how steadily you must point, how cold something has to be kept, and how much data you must get to the ground. That is why real teams pick the instrument early and design the rest of the spacecraft around it.',
    x: 'The payload is the tool that does the actual job — a camera, a radio ear, a particle counter. Everything else on the satellite is there to look after it: keep it powered, keep it pointed the right way, keep it at the right temperature, and send its results home.',
  },
  realTalk: {
    e: 'You can absolutely fly an instrument that does not match your mission. The satellite will work perfectly and return data nobody needs. Mission failure is usually not hardware failure.',
    x: 'You can pick any tool you like — but if it is the wrong tool for the job, your satellite will work fine and still not answer your question.',
  },
  sources: ['cubesat101'],
  options: [
    {
      id: 'thermal-ir',
      level: 'both',
      name: { e: 'Uncooled thermal infrared imager', x: 'Heat camera' },
      blurb: { e: 'A microbolometer array that images emitted heat, not reflected sunlight.', x: 'A camera that sees how hot things are, even in the dark.' },
      how: {
        e: 'Each pixel is a tiny suspended membrane whose electrical resistance changes when infrared radiation warms it by a fraction of a degree. Because the scene is glowing in the infrared by itself rather than reflecting sunlight, the instrument works at night and sees straight through smoke, which scatters visible light but is fairly transparent in the long-wave infrared.',
        x: 'Inside the camera are millions of tiny pads. When heat rays land on a pad it warms up a tiny bit, and the camera notices. Because hot things glow with heat rays all by themselves, it works at night — and smoke does not block it.',
      },
      madeOf: {
        e: 'Vanadium oxide or amorphous silicon microbolometer membranes on a silicon readout chip, behind germanium or chalcogenide glass optics — ordinary glass is opaque in the thermal infrared, so the lenses look like polished metal.',
        x: 'The lens is not made of glass — glass blocks heat rays. It is made of a shiny metal-looking material called germanium.',
      },
      whyChosen: {
        e: 'Uncooled means no cryocooler, which is the single biggest reason thermal imaging is now practical on a CubeSat. You trade sensitivity for an instrument that fits in a few units and runs on a couple of watts. OroraTech pairs long-wave and mid-wave channels so it can catch both hot open flame and cooler smouldering ground.',
        x: 'Some heat cameras need a fridge inside them, which is big and heavy. This kind does not — which is why it fits in a satellite the size of a cereal box.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Works at night and through smoke — the only option here that does.', x: 'Works in the dark and through smoke.' },
          { e: 'No cryocooler: low power, no moving parts, no vibration.', x: 'No fridge needed, so it stays small and quiet.' },
        ],
        limits: [
          { e: 'Much less sensitive than a cooled detector; coarser ground resolution than a visible camera of the same size.', x: 'Pictures are blurrier than a normal camera.' },
          { e: 'The detector needs a stable, known temperature, so it hands a real problem to the thermal subsystem.', x: 'It only works well if you keep it at a steady temperature.' },
          { e: 'Cannot tell you the colour of anything or read a licence plate — it only measures heat.', x: 'It only sees heat — no colours.' },
        ],
      },
      facts: [
        { label: 'Real performance', value: 'OroraTech SAFIRE: ~410 km combined swath, 200 m ground sampling distance, two LWIR + one MWIR channel' },
        { label: 'Accuracy', value: '±1 °C absolute temperature accuracy' },
        { label: 'Detects', value: 'Fire hotspots as small as ~4 m × 4 m' },
      ],
      flown: 'OroraTech FOREST-1 (3U) and FOREST-2 (6U)',
      sources: ['eo-ororatech'],
      tags: ['payload:thermal-ir', 'need:thermal-stability', 'need:pointing-moderate', 'need:medium-data', 'cap:sees-heat', 'cap:night', 'cap:through-smoke'],
    },
    {
      id: 'vis-multispectral',
      level: 'both',
      name: { e: 'Visible / near-infrared multispectral imager', x: 'Colour camera (plus a secret colour)' },
      blurb: { e: 'A telescope and CCD/CMOS sensor imaging a handful of chosen colour bands.', x: 'A camera that sees normal colours and one extra colour plants love.' },
      how: {
        e: 'Sunlight reflects off the ground into a compact telescope and onto an imaging sensor filtered into discrete bands — typically blue, green, red and near-infrared. Comparing bands is the whole point: healthy chlorophyll absorbs red strongly and reflects near-infrared strongly, so the red/NIR ratio maps plant vigour.',
        x: 'It is a telescope with a camera behind it. It takes several photos at once in different colours, including one our eyes cannot see. Healthy leaves shine brightly in that hidden colour, so the satellite can tell healthy plants from sick ones.',
      },
      madeOf: {
        e: 'Aluminium or carbon-fibre telescope barrel, glass or mirror optics, a silicon CMOS or CCD focal plane, and interference filters. The barrel material matters: it must not change focus as the satellite swings between sunlight and eclipse.',
        x: 'A tube, some lenses or mirrors, and a light sensor like the one in a phone camera — but much better made.',
      },
      whyChosen: {
        e: 'It is the highest information-per-kilogram instrument for land applications, and silicon detectors are cheap, mature and need no cooling. Planet built a business on flying hundreds of them on 3U buses.',
        x: 'Cameras like this are the most useful for looking at land, and the parts are cheap and well understood.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Excellent resolution for the size: ~3–5 m from a 3U bus.', x: 'Very sharp pictures for such a small satellite.' },
          { e: 'Mature, inexpensive, no cooling required.', x: 'Cheap and reliable.' },
        ],
        limits: [
          { e: 'Blind at night and blocked by cloud and smoke — it needs reflected sunlight.', x: 'Useless at night, and clouds and smoke get in the way.' },
          { e: 'Image data is large, so it forces a high-rate downlink and onboard storage.', x: 'Photos are big files, so you need a fast radio to send them home.' },
          { e: 'Needs steady pointing during exposure or the image smears.', x: 'If the satellite wobbles, the photo comes out blurry.' },
        ],
      },
      facts: [
        { label: 'Real performance', value: 'Planet Dove: ~3–5 m spatial resolution from a 3U, ~5.2 kg satellite' },
        { label: 'Operating orbit', value: '475–525 km sun-synchronous' },
      ],
      flown: 'Planet Dove and SuperDove — the largest Earth-imaging constellation ever flown',
      sources: ['eo-planet'],
      tags: ['payload:vis', 'need:pointing-tight', 'need:high-data', 'need:sunlight', 'cap:sees-colour', 'cap:high-res'],
    },
    {
      id: 'hyperspectral',
      level: 'engineer',
      name: { e: 'Hyperspectral imager', x: 'Super-colour camera' },
      blurb: { e: 'Splits incoming light into dozens or hundreds of narrow bands per pixel.', x: 'Sees hundreds of colours instead of three.' },
      how: {
        e: 'A slit and a dispersing element (a prism or diffraction grating) spread each ground line into a spectrum across the detector, so every pixel carries a continuous spectral curve rather than three or four numbers. Materials have narrow absorption features, so you can identify what something is made of, not just what colour it looks.',
        x: 'Instead of red, green and blue, it splits the light into hundreds of tiny colour slices — like a rainbow for every dot on the ground. Different materials make different rainbow patterns, so you can tell what things are made of.',
      },
      madeOf: {
        e: 'Precision slit, grating or prism, relay optics and a large-format detector, all in a housing that must hold alignment to microns through launch vibration and thermal cycling.',
        x: 'Very precisely made mirrors and a special grooved surface that splits light into a rainbow. Everything must stay perfectly lined up.',
      },
      whyChosen: {
        e: 'Chosen when the question is "what is it made of", not "where is it": mineral mapping, crop species and disease discrimination, water quality, methane plumes.',
        x: 'Used when you need to know exactly what something is made of — like which crop it is, or whether water is polluted.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Identifies materials and plant species, not just brightness.', x: 'Can tell what things actually are.' },
          { e: 'One instrument serves many science questions.', x: 'Useful for lots of different jobs.' },
        ],
        limits: [
          { e: 'Enormous data volume — the hardest downlink problem of any payload here.', x: 'Makes gigantic files that are hard to send home.' },
          { e: 'Each narrow band collects little light, so it needs long integration and very stable pointing.', x: 'Needs to hold very still while it works.' },
          { e: 'Alignment sensitivity makes it the hardest instrument on this list to build and calibrate.', x: 'Very hard to build and keep working.' },
        ],
      },
      facts: [
        { label: 'Trade', value: 'Spectral detail is bought with light: more bands means less signal per band' },
      ],
      flown: 'Flown on small satellites such as ESA’s HyperScout and several 6U/12U commercial demonstrators',
      sources: ['soa-struct'],
      tags: ['payload:hyperspectral', 'need:pointing-tight', 'need:very-high-data', 'need:sunlight', 'need:volume', 'cap:sees-colour', 'cap:identifies-materials'],
    },
    {
      id: 'sdr-receiver',
      level: 'both',
      name: { e: 'Software-defined radio receiver (AIS / ADS-B)', x: 'Big listening ear' },
      blurb: { e: 'A wideband radio that listens for beacons transmitted by ships and aircraft.', x: 'Listens for the radio messages ships and planes send out.' },
      how: {
        e: 'An antenna and low-noise front end feed a digitiser; from there the signal is software, not hardware, so one radio can be reprogrammed in orbit to decode different message formats. The hard part is collision: from 400 km you hear thousands of ships at once on the same VHF channels, so the decoder must pull overlapping messages apart.',
        x: 'It is a radio where the tuning is done by a computer program instead of knobs, so you can teach it new things after launch. The tricky bit is that from space you hear thousands of ships shouting at once, and you have to untangle them.',
      },
      madeOf: {
        e: 'A deployable VHF antenna, a low-noise amplifier, a fast analogue-to-digital converter and an FPGA or SoC doing the demodulation. Very little of it is exotic — it is closer to consumer radio hardware than to space optics.',
        x: 'A long thin antenna, an amplifier, and a small computer that does the listening.',
      },
      whyChosen: {
        e: 'It is the only payload here that works equally well over open ocean, at night, and through cloud, because it does not care about light at all. It is also low power and generates modest data volumes — decoded messages are tiny compared to images.',
        x: 'It works over the middle of the ocean, at night, and through clouds, because it does not need light at all. And the messages it collects are small, so they are easy to send home.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Weather- and light-independent; tiny data volume.', x: 'Works any time, and sends home small files.' },
          { e: 'Reprogrammable in orbit — the mission can change after launch.', x: 'You can teach it new tricks while it is flying.' },
          { e: 'Low pointing requirement: a broad antenna pattern is often enough.', x: 'It does not need to aim carefully.' },
        ],
        limits: [
          { e: 'Message collision in dense shipping lanes limits detection rate.', x: 'In busy places, so many ships talk at once that some get missed.' },
          { e: 'Only sees things that choose to broadcast — a ship with its transponder off is invisible.', x: 'If a ship turns its radio off, you cannot hear it.' },
          { e: 'Deployable antennas are a mechanism, and mechanisms are what fail.', x: 'The antenna has to unfold, and unfolding things can jam.' },
        ],
      },
      facts: [
        { label: 'Real system', value: 'Spire Lemur-2 (3U, ~4.6 kg) flies SENSE (AIS) plus an ADS-B receiver and STRATOS GNSS' },
        { label: 'Fleet', value: '100+ Lemur satellites operating at 400–600 km' },
      ],
      flown: 'Spire Global Lemur-2 constellation',
      sources: ['eo-spire'],
      tags: ['payload:sdr', 'need:pointing-loose', 'need:low-data', 'need:deployable-antenna', 'cap:listens-radio', 'cap:all-weather'],
    },
    {
      id: 'gnss-ro',
      level: 'both',
      name: { e: 'GNSS radio occultation receiver', x: 'Bendy-radio weather sensor' },
      blurb: { e: 'Measures how GPS signals bend through the atmosphere to profile it.', x: 'Watches GPS signals bend through the air to measure the weather.' },
      how: {
        e: 'As a GPS satellite sets behind Earth’s limb from your point of view, its signal grazes deeper and deeper through the atmosphere. Denser, wetter air bends the ray more. By timing the phase delay precisely as the geometry changes, you can invert the bending profile into temperature, pressure and humidity versus altitude — a vertical sounding, self-calibrating and cloud-proof.',
        x: 'Radio signals bend when they pass through air, and they bend more through thick or damp air. The satellite watches a GPS signal slide down behind the Earth and measures how much it bends, which tells it what the air is like all the way up.',
      },
      madeOf: {
        e: 'High-gain limb-pointing antennas fore and aft, a precision GNSS receiver and a very stable clock. The instrument is mostly signal processing; the physics does the calibration for you.',
        x: 'Two antennas pointing forward and backward, a very accurate GPS receiver and a very good clock.',
      },
      whyChosen: {
        e: 'Radio occultation data is exceptionally valuable to weather forecast models because it needs no on-orbit calibration — the measurement is a time delay, traceable to an atomic clock. It works through cloud, at night, over ocean.',
        x: 'Weather forecasters love this data because it never needs adjusting — it measures time, and clocks do not drift the way cameras do.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Self-calibrating, all-weather, day and night.', x: 'Always works, and never needs fixing.' },
          { e: 'Small data volume and modest power.', x: 'Small files, not much electricity.' },
        ],
        limits: [
          { e: 'You get profiles at scattered occultation points, not a continuous image — coverage is statistical.', x: 'You get readings in scattered spots, not a whole picture.' },
          { e: 'Needs precise orbit determination and timing, which pushes work onto the brain and ADCS.', x: 'You must know exactly where your satellite is, very precisely.' },
          { e: 'Cannot see the ground itself.', x: 'It cannot take pictures of the ground.' },
        ],
      },
      facts: [
        { label: 'Real system', value: 'Spire STRATOS GNSS receiver: radio occultation for weather models, plus precise orbit determination' },
        { label: 'Bus', value: '3U CubeSat, ~4.6 kg' },
      ],
      flown: 'Spire Lemur-2; COSMIC-2 flies the same technique on larger satellites',
      sources: ['eo-spire'],
      tags: ['payload:gnss-ro', 'need:pointing-moderate', 'need:low-data', 'need:precise-timing', 'cap:profiles-atmosphere', 'cap:all-weather'],
    },
    {
      id: 'particle-telescope',
      level: 'both',
      name: { e: 'Energetic particle telescope / X-ray spectrometer', x: 'Space-storm counter' },
      blurb: { e: 'Counts and sorts high-energy particles or measures solar X-ray flares.', x: 'Counts the tiny fast bits the Sun throws at us.' },
      how: {
        e: 'A stack of solid-state silicon detectors sits behind a collimator. A particle entering along the accepted direction deposits energy in successive layers; the pattern of deposits identifies both the particle type and its energy. An X-ray spectrometer instead uses a silicon drift detector to record the energy of each arriving photon, building a spectrum one photon at a time.',
        x: 'It is a stack of thin detector layers. When a fast particle from the Sun crashes through, each layer feels a little of the hit, and the pattern tells the satellite what it was and how fast it was going.',
      },
      madeOf: {
        e: 'Silicon detector wafers, a tungsten or tantalum collimator and shielding to reject particles arriving from the wrong direction, and low-noise charge-sensitive amplifiers.',
        x: 'Thin slices of silicon plus a heavy metal tube that blocks anything coming from the wrong direction.',
      },
      whyChosen: {
        e: 'This is the classic instrument class that made CubeSats scientifically respectable: CSSWE and MinXSS both produced peer-reviewed results from 3U university builds. Particle instruments are small, low-data and do not need pointing accuracy in the imaging sense.',
        x: 'Student teams have flown these and made real scientific discoveries with them — proof that a tiny satellite can do serious science.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Genuinely achievable science from a 3U student build.', x: 'A school team can really do this.' },
          { e: 'Tiny data volume; no imaging-grade pointing needed.', x: 'Small files, no need to aim precisely.' },
        ],
        limits: [
          { e: 'The instrument sits in the radiation it measures, so the electronics degrade over the mission.', x: 'The same radiation it measures slowly damages it.' },
          { e: 'Measures only along your own orbit track — you learn about where you are, not the whole planet at once.', x: 'It only knows about the space it is flying through right now.' },
          { e: 'Shielding is dense, and density is mass.', x: 'The metal shield is heavy.' },
        ],
      },
      facts: [
        { label: 'Real instrument', value: 'REPTile on CSSWE (3U) — a miniature version of the REPT instrument flown on NASA’s Van Allen Probes' },
        { label: 'Real mission', value: 'MinXSS-1 soft X-ray spectrometer, 3U, operated 2016-05-16 to 2017-05-06' },
        { label: 'Team', value: 'CSSWE involved more than 65 CU Boulder students' },
      ],
      flown: 'CSSWE (2012), MinXSS-1 and MinXSS-2',
      sources: ['eo-csswe', 'eo-minxss'],
      tags: ['payload:particles', 'need:pointing-loose', 'need:low-data', 'need:rad-tolerance', 'cap:detects-particles'],
    },
    {
      id: 'ka-radar',
      level: 'engineer',
      name: { e: 'Ka-band precipitation radar', x: 'Storm X-ray machine' },
      blurb: { e: 'An active radar that transmits and listens for the echo from raindrops.', x: 'Shouts at a storm and listens for the echo.' },
      how: {
        e: 'Unlike every other payload here, this one is active: it transmits a pulse and measures the echo from precipitation, so it builds a vertical profile of what is inside a cloud. Ka-band is short enough in wavelength that raindrops scatter strongly, which is what lets the antenna be small enough to fold into a CubeSat.',
        x: 'Instead of just looking, it shouts a radio pulse at a cloud and listens for the echo bouncing off the raindrops inside. That tells it where the rain is, not just where the cloud is.',
      },
      madeOf: {
        e: 'A deployable parabolic mesh reflector, a transmitter chain and a receiver. JPL’s RainCube proved a 6U could carry the whole thing — the antenna folds into a fraction of a unit and unfurls in orbit.',
        x: 'A folding dish antenna that opens up like an umbrella once it is in space, plus a radio transmitter.',
      },
      whyChosen: {
        e: 'It is the only way to see the internal structure of a storm rather than its cloud top, and it works at night. RainCube existed largely to prove miniaturised radar was possible at all.',
        x: 'It is the only tool here that can see inside a storm instead of just looking at the top of the clouds.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Sees inside precipitation; works day and night, through cloud.', x: 'Sees inside storms, day or night.' },
          { e: 'Proven at 6U scale.', x: 'Already been done on a small satellite.' },
        ],
        limits: [
          { e: 'Active transmission is by far the largest power draw of any payload here.', x: 'Uses a lot of electricity because it has to shout.' },
          { e: 'Requires a deployable antenna — the highest-risk mechanism on the spacecraft.', x: 'Needs a folding dish, and folding things can get stuck.' },
          { e: 'Will not fit a 1U or 3U; 6U minimum.', x: 'Too big for a small satellite.' },
        ],
      },
      facts: [
        { label: 'Real mission', value: 'NASA JPL RainCube — 6U CubeSat with a deployable Ka-band radar antenna' },
        { label: 'Band', value: 'Ka-band: 27–40 GHz' },
      ],
      flown: 'RainCube (deployed from the ISS, 2018)',
      sources: ['jpl-raincube', 'soa-comms'],
      tags: ['payload:radar', 'need:high-power', 'need:volume-6u', 'need:deployable-antenna', 'need:pointing-moderate', 'need:medium-data', 'cap:sees-inside-storms', 'cap:all-weather'],
    },
  ],
}
