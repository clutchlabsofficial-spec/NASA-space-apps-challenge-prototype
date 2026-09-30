/**
 * The lesson layer.
 *
 * The old app opened every station with a rack of option cards. That is a menu,
 * not a lesson — a child could finish the whole satellite by clicking the
 * prettiest card and learn nothing about why the choice existed.
 *
 * So each station now teaches first and asks second:
 *
 *   1. hook    — why this part exists at all
 *   2. teach   — two to four beats of real engineering, with a photograph
 *   3. axis    — THE trade-off. Every subsystem is a spectrum between real
 *                approaches, and the spectrum is the thing worth knowing.
 *                Once you know it you can place any design, including one
 *                nobody has built.
 *   4. rule    — the sentence an engineer would actually carry around
 *   5. check   — one question, answer revealed on tap. Nothing to fail.
 *   6. invite  — only now: describe yours, in your own words
 *
 * Everything factual here is drawn from the sources already cited by the
 * station files (NASA State-of-the-Art of Small Spacecraft Technology, NASA
 * CubeSat 101, and the Cal Poly CubeSat Design Specification). Numbers appear
 * only where a named source states them.
 *
 * `e` is Engineer voice, `x` is Explorer voice. Explorer is not a watered-down
 * version — it is the same fact said in shorter words. A child reading Explorer
 * learns that reaction wheels trade momentum; they just do not meet the phrase
 * "momentum exchange device" yet.
 */

export const LESSONS = {
  /* ── ORBIT ─────────────────────────────────────────────────────────── */
  orbit: {
    role: 'orbit',
    photo: 'orbit',
    hook: {
      e: 'Before a single part is chosen, the orbit decides the rules your whole satellite has to live by.',
      x: 'Where your satellite flies changes everything else about it.',
    },
    teach: [
      {
        heading: { e: 'Height buys you time, and costs you detail', x: 'Higher up = lives longer, sees less' },
        body: {
          e: 'Low Earth orbit is not empty. There is still enough atmosphere at 400 km to drag on a satellite, so it slowly falls and eventually burns up. Fly higher and the drag drops away and you last for years. But you are also further from what you are looking at, so the same camera sees less detail.',
          x: 'Even way up high there is a tiny bit of air. It pushes on your satellite and slowly pulls it down until it burns up. Fly higher and it lasts much longer — but you are further away, so your camera cannot see small things as well.',
        },
      },
      {
        heading: { e: 'The 90-minute day', x: 'Sixteen sunrises' },
        body: {
          e: 'A satellite in low Earth orbit laps the planet in roughly 90 minutes, which means about 16 orbits a day. A big slice of every lap is spent inside Earth’s shadow, so your solar panels stop producing and your battery carries the load — sixteen times a day, every day, for years.',
          x: 'Your satellite goes all the way around Earth in about an hour and a half. So it sees the Sun rise about 16 times a day! And every time it goes behind Earth it gets dark and cold, and the battery has to take over.',
        },
      },
      {
        heading: { e: 'You have to plan the ending', x: 'You must plan how it comes down' },
        body: {
          e: 'Leaving dead satellites in orbit creates debris that threatens everything else up there. In 2024 the FCC adopted a rule requiring most low-Earth-orbit satellites to come down within 5 years of finishing their mission. Choosing a low orbit means drag does that for you, free.',
          x: 'Broken satellites left floating around can smash into working ones. So now there are rules: your satellite has to come back down and burn up within 5 years of finishing its job. Flying lower means the air pulls it down on its own.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: altitude against lifetime and resolution', x: 'How high should it fly?' },
      ends: [
        {
          name: { e: 'Lower (~400 km)', x: 'Lower down' },
          body: {
            e: 'Sharper images, an easier radio link, and it deorbits itself in months to a couple of years. But drag is constant and the mission is short.',
            x: 'You see things much more clearly and it is easier to talk to. But it falls back down quite quickly.',
          },
        },
        {
          name: { e: 'Higher (~600–800 km)', x: 'Higher up' },
          body: {
            e: 'Years of life and a wider view of the ground each pass. But you are further away, the radio link is harder, radiation is worse, and you now need a plan to deorbit within 5 years.',
            x: 'It stays up for years and sees a wider area. But it is further away, harder to talk to, and you have to work out how to bring it down.',
          },
        },
        {
          name: { e: 'Sun-synchronous', x: 'The same-time-every-day path' },
          body: {
            e: 'A near-polar orbit tilted so the satellite crosses every place at the same local solar time. Shadows are consistent between passes, which is why almost every Earth-imaging mission uses it — you can compare today’s photo with last month’s.',
            x: 'A special tilted path that always passes over each place at the same time of day. The shadows look the same every time, so you can compare pictures taken weeks apart.',
          },
        },
      ],
    },
    rule: {
      e: 'Pick the orbit your payload needs, then check you can still power it, talk to it, and bring it down.',
      x: 'Choose where it flies based on the job it has to do — then check it can still get power and phone home.',
    },
    check: {
      q: { e: 'Why does a lower orbit mean a shorter mission?', x: 'Why does flying lower mean it does not last as long?' },
      a: {
        e: 'There is still a thin atmosphere down there. Drag steals energy every orbit, the satellite spirals down and eventually burns up.',
        x: 'There is still a tiny bit of air, and it keeps pushing against the satellite until it slows down and falls.',
      },
    },
    invite: {
      e: 'Describe the orbit you want — how high, what path, and what your satellite needs to see.',
      x: 'Tell me where you want your satellite to fly, and what you want it to look at.',
    },
    examples: [
      { e: 'Low and fast so my camera sees streets clearly', x: 'Really low so I can see roads and cars' },
      { e: 'Sun-synchronous so I can compare the same forest month to month', x: 'Same time every day so I can watch a forest change' },
      { e: 'Over the poles to watch sea ice', x: 'Over the top and bottom of Earth to look at the ice' },
    ],
    source: 'soa-intro',
  },

  /* ── PAYLOAD ───────────────────────────────────────────────────────── */
  payload: {
    role: 'sense',
    photo: 'payload',
    hook: {
      e: 'The payload is the only part that does the mission. Everything else on the satellite exists to keep the payload alive and pointed.',
      x: 'The payload is the part that actually does the job. Everything else is there to look after it.',
    },
    teach: [
      {
        heading: { e: 'Everything else is support staff', x: 'The rest of the satellite is the crew' },
        body: {
          e: 'Engineers call the rest of the satellite "the bus". Power, radio, computer, structure — all of it exists to carry the payload. So you design the payload first and let it set the requirements for everything else.',
          x: 'The rest of the satellite is like a bus that carries your instrument around. You decide what the instrument is first, and then build the bus to suit it.',
        },
      },
      {
        heading: { e: 'A camera is not one thing', x: 'There are lots of kinds of camera' },
        body: {
          e: 'A normal camera records the colours your eye sees. A multispectral camera adds bands your eye cannot see — near-infrared shows plant health, thermal infrared shows heat. A hyperspectral instrument splits light into hundreds of narrow bands and can identify materials by their spectral fingerprint. Each step up costs size, power and data.',
          x: 'Some cameras see what your eyes see. Others see invisible colours — one kind can tell if a plant is healthy, another can see heat. The cleverer the camera, the bigger and hungrier it gets.',
        },
      },
      {
        heading: { e: 'Not every payload looks down', x: 'Not every payload looks at Earth' },
        body: {
          e: 'Plenty of CubeSats never photograph anything. They carry particle detectors, magnetometers, radio receivers listening for ship or aircraft beacons, or a biology experiment watching how cells behave without gravity.',
          x: 'Some satellites do not take pictures at all. They measure invisible things like radiation or magnetism, or listen for radio signals from ships, or carry tiny living experiments.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: how much you sense against what it costs you', x: 'How clever should your instrument be?' },
      ends: [
        {
          name: { e: 'Simple sensor', x: 'Simple' },
          body: {
            e: 'A thermometer, a magnetometer, a Geiger counter. Tiny, low-power, produces almost no data, and you will actually get all of it down to the ground.',
            x: 'Something that measures one thing, like temperature. Small, uses hardly any power, and easy to send home.',
          },
        },
        {
          name: { e: 'Visible camera', x: 'A camera' },
          body: {
            e: 'The classic CubeSat payload. Moderate power, but images are large — you will be limited by how much you can actually transmit, not by how many photos you can take.',
            x: 'Takes real pictures. The problem is not taking them, it is that pictures are big and slow to send home.',
          },
        },
        {
          name: { e: 'Multispectral / hyperspectral', x: 'A camera that sees invisible colours' },
          body: {
            e: 'Answers questions a normal camera cannot — crop health, water quality, pollution. Costs you volume, power, thermal control and vastly more data. Often needs cooling, which is its own subsystem.',
            x: 'Can answer questions a normal camera cannot, like whether crops are sick. But it is big, thirsty, needs to be kept cold, and makes enormous amounts of data.',
          },
        },
      ],
    },
    rule: {
      e: 'Ask what question the mission answers, then choose the smallest instrument that answers it.',
      x: 'Work out what you want to find out, then pick the simplest thing that can find it out.',
    },
    check: {
      q: { e: 'Why is a better camera not automatically the right choice?', x: 'Why is the best camera not always the right one?' },
      a: {
        e: 'It demands more power, more volume, often cooling, and produces more data than your radio can send down. The bottleneck is usually the downlink, not the sensor.',
        x: 'It needs more power and more room, and it makes so many pictures you cannot send them all home anyway.',
      },
    },
    invite: {
      e: 'Describe what your satellite is for. What does it measure, watch or listen to?',
      x: 'Tell me what your satellite is for. What does it look at, or listen to, or measure?',
    },
    examples: [
      { e: 'A camera that spots wildfire smoke early', x: 'A camera that finds fires before they get big' },
      { e: 'A receiver that tracks tagged sea turtles', x: 'Something that listens for turtles with tags on them' },
      { e: 'A detector measuring radiation over the poles', x: 'Something that measures space radiation' },
    ],
    source: 'soa-payload',
  },

  /* ── STRUCTURE ─────────────────────────────────────────────────────── */
  structure: {
    role: 'body',
    photo: 'structure',
    hook: {
      e: 'The structure has one terrifying job: survive the launch. Orbit is the easy part.',
      x: 'The frame has one scary job — survive the rocket ride. Space itself is the calm bit.',
    },
    teach: [
      {
        heading: { e: 'The rocket is the enemy, not space', x: 'The rocket shakes harder than anything' },
        body: {
          e: 'During launch a satellite is shaken violently across a wide band of frequencies and squeezed by acceleration. Everything that will ever break, breaks here. That is why satellites are bolted to shaker tables on the ground and vibrated until engineers are satisfied.',
          x: 'A rocket launch shakes everything incredibly hard. Almost everything that ever breaks, breaks then. So engineers put satellites on shaking machines on the ground first to check.',
        },
      },
      {
        heading: { e: 'A CubeSat is a standard, and that is the whole point', x: 'CubeSats are all the same size on purpose' },
        body: {
          e: 'A 1U CubeSat is a 10 cm cube. The Cal Poly CubeSat Design Specification fixes the outside dimensions, the rail finish and the mass limit, so any CubeSat fits any deployer. That standard is why a school can afford to fly one — the launch provider does not need to design anything new for you.',
          x: 'One "U" is a 10 cm cube — about the size of a Rubik’s cube. Everyone agrees on the exact size, so your satellite fits in the launcher without anyone building something special. That agreement is why schools can afford to do this at all.',
        },
      },
      {
        heading: { e: 'The rails are a precision surface', x: 'The corners are special' },
        body: {
          e: 'The four corner rails slide against the deployer. They are usually hard-anodised aluminium, kept smooth and within tight tolerance, because a rail that galls or binds means your satellite does not come out of the box.',
          x: 'The four corner edges slide out of the launcher box. They are polished and treated very carefully, because if they stick, your satellite never leaves the box.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: buy a proven frame or build your own', x: 'Buy a frame, or make one?' },
      ends: [
        {
          name: { e: 'Commercial skeletonised frame', x: 'A bought frame' },
          body: {
            e: 'Machined aluminium, already flown many times, already meets the standard. You spend money instead of time, and you inherit someone else’s vibration testing.',
            x: 'Someone else already made it and already proved it works. Costs money, saves you a lot of worry.',
          },
        },
        {
          name: { e: 'Machined monocoque', x: 'Carved from one block' },
          body: {
            e: 'Cut from solid aluminium as one piece. Very stiff and very precise, with fewer joints to shake loose — but expensive, and a mistake means starting the block again.',
            x: 'Carved out of one lump of metal. Really strong with no joints to rattle apart, but expensive and you cannot undo a mistake.',
          },
        },
        {
          name: { e: 'Printed or laser-cut, for the ground model', x: 'Printed at school' },
          body: {
            e: '3D-printed polymer or laser-cut acrylic will not survive launch, and that is fine — it is how you check that everything fits, practise the assembly and test your software. Every real team builds one of these first. It is called a mass model or engineering model.',
            x: 'A printed plastic one will not survive a rocket — but that is not what it is for. It is for checking everything fits and practising. Real teams always build a practice one first.',
          },
        },
      ],
    },
    rule: {
      e: 'Design for the launch loads, then check that everything is still reachable when you need to assemble it.',
      x: 'Build it to survive the rocket — then make sure you can still reach everything to put it together.',
    },
    check: {
      q: { e: 'Why does a standard size make CubeSats cheap?', x: 'Why does everyone using the same size make it cheaper?' },
      a: {
        e: 'The launch provider already has a deployer that fits. Nothing has to be designed, built or qualified specially for your satellite.',
        x: 'The rocket already has a box your satellite fits in. Nobody has to build anything new just for you.',
      },
    },
    invite: {
      e: 'Describe your satellite’s body — its size in units, what it is made of, and how it opens up for assembly.',
      x: 'Tell me what your satellite’s body looks like — how big, what it is made of, and how you get inside it.',
    },
    examples: [
      { e: '3U aluminium frame that splits along one long face', x: 'A tall one that opens like a pencil case' },
      { e: '1U printed practice model to check fit', x: 'A little printed one just to practise with' },
      { e: '6U with a hatch for the camera', x: 'A big one with a door for the camera' },
    ],
    source: 'cds',
  },

  /* ── POWER ─────────────────────────────────────────────────────────── */
  power: {
    role: 'power',
    photo: 'power',
    hook: {
      e: 'There is no plug in orbit. Every watt your satellite will ever use has to be caught from sunlight.',
      x: 'There are no plug sockets in space. All the electricity has to come from the Sun.',
    },
    teach: [
      {
        heading: { e: 'Space solar cells are not roof panels', x: 'These are not the panels on houses' },
        body: {
          e: 'Space cells are multi-junction: several semiconductor layers stacked so each absorbs a different slice of the spectrum. NASA’s State-of-the-Art report puts them at 30–34% efficiency, well beyond household silicon — and they need to be, because area is the one thing a CubeSat has none of.',
          x: 'Space solar cells have several layers stacked up, each one catching a different colour of sunlight. That makes them much better than house panels — which matters, because a small satellite has very little room for them.',
        },
      },
      {
        heading: { e: 'Angle is everything', x: 'Facing the Sun matters a lot' },
        body: {
          e: 'A panel generates power according to how squarely it faces the Sun. Tip it 60° away and you get half. On a tumbling satellite with cells on every face, most of your cells are pointing the wrong way at any moment — which is why pointing and power are the same problem.',
          x: 'A panel only makes full power when it faces the Sun straight on. Turn it sideways and it makes much less. So how well your satellite points itself decides how much power it gets.',
        },
      },
      {
        heading: { e: 'You must generate for the dark half too', x: 'You have to make extra for the night' },
        body: {
          e: 'You spend a large fraction of every 90-minute orbit inside Earth’s shadow. The array has to produce not only what you use in daylight but also everything the battery must store to carry you through eclipse — sixteen times a day.',
          x: 'Your satellite goes into Earth’s shadow on every lap. So the panels must make enough for right now AND enough spare to fill the battery for the dark part. That happens about 16 times every day.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: watts against things that can jam', x: 'More power, or fewer things that can go wrong?' },
      ends: [
        {
          name: { e: 'Body-mounted cells', x: 'Stuck on the sides' },
          body: {
            e: 'Bonded to the outside faces. Nothing deploys, so an entire category of mission-ending failure simply does not exist. Your ceiling is the surface area of a small box.',
            x: 'Glued to the walls. Nothing has to unfold, so nothing can jam. But a small box has small walls, so you only get a little power.',
          },
        },
        {
          name: { e: 'Deployable fixed panels', x: 'Fold-out wings' },
          body: {
            e: 'Hinged wings that spring open once clear of the deployer. Several times the area — and one irreversible mechanical event that has to work first time, in vacuum, after being shaken by a rocket.',
            x: 'Wings folded flat that pop open in space. Lots more power — but they have to open properly, and you only get one try.',
          },
        },
        {
          name: { e: 'Deployable and Sun-tracking', x: 'Wings that follow the Sun' },
          body: {
            e: 'The wings rotate to face the Sun as the satellite moves. The most power available — and now you have motors, bearings and control software that all have to keep working for years.',
            x: 'The wings turn to follow the Sun. The most power you can get — but now there are motors and moving parts that must keep working for years.',
          },
        },
      ],
    },
    rule: {
      e: 'Add up what everything draws, multiply for the eclipse, then size the array — and count every mechanism as a risk.',
      x: 'Add up how much power everything needs, double-check for the dark bits, then pick your panels — and remember every moving part can jam.',
    },
    check: {
      q: { e: 'Why do fold-out panels make engineers nervous?', x: 'Why do fold-out wings worry engineers?' },
      a: {
        e: 'Deployment happens once, in vacuum, after a violent launch, with nobody there to help. If a hinge binds, the mission is over and you will never know exactly why.',
        x: 'They only open once, far away, after a very rough ride, and nobody is there to un-stick them if they jam.',
      },
    },
    invite: {
      e: 'Describe how your satellite gets its power — where the cells sit and whether anything unfolds.',
      x: 'Tell me how your satellite catches sunlight. Are the panels stuck on, or do they open out?',
    },
    examples: [
      { e: 'Body-mounted only — I want no deployment risk', x: 'Just stuck on the sides so nothing can jam' },
      { e: 'Two fold-out wings for the camera’s power budget', x: 'Two wings that pop out to feed my camera' },
      { e: 'Wings that track the Sun because my payload is hungry', x: 'Wings that follow the Sun because my instrument needs lots' },
    ],
    source: 'soa-power',
  },

  /* ── BATTERY ───────────────────────────────────────────────────────── */
  battery: {
    role: 'power',
    photo: 'battery',
    hook: {
      e: 'The battery carries the whole satellite through every eclipse — about sixteen times a day, for the entire mission.',
      x: 'The battery keeps everything running every time the satellite goes into the dark. That is about 16 times a day.',
    },
    teach: [
      {
        heading: { e: 'Cycles, not hours', x: 'Count the charges, not the hours' },
        body: {
          e: 'A battery ages by charge/discharge cycle. Sixteen eclipses a day is roughly 5,800 cycles a year, so a two-year mission needs a cell rated for over ten thousand cycles. Batteries are usually sized so they are only partly emptied each time, because shallower cycles last far longer.',
          x: 'Batteries wear out by how many times they are filled and emptied, not by how old they are. Going dark 16 times a day means thousands of refills a year — so engineers only ever empty them a little bit, which makes them last much longer.',
        },
      },
      {
        heading: { e: 'Cold batteries refuse to charge', x: 'A cold battery will not fill up' },
        body: {
          e: 'Lithium-ion cells must not be charged below roughly freezing — doing so plates metallic lithium on the anode and permanently damages the cell. So the battery almost always gets its own heater, and that heater is one of the few loads that must never be switched off.',
          x: 'If a lithium battery gets too cold, charging it damages it forever. So the battery gets its own little heater, and that heater is one thing you are never allowed to turn off.',
        },
      },
      {
        heading: { e: 'It is the thing most likely to end your mission quietly', x: 'It usually fails slowly, not loudly' },
        body: {
          e: 'Batteries rarely fail dramatically. They fade. Capacity drops, the satellite starts browning out during eclipse, resets multiply, and one day it does not come back. That is why teams track battery health from the very first pass.',
          x: 'Batteries do not usually go bang. They just get weaker and weaker until one day the satellite does not wake up. So teams watch the battery closely from day one.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: capacity against mass, volume and heat', x: 'How much battery is enough?' },
      ends: [
        {
          name: { e: 'Small pack', x: 'A small battery' },
          body: {
            e: 'Light, compact, warms up quickly. Leaves you no margin: one longer-than-expected eclipse or one stuck transmitter and the satellite browns out.',
            x: 'Light and small and easy to keep warm. But if anything uses more power than you expected, it runs out.',
          },
        },
        {
          name: { e: 'Sized with margin', x: 'A bit bigger than you need' },
          body: {
            e: 'The standard answer: enough that normal eclipses use only a modest fraction of capacity. Longer life, room for the mission to grow, and it survives a bad day.',
            x: 'Big enough that a normal dark period only uses a little of it. Lasts much longer and copes when something goes wrong.',
          },
        },
        {
          name: { e: 'Large pack', x: 'A really big battery' },
          body: {
            e: 'Lets you run a hungry payload in bursts far beyond what the array makes continuously. Costs mass and volume you cannot spare, and a big cold pack needs more heater power to keep in its safe range.',
            x: 'Lets you run something really hungry in short bursts. But it is heavy, takes up room you do not have, and needs more heating to stay warm.',
          },
        },
      ],
    },
    rule: {
      e: 'Size it so a normal eclipse uses only part of its capacity — then make sure it can be kept warm enough to charge.',
      x: 'Make it big enough that a normal dark patch only uses some of it — and make sure you can keep it warm.',
    },
    check: {
      q: { e: 'Why does the battery need a heater?', x: 'Why does a battery need its own heater?' },
      a: {
        e: 'Charging a lithium-ion cell below about freezing permanently damages it. In eclipse the satellite gets very cold, so the pack must be warmed before sunrise.',
        x: 'If you charge a lithium battery when it is freezing cold, it gets damaged forever. Space is very cold, so it needs warming up before the Sun comes back.',
      },
    },
    invite: {
      e: 'Describe your battery — how much reserve you want and how you will keep it in temperature.',
      x: 'Tell me about your battery. How much spare power do you want, and how will you keep it warm?',
    },
    examples: [
      { e: 'Generous pack so I can burst-transmit over the ground station', x: 'A big one so I can send lots when I fly over home' },
      { e: 'Small and light, heaters on the pack', x: 'Small and light with a little warmer on it' },
    ],
    source: 'soa-power',
  },

  /* ── BRAIN ─────────────────────────────────────────────────────────── */
  brain: {
    role: 'think',
    photo: 'brain',
    hook: {
      e: 'The flight computer has to keep working when radiation flips bits in its own memory — and reboot itself when it cannot.',
      x: 'The computer has to keep working even when space radiation scrambles its memory — and restart itself when it gets confused.',
    },
    teach: [
      {
        heading: { e: 'Space corrupts computers', x: 'Space scrambles computers' },
        body: {
          e: 'High-energy particles pass through chips and flip individual bits. A flipped bit in a photo is a speck; a flipped bit in the code that controls your radio can hang the satellite forever. This is called a single-event upset, and it is routine, not rare.',
          x: 'Tiny invisible particles zoom through the chips and flip a 1 into a 0. In a picture that is just a dot. In the program that runs the radio, it can freeze your satellite forever. This happens all the time.',
        },
      },
      {
        heading: { e: 'The watchdog is the most important part', x: 'The watchdog is the cleverest bit' },
        body: {
          e: 'A watchdog is a separate, very simple timer. The main computer must pat it regularly; if it stops patting, the watchdog assumes the software has hung and cuts power to force a reboot. Many CubeSats have been saved by a watchdog and almost none have been saved without one.',
          x: 'The watchdog is a simple timer that sits and waits. The main computer has to say "I am fine" every so often. If it goes quiet, the watchdog switches it off and on again. Lots of satellites have been rescued this way.',
        },
      },
      {
        heading: { e: 'Radiation-hardened versus commercial', x: 'Tough chips versus normal chips' },
        body: {
          e: 'You can buy processors specifically built to resist radiation. They cost enormously more and are years behind in performance. Most CubeSat teams instead fly ordinary commercial chips and design around the failures — watchdogs, redundant copies, error-correcting memory, frequent reboots. The whole CubeSat movement exists because that approach turned out to work.',
          x: 'You can buy special tough chips, but they cost a fortune and are much slower. Most teams use normal cheap chips and just plan for them to glitch — with watchdogs and spare copies and lots of restarting. That trick is the reason small satellites became affordable.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: capability against how it fails', x: 'Clever computer, or one that never gives up?' },
      ends: [
        {
          name: { e: 'Simple microcontroller', x: 'A simple chip' },
          body: {
            e: 'Runs one program with no operating system. Almost nothing to hang, sips power, and you can reason about every line. It cannot do image processing on board.',
            x: 'Runs one simple program. Hardly anything can go wrong and it uses very little power — but it cannot do anything clever with pictures.',
          },
        },
        {
          name: { e: 'Linux single-board computer', x: 'A little proper computer' },
          body: {
            e: 'Real filesystem, real networking, can process images before sending them — which can cut your downlink problem enormously. Draws more power, boots slower and has far more state that can get into a bad way.',
            x: 'Can actually look at the pictures and only send the interesting ones, which saves loads of sending. But it uses more power and there is much more that can go wrong.',
          },
        },
        {
          name: { e: 'Both, split by job', x: 'One of each' },
          body: {
            e: 'A tiny always-on microcontroller owns power, safe mode and the radio beacon; a bigger computer does the payload work and is switched off when not needed. This is what most serious CubeSats actually do.',
            x: 'A small chip that never sleeps looks after power and the emergency radio. A bigger one does the hard work and gets switched off in between. This is what most real satellites do.',
          },
        },
      ],
    },
    rule: {
      e: 'Assume it will lock up. Design what happens next, and make sure that path needs no help from the ground.',
      x: 'Assume it will freeze one day. Decide now what happens next — without anyone on Earth having to fix it.',
    },
    check: {
      q: { e: 'Why fly a cheap chip instead of a radiation-hardened one?', x: 'Why use a cheap chip instead of a special tough one?' },
      a: {
        e: 'Hardened parts cost far more and perform far worse. Designing around failures — watchdogs, redundancy, reboots — is cheaper and, for a short mission, works.',
        x: 'Tough chips cost a fortune and are slow. It is cheaper to use a normal one and plan for it to glitch, especially for a short mission.',
      },
    },
    invite: {
      e: 'Describe your satellite’s computer — what it needs to do, and what happens when it locks up.',
      x: 'Tell me about your satellite’s brain. What does it need to do, and what happens if it freezes?',
    },
    examples: [
      { e: 'Small always-on controller plus a Pi for image work', x: 'A tiny one that never sleeps and a bigger one for pictures' },
      { e: 'Just a microcontroller — my payload is a sensor', x: 'Just a simple chip, my instrument is simple too' },
    ],
    source: 'soa-avionics',
  },

  /* ── ADCS ──────────────────────────────────────────────────────────── */
  adcs: {
    role: 'move',
    photo: 'adcs',
    hook: {
      e: 'Nothing in space holds you still. A satellite left alone tumbles — and a tumbling satellite cannot photograph anything or aim its antenna.',
      x: 'Nothing holds a satellite still up there. Left alone it tumbles — and then the camera points at nothing and the radio misses Earth.',
    },
    teach: [
      {
        heading: { e: 'You must know which way you are facing first', x: 'First you have to know which way you are pointing' },
        body: {
          e: 'Before you can turn, you must sense your orientation. Sun sensors find the Sun, magnetometers feel Earth’s magnetic field, gyroscopes measure how fast you are turning, and star trackers photograph the sky and match it to a catalogue — the most accurate method there is.',
          x: 'Before you can turn, you need to know which way you are facing. Some sensors find the Sun, some feel Earth’s magnetism, some notice spinning, and the cleverest take photos of the stars and recognise the patterns.',
        },
      },
      {
        heading: { e: 'Reaction wheels trade momentum with you', x: 'Spin a wheel, the satellite turns the other way' },
        body: {
          e: 'Spin a flywheel one way inside the satellite and the satellite rotates the other way. Nothing is thrown overboard, so it costs only electricity. The catch: to keep resisting a steady push, the wheel must spin faster and faster until it saturates and can do no more.',
          x: 'If you spin a heavy wheel inside the satellite one way, the satellite turns the other way. It costs no fuel, only electricity. But to keep pushing back it has to spin faster and faster, until it cannot go any faster.',
        },
      },
      {
        heading: { e: 'Magnetorquers push against the planet', x: 'Magnets push against Earth' },
        body: {
          e: 'A magnetorquer is a coil that becomes an electromagnet and pushes against Earth’s magnetic field — exactly like a compass needle swinging. No fuel, no moving parts, and it is how you unload a saturated reaction wheel. It only works where Earth’s field is strong, so it is a low-Earth-orbit technique.',
          x: 'A coil of wire becomes a magnet and pushes against Earth’s magnetism, like a compass needle swinging round. No fuel, no moving parts — and it is how you slow a spinning wheel back down. It only works close to Earth.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: how accurately you point against complexity', x: 'How carefully does it need to point?' },
      ends: [
        {
          name: { e: 'Passive — magnet and damping rods', x: 'A magnet, and nothing else' },
          body: {
            e: 'A permanent magnet aligns the satellite with Earth’s field and hysteresis rods bleed off the wobble. No power, no software, nothing to fail — and no ability to choose where you point.',
            x: 'A magnet inside makes the satellite line up with Earth, like a compass. No power, no computer, nothing to break — but you cannot choose where it points.',
          },
        },
        {
          name: { e: 'Magnetorquers with sensors', x: 'Magnets you can control' },
          body: {
            e: 'Coils plus a magnetometer and Sun sensors, driven by software. Enough to stop a tumble and hold a rough attitude. Cannot point precisely and cannot turn quickly.',
            x: 'Coils you switch on and off with a computer. Enough to stop it tumbling and roughly aim it — but not quickly and not very exactly.',
          },
        },
        {
          name: { e: 'Reaction wheels plus magnetorquers', x: 'Wheels and magnets together' },
          body: {
            e: 'Wheels give fast, accurate slewing; the magnetorquers desaturate them. This is what you need for sharp imaging or a narrow antenna beam. Most parts, most power, most software — and the wheels have bearings that wear.',
            x: 'The wheels turn it quickly and exactly, and the magnets slow them down again afterwards. This is what you need for sharp photos — but it is the most complicated and uses the most power.',
          },
        },
      ],
    },
    rule: {
      e: 'Let the payload set the pointing requirement. Anything more accurate than it needs is cost and risk you did not have to take.',
      x: 'Let the instrument decide how carefully it has to point. Being fussier than you need just costs more and breaks more.',
    },
    check: {
      q: { e: 'Why do reaction wheels need magnetorquers?', x: 'Why do the wheels need the magnets?' },
      a: {
        e: 'A wheel resisting a constant push spins ever faster until it saturates. Magnetorquers push against Earth’s field so the wheel can be slowed back down.',
        x: 'A wheel has to spin faster and faster to keep pushing, until it cannot spin any faster. The magnets push against Earth so the wheel can slow down again.',
      },
    },
    invite: {
      e: 'Describe how your satellite points itself, and how accurately it has to.',
      x: 'Tell me how your satellite turns to face the right way, and how exact it needs to be.',
    },
    examples: [
      { e: 'Wheels — my camera needs steady pointing', x: 'Spinning wheels so my camera holds still' },
      { e: 'Just a magnet, my sensor does not care where it points', x: 'Just a magnet, my instrument does not mind' },
    ],
    source: 'soa-adcs',
  },

  /* ── THERMAL ───────────────────────────────────────────────────────── */
  thermal: {
    role: 'body',
    photo: 'thermal',
    hook: {
      e: 'In vacuum there is no air to carry heat away. The only way out is to radiate it — so a satellite is simultaneously scorching and freezing.',
      x: 'There is no air in space, so heat cannot blow away. A satellite can be roasting on one side and freezing on the other at the same time.',
    },
    teach: [
      {
        heading: { e: 'Only one way for heat to leave', x: 'Heat can only leave one way' },
        body: {
          e: 'On Earth heat moves by conduction, convection and radiation. In vacuum convection is gone entirely. Inside the satellite heat conducts through the structure; leaving the satellite, it can only radiate away as infrared. That is why radiator surfaces and surface finishes matter so much.',
          x: 'On Earth, hot things cool down because air carries the heat away. In space there is no air, so heat can only leave by glowing — like the warmth you feel from a fire without touching it. That is why the outside coating matters so much.',
        },
      },
      {
        heading: { e: 'Gold foil is engineering, not decoration', x: 'The shiny gold stuff is not for looks' },
        body: {
          e: 'Multi-layer insulation is dozens of paper-thin reflective sheets separated by mesh. Each layer reflects radiated heat back, so very little gets through. It is what keeps the sunlit side’s heat out and the instrument’s warmth in.',
          x: 'That shiny gold blanket is lots of very thin mirror sheets stacked with gaps. Each one bounces heat back, so hardly any gets through. It keeps the hot side out and the warmth in.',
        },
      },
      {
        heading: { e: 'Most CubeSats do it with paint and placement', x: 'Most small satellites just use paint and clever placing' },
        body: {
          e: 'A CubeSat usually has no fluid loops or heat pipes. Thermal control is choosing surface finishes, deciding which face becomes the radiator, putting warm electronics where they help cold components, and adding small heaters where something must not freeze.',
          x: 'Small satellites usually have no pumps or pipes. You just choose the right paint, decide which side lets heat out, put warm parts next to cold parts, and add tiny heaters where something must not freeze.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: passive simplicity against active control', x: 'Let it sort itself out, or control it?' },
      ends: [
        {
          name: { e: 'Fully passive', x: 'No moving parts at all' },
          body: {
            e: 'Surface finishes, insulation and layout only. Nothing consumes power and nothing can fail. You accept whatever temperature range that produces and choose parts that survive it.',
            x: 'Just paint, blankets and where you put things. Uses no power and cannot break — but you have to accept whatever temperature you end up with.',
          },
        },
        {
          name: { e: 'Passive plus heaters', x: 'Mostly passive, with little heaters' },
          body: {
            e: 'The common answer. Passive design sets the baseline; small thermostat-controlled heaters protect the battery and anything else with a hard cold limit. Costs a little power, removes the worst risk.',
            x: 'Mostly passive, plus small heaters on the things that must not get too cold, like the battery. Uses a bit of power and removes the biggest danger.',
          },
        },
        {
          name: { e: 'Active — louvres, pumped loops, coolers', x: 'Proper cooling machinery' },
          body: {
            e: 'Needed when an instrument must be held at a precise or very low temperature — some infrared detectors need active cooling to work at all. Heavy, power-hungry, and now you have a machine that can break.',
            x: 'Needed when an instrument has to be kept exactly cold — some heat cameras only work when properly chilled. Heavy, thirsty, and it is a machine that can break.',
          },
        },
      ],
    },
    rule: {
      e: 'Find the component with the narrowest temperature range and design the whole thermal system around it.',
      x: 'Find the part that is fussiest about temperature, and design everything else around keeping it happy.',
    },
    check: {
      q: { e: 'Why can’t a satellite use a fan?', x: 'Why is a fan useless in space?' },
      a: {
        e: 'A fan moves air, and there is no air. With no convection, heat can only leave the satellite by radiating away as infrared.',
        x: 'A fan blows air around, and there is no air in space. Heat can only leave by glowing away.',
      },
    },
    invite: {
      e: 'Describe how your satellite stays at a workable temperature.',
      x: 'Tell me how your satellite stops getting too hot or too cold.',
    },
    examples: [
      { e: 'White radiator face away from the Sun, heater on the battery', x: 'A white side to let heat out, warmer on the battery' },
      { e: 'Insulation everywhere, my electronics make plenty of heat', x: 'Wrapped up warm, my electronics make lots of heat' },
    ],
    source: 'soa-thermal',
  },

  /* ── COMMS ─────────────────────────────────────────────────────────── */
  comms: {
    role: 'talk',
    photo: 'comms',
    hook: {
      e: 'A satellite you cannot talk to is space debris with a good backstory. The radio is the one subsystem with no second chance.',
      x: 'A satellite you cannot talk to is just junk with a nice story. The radio is the one part that absolutely has to work.',
    },
    teach: [
      {
        heading: { e: 'You only get a few minutes per pass', x: 'You only get a few minutes at a time' },
        body: {
          e: 'A satellite in low Earth orbit is above your ground station for only a handful of minutes at a time, a few times a day. Everything you want to send down has to fit in those windows — which is why the size of your data, not the size of your camera, usually limits the mission.',
          x: 'Your satellite is only overhead for a few minutes, a few times a day. Everything has to be sent in those short windows. That is why how much data you make matters more than how good your camera is.',
        },
      },
      {
        heading: { e: 'Higher frequency, more data, harder pointing', x: 'Faster radio, harder aiming' },
        body: {
          e: 'UHF and VHF are forgiving: simple wire antennas, no precise pointing, modest data rates. S-band and X-band carry far more data but need a directional antenna aimed at the ground station — so your radio choice quietly sets your pointing requirement.',
          x: 'Slow radios are easy — a simple wire antenna and no careful aiming. Fast radios send much more, but you have to point them at your ground station. So choosing a fast radio means your satellite has to aim itself well.',
        },
      },
      {
        heading: { e: 'The beacon is your lifeline', x: 'The beeper is your lifeline' },
        body: {
          e: 'Almost every CubeSat transmits a simple periodic beacon carrying basic health data. If everything else fails, the beacon tells you the satellite is alive, tumbling or cold — and amateur radio operators around the world will often hear it and email you the data before your own ground station sees it.',
          x: 'Nearly every small satellite sends out a simple repeated beep with a few facts about how it is doing. Even if everything else breaks, that beep tells you it is alive. Radio hobbyists all over the world listen for these and email the teams.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: data rate against everything it demands', x: 'How much does it need to say?' },
      ends: [
        {
          name: { e: 'UHF/VHF amateur bands', x: 'The simple radio' },
          body: {
            e: 'Simple deployable wire antennas, no pointing needed, and a worldwide community of amateur operators who will help you track it. Low data rates — fine for telemetry and small science, not for images.',
            x: 'A simple wire antenna, no aiming, and radio hobbyists everywhere who will help you listen. Slow, though — fine for numbers, not for photos.',
          },
        },
        {
          name: { e: 'S-band', x: 'The faster radio' },
          body: {
            e: 'Considerably more data, still with a manageable antenna. Needs a proper ground station and reasonable pointing. The usual answer for an imaging CubeSat.',
            x: 'Sends a lot more and the antenna is still sensible. You need a proper dish on the ground and the satellite has to aim roughly right.',
          },
        },
        {
          name: { e: 'X-band or laser', x: 'The really fast link' },
          body: {
            e: 'Very high data rates for a demanding payload. Needs accurate pointing, a capable ground station, and licensing effort. Optical links are faster still and need pointing accurate to a fraction of a degree.',
            x: 'For instruments that make huge amounts of data. Needs very exact aiming and a serious ground station. Laser links are even faster and have to aim almost perfectly.',
          },
        },
      ],
    },
    rule: {
      e: 'Work out how many bits you must get down per day, divide by the minutes you actually have, and let that pick the radio.',
      x: 'Work out how much you need to send each day and how many minutes you get. That decides your radio.',
    },
    check: {
      q: { e: 'Why does choosing a fast radio change your pointing system?', x: 'Why does a fast radio change how the satellite turns?' },
      a: {
        e: 'Fast links need directional antennas, and a directional antenna must be aimed at the ground station — so the radio quietly imposes an attitude-control requirement.',
        x: 'Fast radios need an antenna that points in one direction, so the satellite now has to turn and aim it properly.',
      },
    },
    invite: {
      e: 'Describe how your satellite talks to Earth, and how much it has to say.',
      x: 'Tell me how your satellite phones home, and how much it needs to tell you.',
    },
    examples: [
      { e: 'Simple UHF beacon plus S-band for images', x: 'A simple beeper, and a faster one for photos' },
      { e: 'Amateur band only — students will track it', x: 'The simple kind so radio hobbyists can hear it' },
    ],
    source: 'soa-comms',
  },

  /* ── GROUND ────────────────────────────────────────────────────────── */
  ground: {
    role: 'talk',
    photo: 'ground',
    hook: {
      e: 'Half of every space mission is on the ground. The satellite is useless without somewhere to talk to.',
      x: 'Half of a space mission is down here on Earth. A satellite needs someone listening.',
    },
    teach: [
      {
        heading: { e: 'You have to know where it is before you can hear it', x: 'You have to know where it is to hear it' },
        body: {
          e: 'Ground stations point using published orbital data — two-line element sets, updated regularly from radar tracking. Your antenna follows a predicted path across the sky. If your prediction drifts, you miss the pass entirely.',
          x: 'Ground stations use published lists of where satellites are, updated all the time. Your antenna follows the path across the sky. Get the prediction wrong and you miss it completely.',
        },
      },
      {
        heading: { e: 'Amateur radio built this', x: 'Radio hobbyists made this possible' },
        body: {
          e: 'Much of CubeSat communication runs on amateur radio bands with amateur ground stations. Networks of volunteer stations around the world receive CubeSat beacons and forward the data to the teams — which means a school satellite can be heard on the other side of the planet by someone who just likes radio.',
          x: 'A lot of small satellites use the same radio bands as hobbyists. Volunteers all over the world listen out for satellites and send the data to the teams — so a school’s satellite gets heard on the other side of the world by someone who just enjoys radio.',
        },
      },
      {
        heading: { e: 'The pass is short and it does not wait', x: 'The satellite does not wait for you' },
        body: {
          e: 'A pass lasts a few minutes and then it is gone for hours. Operations are automated for exactly this reason: the schedule is prepared in advance, the station runs itself, and the team reads the results afterwards.',
          x: 'A flyover lasts a few minutes and then it is gone for hours. So everything is set up in advance and the station works on its own. The team reads what came in afterwards.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: build your own station or use someone else’s', x: 'Your own dish, or share one?' },
      ends: [
        {
          name: { e: 'Your own small station', x: 'Build your own' },
          body: {
            e: 'A rotator, a couple of antennas and a radio on a school roof. You control the schedule completely and it is genuinely affordable — but you only see the satellite when it passes over you.',
            x: 'An aerial and a motor on the school roof. Totally yours and surprisingly affordable — but you only hear the satellite when it flies over your school.',
          },
        },
        {
          name: { e: 'A volunteer network', x: 'Share with volunteers' },
          body: {
            e: 'Stations worldwide receive your beacon and forward the data. Enormously more coverage for no hardware — but you receive only, on their schedule, and you cannot command the satellite through them.',
            x: 'People all over the world listen for you and pass the data on. Loads more coverage for free — but you can only listen, not give orders.',
          },
        },
        {
          name: { e: 'Commercial ground station service', x: 'Rent a professional dish' },
          body: {
            e: 'Rent time on professional antennas around the world. Frequent contacts and high data rates, at a price — this is what a funded mission does when data volume matters more than money.',
            x: 'Pay to use big professional dishes around the world. Lots of contact and fast data, but it costs real money.',
          },
        },
      ],
    },
    rule: {
      e: 'Count the minutes of contact you will actually get per day before you promise anyone a data rate.',
      x: 'Work out how many minutes a day you can really talk to it before you promise anyone anything.',
    },
    check: {
      q: { e: 'Why does a single ground station limit your mission?', x: 'Why is one ground station a problem?' },
      a: {
        e: 'You only get contact when the satellite passes over that one place — a few short windows a day. Everything else it records has to wait in memory.',
        x: 'You only hear it when it flies over that one spot, a few times a day. Everything else has to wait in its memory.',
      },
    },
    invite: {
      e: 'Describe how you will receive from your satellite and who will be listening.',
      x: 'Tell me how you will hear your satellite, and who else might be listening.',
    },
    examples: [
      { e: 'School rooftop antenna plus the volunteer network', x: 'An aerial on our roof, plus helpers around the world' },
      { e: 'Volunteer network only, we cannot build a station', x: 'Just the volunteers, we cannot build our own' },
    ],
    source: 'soa-comms',
  },

  /* ── PROPULSION ────────────────────────────────────────────────────── */
  propulsion: {
    role: 'move',
    photo: 'propulsion',
    hook: {
      e: 'Most CubeSats have no engine at all — and that is a legitimate design, not a compromise.',
      x: 'Most small satellites have no engine at all. That is a real choice, not giving up.',
    },
    teach: [
      {
        heading: { e: 'Turning is not the same as moving', x: 'Turning is not the same as going somewhere' },
        body: {
          e: 'Reaction wheels and magnetorquers change which way you face. They cannot change your orbit. To raise, lower or shift your orbit you must throw mass overboard — that is what an engine is for, and it is a completely separate problem.',
          x: 'Wheels and magnets change which way your satellite faces. They cannot move it somewhere new. To change its path you have to throw something out the back. That is what an engine does.',
        },
      },
      {
        heading: { e: 'Cold gas is the simple honest option', x: 'The simplest engine is just squirting gas' },
        body: {
          e: 'A tank of compressed gas and a valve. Push is small and the total change in speed is modest, but there is no combustion, no heat and very little to go wrong — which is exactly why launch providers are comfortable with it sitting next to other people’s satellites.',
          x: 'A tank of squashed gas and a tap. It does not push very hard, but nothing burns and almost nothing can go wrong — which is why rocket companies are happy to have it riding along with other satellites.',
        },
      },
      {
        heading: { e: 'Electric engines push gently, forever', x: 'Electric engines push very gently for a very long time' },
        body: {
          e: 'Ion and electrospray thrusters use electricity to fling charged particles out at enormous speed. The push is tiny — comparable to a sheet of paper resting on your hand — but it can run for months, and slow steady pushing adds up to large orbit changes. They need serious electrical power, which loops straight back to your solar panels.',
          x: 'These use electricity to throw tiny charged bits out very fast. The push is about as strong as a piece of paper resting on your hand — but it can keep going for months, and gentle pushing for a long time adds up a lot. They need lots of electricity though.',
        },
      },
    ],
    axis: {
      label: { e: 'The real trade: what you gain against what you are allowed to fly', x: 'Do you need an engine at all?' },
      ends: [
        {
          name: { e: 'None', x: 'No engine' },
          body: {
            e: 'Your orbit is whatever the launch gave you, and drag slowly brings you down — which conveniently satisfies the deorbit rule. Most CubeSats. Simplest, cheapest, and the easiest to get a ride for.',
            x: 'You stay on the path the rocket gave you, and the air slowly brings you down — which is exactly what the rules want anyway. Most small satellites do this.',
          },
        },
        {
          name: { e: 'Cold gas', x: 'Squirty gas' },
          body: {
            e: 'Enough to tidy your orbit, keep formation with another satellite, or push yourself down at end of life. Simple and safe to fly alongside others.',
            x: 'Enough to tidy up your path, stay near a friend satellite, or push yourself down at the end. Simple and safe.',
          },
        },
        {
          name: { e: 'Electric propulsion', x: 'Electric engine' },
          body: {
            e: 'Real orbit changes over months. Demands a lot of electrical power and adds complexity and paperwork — but it is what turns a CubeSat into something that can go somewhere.',
            x: 'Can really change where it goes, over months. Needs lots of power and makes everything more complicated — but it lets a small satellite actually travel.',
          },
        },
      ],
    },
    rule: {
      e: 'Do not add an engine unless the mission fails without one. It is the subsystem most likely to cost you your launch slot.',
      x: 'Only add an engine if your mission truly cannot work without it. It is the part most likely to get you bumped off the rocket.',
    },
    check: {
      q: { e: 'Why can’t reaction wheels change your orbit?', x: 'Why can’t the spinning wheels move the satellite?' },
      a: {
        e: 'They only exchange momentum inside the satellite, so they can rotate it but not move it. Changing orbit requires throwing mass away.',
        x: 'They only swap spin around inside the satellite, so they can turn it but not move it. To go somewhere you must throw something out.',
      },
    },
    invite: {
      e: 'Describe whether your satellite needs to move — and if so, why.',
      x: 'Tell me whether your satellite needs to move around, and why.',
    },
    examples: [
      { e: 'No engine — drag will deorbit me in time', x: 'No engine, the air will bring it down' },
      { e: 'Cold gas so I can push myself down at end of life', x: 'A little gas squirter to bring it down at the end' },
    ],
    source: 'soa-propulsion',
  },
}

export const lessonFor = (stationId) => LESSONS[stationId] || null
export const hasLesson = (stationId) => Boolean(LESSONS[stationId])
