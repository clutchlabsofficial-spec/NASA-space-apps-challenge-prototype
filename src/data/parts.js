// Real, buyable parts for each design choice.
//
// The honest framing this whole file rests on: you cannot buy spaceflight
// hardware with pocket money. What you CAN build is a CanSat-class working
// model — a drinks-can-sized satellite that genuinely does the same jobs
// (senses, computes, powers itself, and radios a ground station), flown under a
// drone or balloon or just run on a desk. That is a real, established
// educational format, and every part below is a thing you can actually order.
//
// Where a subsystem has no affordable equivalent, this file says so plainly
// rather than inventing one. That gap is the lesson.
//
// PRICES: quoted from the vendor's own product page, in USD, on the date below.
// They move. Every part links to its page so the live price is one tap away.

export const PRICES_CHECKED = '2026-09-06'
export const PRICE_NOTE = {
  e: 'Prices are the vendor’s own US list price on the date checked, before tax and shipping. They change, and local shops in your country will differ — every part links to its page so you can see today’s price.',
  x: 'These prices were right on the day we looked, in US dollars. Prices change, and shops in your country will be different. Tap any part to see what it costs today.',
}

const P = (name, vendor, price, url, extra = {}) => ({ name, vendor, price, url, ...extra })

// Parts shared by almost every build, listed once.
export const COMMON_PARTS = [
  P('Breadboard + jumper wire kit', 'Any electronics shop', null, 'https://www.adafruit.com/category/64', {
    why: { e: 'Lets you wire the whole satellite together with no soldering while you get it working.', x: 'Lets you plug wires in without any soldering.' },
  }),
  P('M3 nylon standoff and screw set', 'Any electronics shop', null, 'https://www.adafruit.com/product/3299', {
    why: { e: 'Boards stack on standoffs exactly as they do on a real CubeSat — this is the PC/104 idea in miniature.', x: 'Little posts that hold your circuit boards apart in a stack.' },
  }),
  P('USB cable for your board', 'Any electronics shop', null, 'https://www.adafruit.com/category/44', {
    why: { e: 'Power and programming while you are on the bench.', x: 'To plug your satellite into a computer.' },
  }),
]

/**
 * Parts keyed by the design choice they realise.
 * tier: 'budget' | 'standard' — two ways to buy the same idea.
 * buildable: false means there is genuinely no hobby equivalent, and the entry
 * explains what real engineers use instead.
 */
export const PARTS = {
  // ---------------- how you will actually fly it ----------------
  'orbit:iss': [
    P('Fly it under a drone, or on a string', 'No purchase', 0, null, {
      tier: 'budget',
      why: { e: 'Your model does not go to orbit. Flying it 30–100 m up under a drone gives you real telemetry, real radio range, and a real descent to analyse.', x: 'Your satellite will not go to space — but flying it under a drone is a real test!' },
    }),
  ],
  'orbit:sso': [
    P('High-altitude balloon kit', 'Various (search "weather balloon kit")', null, 'https://www.highaltitudescience.com/', {
      tier: 'standard',
      why: { e: 'A balloon reaches ~30 km, where the sky is black and the temperature really does hit −50 °C. This is the closest a school build gets to the environment.', x: 'A big balloon can lift your satellite so high the sky turns black!' },
      warning: { e: 'Balloon launches need permission from your national aviation authority. Never launch one without checking the rules first.', x: 'You must ask the people in charge of the sky before you launch a balloon.' },
    }),
  ],
  'orbit:vleo': [
    P('Water-rocket or model-rocket launch', 'Local hobby shop', null, 'https://www.estesrockets.com/', {
      tier: 'budget',
      why: { e: 'A short, violent flight — the closest thing to the launch environment, and the reason your build has to survive vibration.', x: 'A quick rocket flight shakes your satellite just like a real launch does.' },
      warning: { e: 'Model rocketry needs adult supervision and a clear, legal launch site.', x: 'Always launch rockets with a grown-up, in a big open space.' },
    }),
  ],

  // ---------------- payload ----------------
  'payload:thermal-ir': [
    P('AMG8833 IR Thermal Camera Breakout', 'Adafruit', 44.95, 'https://www.adafruit.com/product/3538', {
      tier: 'standard',
      spec: '8×8 thermal array, 0–80 °C, ±2.5 °C, I²C',
      why: { e: 'The same physics as a real fire-watch payload — an infrared array reading emitted heat — just at 8×8 pixels instead of a megapixel focal plane.', x: 'A real heat camera! It only has 64 dots instead of millions, but it truly sees heat.' },
    }),
    P('MLX90614 non-contact IR thermometer', 'Adafruit', null, 'https://www.adafruit.com/product/1747', {
      tier: 'budget',
      spec: 'Single-point infrared temperature',
      why: { e: 'One pixel rather than 64, but it demonstrates the identical measurement: the temperature of a distant surface, without touching it.', x: 'It measures how hot something is from far away — like a one-dot heat camera.' },
    }),
  ],
  'payload:vis-multispectral': [
    P('Raspberry Pi Camera Module 3', 'Raspberry Pi', null, 'https://www.raspberrypi.com/products/camera-module-3/', {
      tier: 'standard',
      spec: '12 MP autofocus; a NoIR version sees near-infrared',
      why: { e: 'The NoIR variant has the infrared filter removed, so with a red filter you can actually compute an NDVI-style plant-health image — the real technique, at desk scale.', x: 'The special "NoIR" version can see the hidden colour that healthy plants shine in.' },
      needs: 'Raspberry Pi Zero 2 W or similar (not a Pico)',
    }),
    P('OV2640 camera module for ESP32-CAM', 'Various', null, 'https://www.adafruit.com/product/3535', {
      tier: 'budget',
      why: { e: 'The cheapest way to get images off a microcontroller-class board.', x: 'A tiny cheap camera.' },
    }),
  ],
  'payload:sdr-receiver': [
    P('RTL-SDR Blog V4 USB dongle', 'RTL-SDR Blog', null, 'https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/', {
      tier: 'standard',
      spec: '~500 kHz – 1.7 GHz software-defined radio receiver',
      why: { e: 'This is genuinely how people receive real satellites. Point it at 137 MHz and you can decode live NOAA weather images yourself.', x: 'With this you can listen to REAL satellites flying over your house.' },
    }),
  ],
  'payload:gnss-ro': [
    P('Ultimate GPS Breakout', 'Adafruit', null, 'https://www.adafruit.com/product/746', {
      tier: 'standard',
      why: { e: 'Not radio occultation — that needs a specialist receiver — but it is real GNSS, and it teaches precise position and timing, which is half the instrument.', x: 'It works out exactly where your satellite is, using signals from space.' },
    }),
  ],
  'payload:particle-telescope': [
    P('Geiger counter kit', 'Various (search "Geiger counter kit")', null, 'https://mightyohm.com/blog/products/geiger-counter/', {
      tier: 'standard',
      why: { e: 'Detects the same class of ionising particles a space-weather instrument counts. Take it up a mountain and the count rate genuinely rises — cosmic rays, measured by you.', x: 'It clicks when a space particle hits it. Go up a mountain and it clicks faster — that is real!' },
      warning: { e: 'Buy a kit with a sealed tube. Never handle radioactive check sources without an adult who knows the rules.', x: 'Only use this with a grown-up.' },
    }),
  ],
  'payload:hyperspectral': [
    { name: 'No hobby equivalent', buildable: false, why: {
      e: 'A hyperspectral imager needs a precision slit, a diffraction grating and micron-stable alignment. There is no meaningful cheap version — this is one of the places where real space hardware is genuinely out of reach.',
      x: 'Nobody can build this one at home. Some space instruments are just too precise — and that is worth knowing.',
    } },
  ],
  'payload:ka-radar': [
    { name: 'No hobby equivalent', buildable: false, why: {
      e: 'A Ka-band radar transmits at 27–40 GHz. Building and operating a transmitter like that is both expensive and, in most countries, illegal without a licence.',
      x: 'You cannot build a space radar at home — and you are not allowed to, because it would jam other people’s radios.',
    } },
  ],

  // ---------------- structure ----------------
  'structure:1u': [
    P('3D-printed 1U frame (print it yourself)', 'Free STL, or a print service', 0, 'https://www.printables.com/search/models?q=cubesat%201u', {
      tier: 'budget',
      why: { e: 'A 10 cm cube is a small print. Real CubeSat frames are machined aluminium because plastic outgasses and creeps in vacuum — worth knowing why yours is different.', x: 'Print your own satellite frame! Real ones are metal, because plastic would not survive space.' },
    }),
    P('Laser-cut acrylic or plywood frame', 'Local makerspace', null, null, {
      tier: 'budget',
      why: { e: 'If your school has a laser cutter, flat panels and slots are faster and stiffer than printing.', x: 'A laser cutter can cut the walls out of flat sheets very quickly.' },
    }),
  ],
  'structure:3u': [
    P('3D-printed 3U frame + aluminium rails', 'Free STL + hardware shop', null, 'https://www.printables.com/search/models?q=cubesat%203u', {
      tier: 'standard',
      why: { e: 'At 34 cm long the frame starts to flex, which is exactly why real 3U structures use corner rails. Add aluminium angle and feel the difference.', x: 'A long satellite bends! That is why real ones have metal rails in the corners.' },
    }),
  ],
  'structure:6u': [
    P('Aluminium extrusion + printed corners', 'Hardware shop', null, null, {
      tier: 'standard',
      why: { e: 'At 6U scale a printed frame is no longer stiff enough to trust. This is the honest point at which the hobby build has to change material.', x: 'This size is too big for plastic — you need metal bars.' },
    }),
  ],

  // ---------------- power ----------------
  'power:body-mounted': [
    P('6V 2W Solar Panel — ETFE (Voltaic P126)', 'Adafruit', 20.95, 'https://www.adafruit.com/product/5366', {
      tier: 'standard',
      spec: '6 V, 2 W',
      why: { e: 'Silicon, not the triple-junction gallium arsenide a real satellite flies — about a third of the efficiency for a twentieth of the price.', x: 'A real solar panel! Space ones are much better, but also much more expensive.' },
    }),
    P('Small 5V solar cell (1 W)', 'Various', null, 'https://www.adafruit.com/category/141', {
      tier: 'budget',
      why: { e: 'Enough to trickle-charge while your model sits in a window.', x: 'A little panel that slowly fills your battery on a sunny windowsill.' },
    }),
  ],
  'power:deployable-fixed': [
    P('Two solar panels + printed hinges', 'Adafruit + your printer', null, 'https://www.adafruit.com/category/141', {
      tier: 'standard',
      why: { e: 'Print the hinges, hold the wings shut with cotton thread, and cut the thread with a resistor to release them — that is a burn-wire, exactly how the real thing works.', x: 'Tie the wings shut with thread, then heat a wire to burn the thread and — snap! — they open. That is what real satellites do!' },
    }),
  ],
  'power:articulated': [
    P('Micro servo (SG90) per wing', 'Various', null, 'https://www.adafruit.com/product/169', {
      tier: 'standard',
      why: { e: 'Stands in for a solar array drive assembly. It will teach you why the real thing costs what it does: the joint has to pass power and survive years of motion.', x: 'A tiny motor that turns your wings to follow the light.' },
    }),
  ],

  // ---------------- battery ----------------
  'battery:li-ion-18650': [
    P('18650 cell + holder', 'Local electronics shop', null, 'https://www.adafruit.com/product/4193', {
      tier: 'budget',
      why: { e: 'The identical cell format flown on NASA PhoneSat and the Mars Ingenuity helicopter.', x: 'The exact same kind of battery that flew on a Mars helicopter!' },
      warning: { e: 'Only ever use a proper lithium charger, never leave one charging unattended, and never puncture or short a cell.', x: 'Batteries need a grown-up. Never bend them, and never leave one charging on its own.' },
    }),
  ],
  'battery:lipo-pouch': [
    P('Lithium Ion Battery — 3.7 V 2000 mAh', 'Adafruit', 12.50, 'https://www.adafruit.com/product/2011', {
      tier: 'standard',
      spec: '3.7 V, 2000 mAh, JST-PH, protection circuit included',
      why: { e: 'Flat pouch cells fit a thin chassis, which is exactly the packaging argument real designers make.', x: 'A flat battery that slides into a thin gap.' },
      warning: { e: 'Pouch cells have no metal case. Never fold, pierce or squash one, and stop using it if it puffs up.', x: 'This battery is soft — never bend it or poke it. If it goes puffy, stop and tell a grown-up.' },
    }),
  ],
  'battery:lifepo4': [
    P('LiFePO4 14500 cell + charger', 'Various', null, null, {
      tier: 'standard',
      why: { e: 'Safer chemistry, less energy per gram — the same trade a real mission makes when the launch safety review is the binding constraint.', x: 'A much safer battery that holds a bit less power.' },
    }),
  ],
  'battery:supercap-hybrid': [
    P('Supercapacitor (1 F, 5.5 V)', 'Various', null, 'https://www.adafruit.com/product/1071', {
      tier: 'budget',
      why: { e: 'Charge it in seconds, watch it dump its energy in a flash. The best hands-on demonstration of power density versus energy density there is.', x: 'It fills up in seconds and empties in a flash — great for a big burst.' },
    }),
  ],

  // ---------------- brain ----------------
  'brain:cots-mcu': [
    P('Raspberry Pi Pico 2 W', 'Adafruit', 7.00, 'https://www.adafruit.com/product/6087', {
      tier: 'budget',
      spec: 'Dual Arm Cortex-M33 @ 150 MHz, 520 KB SRAM, Wi-Fi + Bluetooth 5.2',
      why: { e: 'An Arm Cortex-M microcontroller — the same class of part flying on real CubeSats, and it costs less than lunch. Program it in MicroPython.', x: 'A tiny computer for the price of a sandwich. Real satellites use this kind of chip!' },
    }),
    P('Arduino Nano', 'Arduino', null, 'https://store.arduino.cc/products/arduino-nano', {
      tier: 'budget',
      why: { e: 'Slower and with far less memory than the Pico, but the friendliest first board there is and it will run a simple flight loop perfectly well.', x: 'A really easy first computer to learn with.' },
    }),
  ],
  'brain:cots-soc-fpga': [
    P('Raspberry Pi Zero 2 W', 'Raspberry Pi', null, 'https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/', {
      tier: 'standard',
      spec: 'Quad-core Arm Cortex-A53 @ 1 GHz, 512 MB RAM',
      why: { e: 'Enough compute to run real onboard processing — detect the hot pixels yourself and downlink a sentence instead of an image, exactly the trick that makes a slow radio workable.', x: 'Strong enough to look at its own photos and only send home the interesting ones.' },
    }),
  ],
  'brain:rad-hard': [
    { name: 'Not buyable by the public', buildable: false, why: {
      e: 'Radiation-hardened processors are export-controlled and cost more than an entire school build. What you can do instead is imitate the architecture: add a watchdog timer to your Pico so it reboots itself when it hangs. That is the real technique.',
      x: 'You cannot buy a space-proof chip — they cost more than a car. But you CAN add a "watchdog" that restarts your satellite if it freezes, and that is what real engineers do too.',
    } },
  ],
  'brain:hybrid-cdh': [
    P('Raspberry Pi Zero 2 W + Pico 2 W as supervisor', 'Raspberry Pi + Adafruit', null, 'https://www.adafruit.com/product/6087', {
      tier: 'standard',
      why: { e: 'Wire the Pico to control power to the Zero. Now the cheap, simple part has the authority to reboot the clever one — the exact architecture modern smallsats use.', x: 'The little computer is the boss: if the big one freezes, the little one switches it off and on again.' },
    }),
  ],

  // ---------------- ADCS ----------------
  'adcs:passive-magnetic': [
    P('Neodymium bar magnet + soft-iron rod', 'Any hardware shop', null, null, {
      tier: 'budget',
      why: { e: 'Hang your model on a thread and watch it swing to align with Earth’s field, then settle. That is the whole subsystem, working, for the price of a magnet.', x: 'Hang your satellite on a string and watch the magnet turn it — just like a compass!' },
    }),
  ],
  'adcs:magnetorquers': [
    P('Enamelled copper wire (0.2 mm) for hand-wound coils', 'Any electronics shop', null, null, {
      tier: 'budget',
      why: { e: 'Wind a few hundred turns, drive it from a motor driver, and it really will twist against Earth’s field. This is a genuine magnetorquer, just a weak one.', x: 'Wind your own electromagnet! Switch it on and Earth itself pushes your satellite around.' },
    }),
  ],
  'adcs:wheels-plus-torquers': [
    P('DC motor + printed flywheel', 'Various + your printer', null, 'https://www.adafruit.com/product/711', {
      tier: 'standard',
      why: { e: 'Mount the whole model on a lazy-Susan bearing, spin the flywheel, and the body counter-rotates. Conservation of angular momentum, visible on a desk.', x: 'Spin the wheel one way and your satellite spins the other way. Try it!' },
    }),
  ],
  'adcs:integrated-startracker': [
    P('LSM6DSOX + LIS3MDL 9-DoF IMU', 'Adafruit', 19.95, 'https://www.adafruit.com/product/4517', {
      tier: 'standard',
      spec: '3-axis accelerometer, gyroscope and magnetometer',
      why: { e: 'This is the determination half of ADCS, for real: it tells you which way you are facing. A star tracker is the same job done with a camera and a star catalogue.', x: 'It always knows which way it is pointing — that is half of the job done.' },
    }),
  ],
  'adcs:gravity-gradient': [
    P('Carbon fibre rod + a weight', 'Hobby shop', null, null, {
      tier: 'budget',
      why: { e: 'Hang the model from its middle with a weighted rod below and it will hang stubbornly upright. Same physics, one gravity field down.', x: 'Put a weight on a long stick and your satellite always hangs the same way up.' },
    }),
  ],

  // ---------------- thermal ----------------
  'thermal:passive-coatings': [
    P('Kapton tape + matt white and black paint', 'Any electronics shop', null, 'https://www.adafruit.com/product/3057', {
      tier: 'budget',
      why: { e: 'Paint two identical cans, one white and one black, leave them in the sun with a thermistor in each, and log the difference. That experiment is the whole subsystem.', x: 'Paint one can white and one black, leave them in the sun, and see which gets hotter. That is real thermal engineering!' },
    }),
  ],
  'thermal:mli-straps': [
    P('Aluminised mylar (emergency blanket) + copper braid', 'Any camping shop', null, null, {
      tier: 'budget',
      why: { e: 'A survival blanket is genuinely multi-layer insulation’s cheap cousin — the same reflective principle, without the spacers.', x: 'A shiny emergency blanket works the same way as a real space blanket.' },
    }),
  ],
  'thermal:heaters': [
    P('Adhesive polyimide heater pad + 10 kΩ thermistor', 'Various', null, 'https://www.adafruit.com/product/372', {
      tier: 'standard',
      why: { e: 'Stick the pad to the battery, read the thermistor, switch the pad below 5 °C. You have just written real survival-heater flight software.', x: 'A little electric blanket for your battery, that switches itself on when it gets cold.' },
    }),
  ],
  'thermal:pcm-heatpipe': [
    P('Paraffin wax block in a metal tin', 'Any craft shop', null, null, {
      tier: 'budget',
      why: { e: 'Melting wax holds a nearly constant temperature while it melts. Put a thermistor in it, heat it, and watch the plateau on your graph.', x: 'Wax stays the same temperature while it melts — you can watch it happen on a graph!' },
    }),
  ],
  'thermal:cryocooler': [
    { name: 'No safe hobby equivalent', buildable: false, why: {
      e: 'A miniature Stirling cryocooler is a precision machine costing thousands. A Peltier module will get you 40 °C below ambient and demonstrates the idea of pumping heat, but it is not a cryocooler.',
      x: 'Real space fridges cost thousands of pounds. There is no home version.',
    } },
  ],

  // ---------------- comms ----------------
  'comms:uhf-vhf': [
    P('RFM95W LoRa Radio Breakout — 868/915 MHz', 'Adafruit', 19.95, 'https://www.adafruit.com/product/3072', {
      tier: 'standard',
      spec: 'SX1276 LoRa, 868 or 915 MHz, several km line-of-sight',
      why: { e: 'Buy two — one flies, one is your ground station. LoRa reaches kilometres at a few tens of kilobits, which is genuinely the same throughput class as a real CubeSat UHF link.', x: 'Buy two: one for the satellite and one for you. They can talk from kilometres away!' },
      warning: { e: 'Use the frequency that is licence-free where you live: 915 MHz in the Americas, 868 MHz in Europe. It is not the same everywhere.', x: 'Check which radio channel is allowed in your country before you buy.' },
      quantity: 2,
    }),
    P('nRF24L01+ transceiver pair', 'Various', null, 'https://www.adafruit.com/product/705', {
      tier: 'budget',
      why: { e: 'A few hundred metres rather than kilometres, but it is a couple of dollars and it teaches the same packet radio ideas.', x: 'A very cheap radio pair — not as far, but it works.' },
      quantity: 2,
    }),
  ],
  'comms:s-band': [
    P('Wi-Fi on the Pico 2 W (already on your board)', 'Adafruit', 0, 'https://www.adafruit.com/product/6087', {
      tier: 'budget',
      why: { e: 'Wi-Fi is 2.4 GHz, which sits right in S-band. Short range, but you are genuinely using the band real satellites use for telemetry.', x: 'Wi-Fi uses the same kind of radio waves as real satellite telemetry!' },
    }),
  ],
  'comms:x-band': [
    { name: 'Not legal to build', buildable: false, why: {
      e: 'X-band transmitters need a licence in every country. This is a real constraint on real missions too — spectrum is regulated, and that regulation is part of the engineering.',
      x: 'You are not allowed to build this one. Radio channels have rules, and that is true for real satellites too.',
    } },
  ],
  'comms:optical': [
    P('Laser diode module + photodiode (line-of-sight link)', 'Various', null, null, {
      tier: 'standard',
      why: { e: 'Send data down a laser beam across a room and you will discover the real problem instantly: aiming. That is exactly why TBIRD needs a fast steering mirror.', x: 'Send a message on a laser beam! You will find out how hard it is to aim.' },
      warning: { e: 'Class 1 or Class 2 lasers only, never pointed at anyone’s eyes, always with an adult.', x: 'Lasers can hurt eyes. Only with a grown-up, and never point it at a person.' },
    }),
  ],

  // ---------------- ground segment ----------------
  'ground:single-station': [
    P('RTL-SDR dongle + a hand-made Yagi antenna', 'RTL-SDR Blog', null, 'https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/', {
      tier: 'standard',
      why: { e: 'You can build a working Yagi out of a length of wood and some welding rod. With it and a dongle you can receive real NOAA weather satellites — pictures of your own sky, taken from orbit.', x: 'Build an antenna out of a stick and some wire, and you can catch REAL weather pictures from space.' },
    }),
  ],
  'ground:amateur-network': [
    P('Free — join the volunteer network', 'SatNOGS', 0, 'https://satnogs.org/', {
      tier: 'budget',
      why: { e: 'A worldwide network of volunteer ground stations, all open source. You can use their recordings, and you can eventually contribute a station of your own.', x: 'People all over the world share their satellite antennas for free. You can use them!' },
    }),
  ],
  'ground:commercial-network': [
    { name: 'Not for a school budget', buildable: false, why: {
      e: 'Commercial ground networks bill per pass. It is the one cost in this whole project that never stops — which is exactly why student missions build their own antenna.',
      x: 'Renting big dishes costs money every single time. That is why schools build their own antenna instead.',
    } },
  ],

  // ---------------- propulsion & disposal ----------------
  'propulsion:none-natural': [
    P('Nothing to buy', 'No purchase', 0, null, {
      tier: 'budget',
      why: { e: 'The most common choice on real CubeSats, and free. Not building something is a legitimate engineering decision.', x: 'Nothing to buy! Sometimes the best answer is not to build a thing at all.' },
    }),
  ],
  'propulsion:drag-sail': [
    P('Mylar sheet + tape-measure spring booms', 'Craft shop + hardware shop', null, null, {
      tier: 'budget',
      why: { e: 'A steel tape measure is genuinely what real deployable booms are made from — a curved strip that is stiff when extended and rolls up flat. Cut one up and see.', x: 'A tape measure is stiff when it is out and rolls up flat — that is exactly what real space booms do!' },
      warning: { e: 'Cut steel tape has sharp edges. File them, and do this bit with an adult.', x: 'Cut tape measures are sharp! Get a grown-up to help.' },
    }),
  ],
  'propulsion:cold-gas': [
    P('Compressed-air "cold gas" demo on an air table', 'School lab', null, null, {
      tier: 'standard',
      why: { e: 'A balloon on a low-friction cart is a real cold-gas thruster: stored pressure, a nozzle, and thrust. MarCO flew a grown-up version of the same idea to Mars.', x: 'A balloon on a skateboard IS a cold gas rocket. The Mars satellites used a fancy version of the same thing!' },
    }),
  ],
  'propulsion:electric': [
    { name: 'No hobby equivalent', buildable: false, why: {
      e: 'Electric thrusters need high voltage in a vacuum chamber. There is no safe home version — but an ion-wind lifter demonstrates the same principle of accelerating charged particles, and needs adult supervision and real care.',
      x: 'These need a vacuum chamber and dangerous voltages. Not one for home.',
    } },
  ],
  'propulsion:green-mono': [
    { name: 'Not safe to build', buildable: false, why: {
      e: 'Any real propellant is an energetic material. This is a hard stop, and it is the same reason launch providers scrutinise propulsion so heavily on real rideshares.',
      x: 'Rocket fuel is never a home project. Real rocket companies worry about this too!',
    } },
  ],
  'propulsion:tether': [
    P('Copper tape + a strong magnet (bench demo)', 'Hardware shop', null, null, {
      tier: 'budget',
      why: { e: 'Drop a magnet down a copper pipe and watch it fall in slow motion. That braking force is exactly what an electrodynamic tether does against Earth’s field.', x: 'Drop a magnet down a copper pipe — it falls in slow motion! That is how a space tether brakes.' },
    }),
  ],
}

/** Every part for one chosen option, or null when the choice is a design idea
 *  with no hardware of its own. */
export const partsFor = (stationId, optionId) => PARTS[`${stationId}:${optionId}`] || null

export const isBuyable = (part) => part.buildable !== false
