import { tagsFor, getOption } from '../data/stations/index.js'

// Qualitative coupling between subsystems. No scores, no numbers invented —
// each rule states a real engineering consequence of a combination of choices.
//
//   station : where the note appears as an incoming constraint
//   needs   : every tag must be present
//   without : none of these tags may be present
//   kind    : 'good' (a choice that pays off) | 'tension' (a real cost you
//             have accepted) | 'blocker' (this combination does not work)

export const RULES = [
  // ---- payload drives the bus -------------------------------------------
  {
    id: 'ir-needs-thermal-stability',
    station: 'thermal',
    kind: 'tension',
    needs: ['payload:thermal-ir'],
    title: { e: 'Your detector is a thermometer, so its own temperature matters', x: 'Your heat camera needs to stay a steady temperature' },
    body: {
      e: 'A microbolometer measures incoming infrared as a tiny change in its own temperature. If the detector itself drifts, that looks exactly like the scene changing. Real thermal imagers hold the focal plane at a controlled temperature or continuously recalibrate against a known reference, which is why a purely passive thermal design is a genuine risk here.',
      x: 'Your heat camera works by letting heat rays warm up tiny pads inside it. So if the camera itself gets warmer or colder, it gets confused and thinks the ground changed. It needs help staying at a steady temperature.',
    },
  },
  {
    id: 'imaging-needs-pointing',
    station: 'adcs',
    kind: 'tension',
    needs: ['need:pointing-tight'],
    title: { e: 'Your instrument needs the image not to smear', x: 'Your camera needs the satellite to hold very still' },
    body: {
      e: 'You are moving at roughly 7.6 km/s. During an exposure, any rotation of the spacecraft drags the scene across the focal plane and smears the image. Passive stabilisation and magnetorquers alone control attitude to degrees; imaging needs the residual rate held far tighter than that.',
      x: 'Your satellite is racing along at about 7.6 kilometres every second. If it wobbles even slightly while the camera is taking a photo, the picture comes out blurry — like taking a photo from a moving car.',
    },
  },
  {
    id: 'radio-payload-loose-pointing',
    station: 'adcs',
    kind: 'good',
    needs: ['need:pointing-loose'],
    title: { e: 'Your payload lets you off lightly here', x: 'Your tool does not need careful aiming' },
    body: {
      e: 'A wide-beam radio receiver or a particle detector does not care about fractions of a degree. That means you can honestly choose a simple, low-power, low-risk attitude system and spend the mass, power and money somewhere that actually matters.',
      x: 'Radio ears and particle counters do not need to be aimed carefully. So you can pick a simple pointing system and save your effort for something else.',
    },
  },
  {
    id: 'radar-needs-power',
    station: 'power',
    kind: 'tension',
    needs: ['need:high-power'],
    title: { e: 'An active instrument has to make its own signal', x: 'Your tool has to shout, and shouting costs power' },
    body: {
      e: 'Every other payload here collects energy that was already there. A radar has to generate it. That transmit pulse is the largest electrical load on the spacecraft and it comes in bursts, so both the array and the energy store have to be sized for it.',
      x: 'Most space tools just look and listen, which is easy. Yours has to shout at the storm and listen for the echo — and shouting takes a lot of electricity.',
    },
  },
  {
    id: 'nadir-payload-gravgrad',
    station: 'adcs',
    kind: 'good',
    needs: ['adcs:gravgrad', 'need:pointing-moderate'],
    title: { e: 'Gravity will do your pointing for free', x: 'Earth’s pull can point it for you' },
    body: {
      e: 'Your instrument needs to look down, and that is exactly the one direction a gravity-gradient boom gives you for no power at all. You still cannot control rotation about the vertical, so check whether your instrument cares about that.',
      x: 'Your tool needs to look down at Earth, and that is exactly what a long pole gives you for free. It can still spin like a top though, so check if that matters.',
    },
  },

  // ---- data volume vs. downlink ----------------------------------------
  {
    id: 'high-data-needs-fast-link',
    station: 'comms',
    kind: 'tension',
    needs: ['need:high-data'],
    without: ['cdh:onboard-processing'],
    title: { e: 'Your payload makes more data than a slow link can clear', x: 'Your tool makes big files, and slow radios cannot send them' },
    body: {
      e: 'You see your ground station for roughly eight to twelve minutes per pass, a handful of times a day. An imaging payload can fill its storage in a single orbit. Either the link has to be fast, or the spacecraft has to throw most of the data away intelligently before it ever reaches the radio.',
      x: 'You only get about ten minutes to talk, a few times a day. A camera can fill up its memory in one lap around Earth. So either you need a much faster radio, or the satellite has to be clever and only send the interesting bits.',
    },
  },
  {
    id: 'very-high-data-warning',
    station: 'comms',
    kind: 'tension',
    needs: ['need:very-high-data'],
    title: { e: 'Hyperspectral data is the hardest downlink problem on this list', x: 'Super-colour photos are enormous' },
    body: {
      e: 'Every pixel carries a full spectrum instead of three or four numbers, so the raw data volume is one to two orders of magnitude above a normal imager. Real hyperspectral smallsats compress aggressively onboard and often downlink only selected scenes.',
      x: 'Instead of three colours per dot, you are saving hundreds. That makes files so big that real satellites have to squash them or pick only the best pictures to send.',
    },
  },
  {
    id: 'onboard-processing-saves-link',
    station: 'comms',
    kind: 'good',
    needs: ['cdh:onboard-processing', 'need:high-data'],
    title: { e: 'Your brain can shrink the downlink problem', x: 'Your clever computer makes the radio problem smaller' },
    body: {
      e: 'Because you chose a processor that can do real work onboard, you do not have to downlink raw frames. Detecting the hotspots or the change and sending a few kilobytes of coordinates instead of a gigabyte of imagery turns an impossible link budget into an easy one — this is exactly what onboard AI demonstrations like RaVAEn were for.',
      x: 'Your satellite is smart enough to look at its own pictures first. Instead of sending the whole photo, it can send a short message saying "there is a fire, right here" — which is thousands of times smaller.',
    },
  },
  {
    id: 'uhf-vs-imaging',
    station: 'comms',
    kind: 'blocker',
    needs: ['com:uhf', 'need:high-data'],
    without: ['cdh:onboard-processing'],
    title: { e: 'This link cannot carry this payload', x: 'This radio is far too slow for this camera' },
    body: {
      e: 'At up to 38.4 kbps and a few short passes a day, a UHF link moves on the order of a few megabytes a day. A single uncompressed image from your payload exceeds that. Without onboard data reduction or a faster link, most of what you collect will never reach the ground.',
      x: 'This radio can send about as much in a whole day as one single photo takes up. Almost everything your camera sees would be thrown away, never seen by anyone.',
    },
  },

  // ---- pointing vs. link -----------------------------------------------
  {
    id: 'directional-link-needs-adcs',
    station: 'comms',
    kind: 'tension',
    needs: ['com:needs-fine-pointing', 'adcs:coarse'],
    title: { e: 'A narrow beam and a coarse attitude system do not go together', x: 'A focused radio beam needs careful aiming' },
    body: {
      e: 'A high-gain antenna concentrates its power into a narrow cone. That gain is exactly why the link is fast — and exactly why a pointing error of a few degrees means the ground station hears nothing at all. Your current attitude control works to degrees, not fractions of one.',
      x: 'This radio works like a torch beam instead of a light bulb. That is why it is fast — but if the satellite is even a few degrees off, the beam misses Earth’s antenna completely and nobody hears anything.',
    },
  },
  {
    id: 'optical-needs-fine-steering',
    station: 'comms',
    kind: 'tension',
    needs: ['com:optical'],
    title: { e: 'No CubeSat ADCS alone is steady enough for a laser link', x: 'Even the best pointing system is not steady enough for a laser' },
    body: {
      e: 'An optical downlink beam is tens of microradians wide. Even an arcsecond-class star-tracker ADCS is a coarse pre-pointing stage for that; flight terminals add their own fast steering mirror with a beacon-tracking loop to close the last bit. Treat the laser terminal as bringing its own pointing system.',
      x: 'A laser beam is unbelievably thin. Even the very best satellite pointing is only good enough to get roughly close — the laser box has to have its own tiny wobbling mirror to finish the job.',
    },
  },
  {
    id: 'passive-adcs-good-for-omni',
    station: 'comms',
    kind: 'good',
    needs: ['adcs:no-target-choice', 'com:omni'],
    title: { e: 'Your radio does not care which way you are facing', x: 'This radio works whichever way you point' },
    body: {
      e: 'An omnidirectional tape antenna closes the link regardless of attitude. Paired with a passive attitude system this is an extremely robust combination — it is also why UHF is the link that still works when everything else has gone wrong.',
      x: 'This antenna sends signals in every direction, so it does not matter how the satellite is facing. That is why it still works even if the satellite is tumbling.',
    },
  },

  // ---- power coupling ---------------------------------------------------
  {
    id: 'wheels-cost-power',
    station: 'power',
    kind: 'tension',
    needs: ['adcs:standby-power'],
    title: { e: 'Your attitude system draws power continuously', x: 'Your spinning wheels use power all the time' },
    body: {
      e: 'Reaction wheels are not free once you stop slewing. They spin constantly to hold attitude against disturbance torques, so they are an always-on load in your orbit-average power budget — not a peak load you can schedule away.',
      x: 'The wheels do not stop when you are pointing the right way. They keep spinning to hold the satellite steady, so they keep drinking electricity the whole time.',
    },
  },
  {
    id: 'body-mount-vs-hungry-payload',
    station: 'power',
    kind: 'blocker',
    needs: ['power:body', 'need:high-power'],
    title: { e: 'Body-mounted cells cannot feed this payload', x: 'Panels on the walls cannot power this tool' },
    body: {
      e: 'Body-mounted power is capped by the outside area of the satellite, and most of that area is facing away from the Sun at any moment. An active instrument like a radar needs an order of magnitude more than that ceiling allows.',
      x: 'A small satellite has small walls, so panels stuck on them only make a little power. Your tool needs far more than that.',
    },
  },
  {
    id: 'electric-prop-needs-power',
    station: 'propulsion',
    kind: 'tension',
    needs: ['prop:high-power', 'power:low'],
    title: { e: 'An electric thruster is a power system problem, not a propulsion problem', x: 'An electric engine needs lots of electricity' },
    body: {
      e: 'Electric propulsion converts electrical power into exhaust velocity. With a body-mounted array you simply do not have the power to run the thruster and the payload, so in practice you would be alternating between thrusting and doing science.',
      x: 'An electric engine runs on electricity, and you do not have much. You would have to choose: push the satellite, or use your tool — never both at once.',
    },
  },
  {
    id: 'cryo-power',
    station: 'power',
    kind: 'tension',
    needs: ['tcs:very-high-power'],
    title: { e: 'A cryocooler runs continuously and dominates the power budget', x: 'A fridge in space never stops running' },
    body: {
      e: 'Unlike a transmitter, a cryocooler cannot be scheduled — the detector must stay cold whenever you want to observe, and cooling back down after a warm-up costs hours. It is a continuous load that sets the size of your array.',
      x: 'You cannot switch the fridge off between jobs, because it takes hours to get cold again. So it uses power constantly, and your solar panels have to be big enough for that.',
    },
  },
  {
    id: 'heater-power-in-eclipse',
    station: 'power',
    kind: 'tension',
    needs: ['tcs:uses-power'],
    title: { e: 'Heater power is drawn at the worst possible moment', x: 'The heater switches on exactly when you have least power' },
    body: {
      e: 'Survival heaters run in eclipse, which is precisely when you are generating nothing and running on the battery. Heater energy therefore sizes the battery as well as the array — it is one of the classic CubeSat power-budget surprises.',
      x: 'Heaters turn on when it is cold, and it is coldest in Earth’s shadow — which is exactly when your solar panels make no power at all. So the heater drains the battery just when you need it most.',
    },
  },
  {
    id: 'pulse-load-supercap',
    station: 'battery',
    kind: 'good',
    needs: ['need:high-power', 'bat:pulse'],
    title: { e: 'This is the right store for a pulsed load', x: 'Perfect match for a tool that needs sudden bursts' },
    body: {
      e: 'Your payload draws intense, short bursts. A supercapacitor bank absorbs exactly that shape of load without forcing you to oversize the battery for peak current, and it protects the cells from the high discharge rates that age them fastest.',
      x: 'Your tool needs huge sudden bursts of power. A supercapacitor can dump power incredibly fast, so the main battery does not get strained.',
    },
  },

  // ---- thermal coupling -------------------------------------------------
  {
    id: 'battery-cold-needs-heater',
    station: 'thermal',
    kind: 'tension',
    needs: ['bat:cold-sensitive'],
    title: { e: 'Your battery chemistry sets a hard minimum temperature', x: 'Your battery must not get too cold' },
    body: {
      e: 'Charging a lithium-ion or lithium-polymer cell below about 0 °C plates metallic lithium on the anode. That is permanent damage and it is cumulative — every cold charge cycle takes capacity away for good. In eclipse a CubeSat cools fast because it has almost no thermal mass, so this is a real design driver, not a theoretical one.',
      x: 'If you charge this kind of battery when it is freezing, it gets damaged forever — a bit more every single time. And small satellites get cold very quickly in the dark, so this really matters.',
    },
  },
  {
    id: 'passive-thermal-vs-cold-battery',
    station: 'battery',
    kind: 'tension',
    needs: ['tcs:no-heater', 'bat:cold-sensitive'],
    title: { e: 'Nothing in your build keeps this battery above freezing', x: 'Nothing you have chosen keeps this battery warm' },
    body: {
      e: 'You have a cold-sensitive chemistry and a thermal design with no heater. Passive coatings can bias your average temperature warmer, but they cannot hold a floor through a 35-minute eclipse. Either add a survival heater or choose a chemistry that tolerates the cold better.',
      x: 'Your battery hates the cold, and nothing in your satellite keeps it warm in the dark. Either add a little heater, or pick a tougher battery.',
    },
  },
  {
    id: 'cryo-needs-radiator',
    station: 'thermal',
    kind: 'tension',
    needs: ['tcs:needs-radiator', 'struct:low-area'],
    title: { e: 'A cryocooler has to dump its heat somewhere', x: 'A fridge has to put the heat somewhere' },
    body: {
      e: 'A cryocooler does not destroy heat, it moves it: everything it pumps out of the detector, plus its own input power, has to be radiated from the warm side. On a small structure there is very little external area left over for that once solar cells and apertures have taken their share.',
      x: 'A fridge does not make heat disappear — it moves it somewhere else. Your satellite is small, so there is barely any spare wall to get rid of it from.',
    },
  },
  {
    id: 'jitter-vs-imaging',
    station: 'thermal',
    kind: 'tension',
    needs: ['tcs:jitter', 'need:pointing-tight'],
    title: { e: 'Your cooler vibrates the instrument it is cooling', x: 'The fridge buzzes, and that blurs the camera' },
    body: {
      e: 'A mechanical cryocooler has a reciprocating mass, and it is bolted to the same structure as your detector. That exported vibration lands directly in the imaging chain. Real designs isolate the cooler on flexures or run it at a frequency chosen to miss the instrument’s sensitive band.',
      x: 'The fridge has parts that move back and forth, and they shake the whole satellite a tiny bit — right where the camera is. Engineers have to mount it on springy supports to stop the shaking getting through.',
    },
  },

  // ---- structure coupling ----------------------------------------------
  {
    id: 'volume-6u-required',
    station: 'structure',
    kind: 'blocker',
    needs: ['need:volume-6u'],
    title: { e: 'This payload does not fit below 6U', x: 'This tool is too big for a small satellite' },
    body: {
      e: 'A deployable antenna of useful diameter needs somewhere to stow and a large flat face to deploy from. RainCube needed a full 6U to carry its folded Ka-band reflector and the radar electronics — that is the demonstrated floor for this class of instrument.',
      x: 'A folding dish has to be packed away somewhere and needs a big flat side to unfold from. The real satellite that did this was shoebox-sized, and that is the smallest it can be.',
    },
  },
  {
    id: 'tight-volume-warning',
    station: 'structure',
    kind: 'tension',
    needs: ['need:volume', 'struct:tiny'],
    title: { e: 'There is not enough internal volume here', x: 'There is not enough room inside' },
    body: {
      e: 'Once the EPS board, battery, radio and computer are stacked, a 1U has well under half a unit of usable payload volume. Your instrument needs optics with real focal length and precise alignment, which is not achievable in what is left.',
      x: 'Once you put in the battery, the radio and the computer, a 1U has almost no space left — and your tool needs a long tube to focus properly.',
    },
  },
  {
    id: 'articulated-on-tiny',
    station: 'power',
    kind: 'tension',
    needs: ['power:mechanism', 'struct:tiny'],
    title: { e: 'A sun-tracking drive is disproportionate on this structure', x: 'Turning wings are too fancy for a satellite this small' },
    body: {
      e: 'A solar array drive assembly, its slip rings and its control electronics consume a meaningful fraction of a 1U’s internal volume and mass — often more than the extra power they buy back at this scale. Below 6U, deployable-but-fixed panels are almost always the better engineering answer.',
      x: 'The motor and its wiring would take up more room than the extra power is worth on such a tiny satellite. Simple fold-out wings are better here.',
    },
  },

  // ---- orbit and disposal ----------------------------------------------
  {
    id: 'sso-needs-disposal',
    station: 'propulsion',
    kind: 'blocker',
    needs: ['orbit:needs-disposal', 'eol:natural'],
    title: { e: 'This build does not meet the 5-year disposal rule', x: 'Your satellite would become space junk' },
    body: {
      e: 'You are flying in the 400–800 km band, where NASA SoA notes a passive deorbit system is typically required to comply. Since September 2022 the FCC has required disposal within 5 years of launch for LEO satellites it licenses. Relying on natural decay from this altitude will not get you there, and a launch provider will ask you to show your compliance analysis.',
      x: 'You are flying too high to fall back down by yourself within five years — and that is now the rule. You need something to bring your satellite home when it is finished.',
    },
  },
  {
    id: 'iss-dragsail-redundant',
    station: 'propulsion',
    kind: 'tension',
    needs: ['orbit:short-life', 'eol:dragsail'],
    title: { e: 'You may be carrying a deorbit device you do not need', x: 'You might not need this — you already come down by yourself' },
    body: {
      e: 'From your altitude the atmosphere already removes you well inside five years. A drag sail here spends mass, volume and one more deployment failure mode to solve a problem you do not have. It is not wrong — some teams fly one as a technology demonstration — but be honest about which of those two things you are doing.',
      x: 'Your orbit is so low that you already fall back to Earth on your own. Adding a space parachute means carrying extra weight and one more thing that could jam, for no benefit — unless testing the parachute IS your experiment.',
    },
  },
  {
    id: 'vleo-short-mission',
    station: 'propulsion',
    kind: 'tension',
    needs: ['orbit:vleo', 'prop:no-manoeuvre'],
    title: { e: 'Without propulsion, this orbit gives you months', x: 'Down here, your satellite only lasts a few months' },
    body: {
      e: 'At around 300 km, drag removes you quickly and there is nothing you can do about it. That is a legitimate choice for a short, sharp technology demonstration, but it does mean your entire science return has to be collected in a matter of months.',
      x: 'Flying this low means the air pulls you down within a few months. That is fine for a quick experiment, but you have to get all your work done fast.',
    },
  },
  {
    id: 'drag-vs-vleo',
    station: 'power',
    kind: 'tension',
    needs: ['power:drag', 'orbit:high-drag'],
    title: { e: 'Big panels in thick air shorten your life and fight your ADCS', x: 'Big wings down low get pushed around' },
    body: {
      e: 'Deployed panels at very low altitude do two things: they increase drag, accelerating your decay, and they give the residual atmosphere leverage to torque the spacecraft. The centre of pressure moves away from the centre of mass and your attitude system has to fight that continuously.',
      x: 'Big wings catch more of the thin air. That slows you down faster, and it also pushes the satellite sideways, so your pointing system has to work harder all the time.',
    },
  },
  {
    id: 'coarse-adcs-in-drag',
    station: 'adcs',
    kind: 'tension',
    needs: ['orbit:high-drag', 'adcs:no-power'],
    title: { e: 'Disturbance torques are strong at this altitude', x: 'Down here the air keeps pushing your satellite around' },
    body: {
      e: 'Aerodynamic torque scales with atmospheric density, and at very low altitude it becomes the dominant disturbance. A passive system with no active authority may simply be overwhelmed, especially if your solar panels put the centre of pressure well away from the centre of mass.',
      x: 'The tiny bit of air down here pushes hard enough to twist your satellite around, and a system with no motors or magnets cannot push back.',
    },
  },

  // ---- brain and radiation ---------------------------------------------
  {
    id: 'cots-in-radiation-mission',
    station: 'brain',
    kind: 'tension',
    needs: ['payload:particles', 'cdh:low-rad'],
    title: { e: 'You are deliberately flying through what breaks your computer', x: 'Your satellite is measuring the very thing that hurts computers' },
    body: {
      e: 'Your payload exists to measure energetic particles, which means you are choosing to spend time in the environment that causes single-event upsets and accumulates total ionising dose. A commercial processor can survive this with good watchdog and latch-up protection, but expect resets, and make sure a reset never loses your science data or your ability to command the spacecraft.',
      x: 'You are flying into space storms on purpose to study them — but those same storms are what confuse computer chips. Your computer will probably get knocked over sometimes, so make sure it can always get back up.',
    },
  },
  {
    id: 'long-mission-cots-tid',
    station: 'brain',
    kind: 'tension',
    needs: ['orbit:needs-disposal', 'cdh:cots'],
    title: { e: 'Total ionising dose accumulates over a long mission', x: 'Radiation damage builds up slowly over the years' },
    body: {
      e: 'Your orbit supports a multi-year mission, but a commercial microcontroller is typically rated in the 20–40 krad range. TID is cumulative and irreversible — parts drift out of spec long before they fail outright. If you want the full mission life the orbit allows, the computer is the part that limits it.',
      x: 'Your orbit means the satellite could live for years — but ordinary computer chips slowly get damaged by space radiation. After a while the chip stops working properly, even though nothing broke suddenly.',
    },
  },
  {
    id: 'radhard-overkill-leo',
    station: 'brain',
    kind: 'tension',
    needs: ['cdh:expensive', 'orbit:short-life'],
    title: { e: 'This may be more hardening than this mission needs', x: 'This might be tougher than your mission needs' },
    body: {
      e: 'You are flying a short mission in low Earth orbit, still partly shielded by the magnetosphere. NASA itself has moved toward COTS for smallsat missions of at least a year. A rad-hard processor is a real answer to a real problem, but on this mission profile the money may buy more capability elsewhere.',
      x: 'Your mission is short and stays close to Earth, where Earth’s magnetism shields you a bit. A super-tough chip works fine — but the money might do more good somewhere else.',
    },
  },

  // ---- operations -------------------------------------------------------
  {
    id: 'latency-vs-single-station',
    station: 'ground',
    kind: 'tension',
    needs: ['gnd:single', 'cap:sees-heat'],
    title: { e: 'A fire alert is a perishable product', x: 'Fire news goes stale fast' },
    body: {
      e: 'Detecting a fire is only useful if somebody hears about it while it is still small. With one ground station you might see the satellite four to six times a day, so an observation made just after a pass waits hours before it can be downlinked. That latency, not the detector, becomes the limiting factor of the mission.',
      x: 'Spotting a fire only helps if you can tell someone quickly. With one antenna you only hear from your satellite a few times a day — so a fire it spots might wait hours before anyone finds out.',
    },
  },
  {
    id: 'amateur-only-uhf',
    station: 'ground',
    kind: 'tension',
    needs: ['gnd:uhf-only'],
    without: ['com:omni'],
    title: { e: 'The volunteer network cannot hear your main downlink', x: 'The radio hobbyists cannot hear this radio' },
    body: {
      e: 'Volunteer ground networks operate on amateur VHF/UHF bands. Your primary downlink is on a different band with a directional antenna, so the community can only help you if you also carry a UHF beacon. Many missions do exactly that — the beacon is cheap insurance.',
      x: 'The hobbyists listen on the simple radio channels, not your fast one. If you want their help, you need to carry a small simple radio as well — which is a very good idea anyway.',
    },
  },
  {
    id: 'polar-network-good',
    station: 'ground',
    kind: 'good',
    needs: ['gnd:low-latency', 'orbit:polar'],
    title: { e: 'A polar orbit and a polar ground station are made for each other', x: 'Flying over the poles means the polar dishes see you every lap' },
    body: {
      e: 'A near-polar orbit passes over high latitudes on every single revolution, so a ground station near the pole sees you roughly every 90 minutes rather than a few times a day. This pairing is why operational Earth-observation constellations fly SSO and buy polar ground access.',
      x: 'Your satellite goes over the poles every lap, so a dish near the pole can catch it every single time — about every hour and a half instead of a few times a day.',
    },
  },
  {
    id: 'commercial-network-cost',
    station: 'ground',
    kind: 'tension',
    needs: ['gnd:expensive'],
    title: { e: 'This is a recurring cost, not a one-off', x: 'You have to keep paying for this one' },
    body: {
      e: 'Every other choice you have made is paid for once, before launch. Ground service is billed per pass for the life of the mission, so it turns your project from a build into an operating budget — which is why student missions almost always build their own station instead.',
      x: 'Everything else you build, you pay for once. This one you pay for every single time you use it, for as long as the satellite flies.',
    },
  },

  // ---- launch and safety ------------------------------------------------
  {
    id: 'pressure-vessel-review',
    station: 'propulsion',
    kind: 'tension',
    needs: ['prop:pressure-vessel'],
    title: { e: 'You have just made the launch safety review much harder', x: 'Rocket companies will look at this very carefully' },
    body: {
      e: 'A pressurised tank on a rideshare sits next to someone else’s far more expensive primary payload. You will need burst-pressure margins, documented inhibits, proof testing and a compatibility analysis. Many CubeSat teams find this paperwork, not the hardware, is what sets their schedule.',
      x: 'Your fuel tank rides to space next to a satellite worth far more than yours. So the rocket company checks everything about it, over and over — and that takes a very long time.',
    },
  },
  {
    id: 'deployables-stack-up',
    station: 'propulsion',
    kind: 'tension',
    needs: ['power:has-deployable', 'prop:has-deployable', 'com:has-deployable'],
    title: { e: 'You now have three separate one-shot deployments', x: 'Three different things now have to unfold correctly' },
    body: {
      e: 'Solar panels, an antenna and a deorbit device all have to release and latch correctly, each with its own hold-down and its own failure mode. Deployment mechanisms are the most common single-point failure on CubeSats. Real teams test each release dozens of times and stagger them in the timeline so one failure does not mask another.',
      x: 'Your solar wings, your antenna and your space parachute all have to unfold properly. Things that unfold are the most common thing to go wrong on a small satellite — so each one gets tested again and again before launch.',
    },
  },
]

const has = (tags, list) => (list || []).every((t) => tags.has(t))
const hasNone = (tags, list) => !(list || []).some((t) => tags.has(t))

const fires = (rule, tags) => has(tags, rule.needs) && hasNone(tags, rule.without)

/**
 * Notes to show on a station page as incoming constraints, based on what the
 * player has already decided elsewhere. The current station's own pick is
 * excluded so this reads as advice before choosing, not judgement after.
 */
export function briefingFor(stationId, picks) {
  const others = { ...picks }
  delete others[stationId]
  const tags = tagsFor(others)
  return RULES.filter((r) => r.station === stationId && fires(r, tags))
}

/** Every consequence that is true of the finished spacecraft. */
export function flightNotes(picks) {
  const tags = tagsFor(picks)
  return RULES.filter((r) => fires(r, tags))
}

/**
 * Notes that became true because of the pick just made at this station —
 * the immediate "and here is what that means" feedback.
 */
export function notesTriggeredBy(stationId, picks) {
  const before = { ...picks }
  delete before[stationId]
  const beforeTags = tagsFor(before)
  const afterTags = tagsFor(picks)
  return RULES.filter((r) => fires(r, afterTags) && !fires(r, beforeTags))
}

export const optionOf = getOption
