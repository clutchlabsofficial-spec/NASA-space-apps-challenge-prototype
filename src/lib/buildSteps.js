import { STATIONS, resolvePicks, asList } from '../data/stations/index.js'
import { partsFor, isBuyable } from '../data/parts.js'

// The build guide. One step per screen, in the order you would actually do the
// work — power before radio, radio before payload, everything before the frame
// goes on — because that is the order in which each step can be *tested*.
//
// Steps adapt to what the child chose: they name the parts on that child's own
// shopping list, and a subsystem with no buildable hardware is skipped rather
// than faked.

const T = (e, x) => ({ e, x })

/** Names of the parts a child is buying for one design choice. */
function partNames(picks, stationId) {
  const out = []
  for (const pick of asList(picks[stationId])) {
    if (typeof pick !== 'string') continue
    for (const part of partsFor(stationId, pick) || []) {
      if (isBuyable(part)) out.push(part.name)
    }
  }
  return out
}

const has = (picks, stationId) => partNames(picks, stationId).length > 0
const list = (names) => names.join(' and ')

export function buildSteps(picks, mode) {
  const steps = []
  const add = (s) => steps.push(s)

  const brain = partNames(picks, 'brain')
  const battery = partNames(picks, 'battery')
  const power = partNames(picks, 'power')
  const comms = partNames(picks, 'comms')
  const payload = partNames(picks, 'payload')
  const adcs = partNames(picks, 'adcs')
  const thermal = partNames(picks, 'thermal')
  const structure = partNames(picks, 'structure')
  const ground = partNames(picks, 'ground')
  const orbit = partNames(picks, 'orbit')

  add({
    id: 'safety',
    phase: T('Before you start', 'First things first'),
    title: T('Get a grown-up, and read this bit', 'Find a grown-up first'),
    nova: T(
      'Every real satellite programme starts with a safety review. So does yours.',
      'Real space engineers always do this bit first!',
    ),
    body: T(
      'Two things on this build can genuinely hurt you: the lithium battery and the soldering iron. Neither is scary if you treat them properly, and both are things real spacecraft engineers handle every day with exactly the same care.',
      'Two things here need a grown-up: the battery and the hot soldering iron. Real space engineers are careful with these too.',
    ),
    checklist: [
      T('An adult is helping with soldering and with the battery', 'A grown-up is helping you'),
      T('You are working on a hard surface, not a bed or carpet', 'You are at a table, not on the sofa'),
      T('Nothing is plugged in yet', 'Nothing is switched on yet'),
    ],
    warning: T(
      'Never charge a lithium battery unattended, never puncture or bend one, and stop immediately if a cell gets hot or swells.',
      'Never leave a battery charging on its own. If it gets hot or puffy, stop and tell a grown-up.',
    ),
  })

  add({
    id: 'unbox',
    phase: T('Before you start', 'First things first'),
    title: T('Lay every part out and check it off', 'Lay out all your parts'),
    nova: T(
      'Real integration starts with a parts inventory. Missing one screw at step nine is how you lose an afternoon.',
      'Count everything first! It is annoying to find something missing halfway through.',
    ),
    body: T(
      'Put every part on the table in the order you will use it. Check each one against your shopping list. If anything is missing, better to know now.',
      'Put all your parts on the table. Tick them off your list. Is anything missing?',
    ),
    checklist: [
      T('Every part on your list is here', 'Everything on your list is here'),
      T('Nothing is visibly damaged or bent', 'Nothing looks broken'),
      T('You have your USB cable and a computer to program from', 'You have a USB cable and a computer'),
    ],
  })

  if (brain.length) {
    add({
      id: 'brain-blink',
      phase: T('Make it think', 'Wake up the brain'),
      title: T(`Bring up the ${brain[0]}`, 'Make a light blink'),
      nova: T(
        'Blink an LED before you do anything else. It proves the board, the cable, and your toolchain all work — three variables eliminated in one minute.',
        'Making a light blink is every maker’s first win. It proves everything is working!',
      ),
      body: T(
        `Plug the ${brain[0]} into your computer and load a blink program. On a Pico that means dragging MicroPython onto it, then a three-line loop. Do not move on until the light blinks: every problem after this is much harder to find if you are not certain the board works.`,
        `Plug your ${brain[0]} into the computer and load a tiny program that flashes a light on and off. When it blinks — that is your satellite waking up for the very first time!`,
      ),
      checklist: [
        T('The board appears on your computer when plugged in', 'The computer notices the board'),
        T('MicroPython (or the Arduino IDE) is installed', 'You installed the coding app'),
        T('An LED blinks on and off', 'A light is blinking!'),
      ],
      xp: 40,
    })
  }

  if (battery.length) {
    add({
      id: 'power-up',
      phase: T('Give it power', 'Give it power'),
      title: T('Wire the battery and measure it', 'Plug in the battery'),
      nova: T(
        'Measure the voltage before you connect anything to it. A cell that reads 4.2 V is charged; below 3.0 V it should not be used.',
        'Always check the battery with a meter first. It should say about 3.7 to 4.2.',
      ),
      body: T(
        `Connect the ${battery[0]} through its charger board, never directly to your electronics. Put a multimeter across the output and read the voltage. This is your entire energy budget for the mission — everything else spends what this holds.`,
        `Connect your ${battery[0]} to its charging board. Use a meter to see how full it is. This battery holds ALL the power your satellite will ever have!`,
      ),
      checklist: [
        T('Battery connects through the charger board, not straight to the board', 'The battery goes through the charger first'),
        T('Voltage reads between 3.0 V and 4.2 V', 'The meter says about 3.7'),
        T('Polarity is correct — red to +, black to −', 'Red to red, black to black'),
      ],
      warning: T(
        'Reversing the battery polarity will destroy your board instantly. Check twice.',
        'Putting the battery in backwards breaks things. Check it twice!',
      ),
    })
  }

  if (power.length) {
    add({
      id: 'solar',
      phase: T('Give it power', 'Give it power'),
      title: T(`Charge from the ${power[0]}`, 'Catch some sunlight'),
      nova: T(
        'Point it at a window and watch the charge LED come on. That is your satellite living on sunlight, which is the only way it ever will.',
        'Put it in the sunshine and watch the little light come on. Free power from the sky!',
      ),
      body: T(
        `Connect the ${power[0]} to the solar input on the charger. Take it to a window, or outside. Then try it at an angle — tilt it 60° away from the sun and watch the charge current fall. You have just measured the cosine loss that makes engineers argue about deployable panels.`,
        `Put your solar panel in the sunshine and watch it start charging. Now tilt it sideways — see how it slows down? That is why satellites turn their wings to face the Sun!`,
      ),
      checklist: [
        T('The charge indicator lights when the panel sees light', 'A light comes on in the sun'),
        T('You tried it at an angle and saw the difference', 'You tilted it and it got slower'),
      ],
      xp: 30,
    })
  }

  if (comms.length) {
    add({
      id: 'radio-bench',
      phase: T('Make it talk', 'Make it talk'),
      title: T(`Get two ${comms[0]} boards talking`, 'Send your first message'),
      nova: T(
        'One radio flies, one stays with you. Everything the satellite ever tells you comes through this link.',
        'You need two radios: one for the satellite and one for you!',
      ),
      body: T(
        `Wire one ${comms[0]} to your flight board and the other to a spare board on your desk. Send a counter — just a number that goes up. Watch it arrive. This is telemetry, and it is the difference between a satellite and a brick.`,
        `Wire up both radios and send a number that counts up: 1, 2, 3… When you see it appear on the other computer, your satellite can talk!`,
      ),
      checklist: [
        T('Both radios are on the same frequency and settings', 'Both radios are set the same'),
        T('A counter arrives at the receiving end', 'Numbers appear on the other side'),
        T('You checked which frequency is licence-free where you live', 'You checked your country’s radio rules'),
      ],
      xp: 50,
    })
    add({
      id: 'radio-range',
      phase: T('Make it talk', 'Make it talk'),
      title: T('Walk away until it breaks', 'Walk away until it stops'),
      nova: T(
        'Find the range where the link fails. That number is your mission’s real constraint, not the one on the box.',
        'Keep walking until the messages stop. How far did you get?',
      ),
      body: T(
        'Take the flight radio and walk. Note where packets start dropping. Then try again with the antenna vertical instead of horizontal — orientation matters enormously, which is exactly why a real satellite tumbling out of the deployer needs an omnidirectional antenna.',
        'Take the satellite and walk away with it, watching the messages. Now turn the antenna sideways — the messages get worse! That is why satellites use antennas that work in every direction.',
      ),
      checklist: [
        T('You measured the distance where the link fails', 'You know how far it reaches'),
        T('You compared antenna orientations', 'You tried turning the antenna'),
      ],
    })
  }

  if (payload.length) {
    add({
      id: 'payload',
      phase: T('Give it a job', 'Give it its job'),
      title: T(`Get the ${payload[0]} reading`, 'Switch on your tool'),
      nova: T(
        'Everything else on this build exists to serve this one part. Get it reading, then get the reading down the radio.',
        'This is the part that does the actual job! Everything else is here to look after it.',
      ),
      body: T(
        `Wire the ${payload[0]} to your board and print its output to the screen first — always prove the sensor works over USB before you try to send it by radio. Then, and only then, push the reading through the link you built.`,
        `Connect your ${payload[0]} and make the numbers show up on your computer screen. Once that works, send them over the radio instead!`,
      ),
      checklist: [
        T('The sensor returns sensible values over USB', 'You can see the numbers on screen'),
        T('The same values arrive over the radio', 'The numbers come through the radio too'),
        T('You waved something warm/bright/loud at it and the reading changed', 'You made the numbers change on purpose'),
      ],
      xp: 60,
    })
  }

  if (adcs.length) {
    add({
      id: 'adcs',
      phase: T('Point it', 'Point it the right way'),
      title: T(`Try the ${adcs[0]}`, 'Make it turn'),
      nova: T(
        'There is nothing to push against in orbit. Whatever you build here has to make torque out of nothing but what is already onboard.',
        'In space there is nothing to push against! So how do you turn? Let us find out.',
      ),
      body: T(
        `Hang your model from a long thread so it can rotate almost freely — that is your poor-man's zero-friction test rig, and real labs use air bearings for the same reason. Now try the ${adcs[0]} and watch what happens.`,
        `Hang your satellite on a long piece of thread so it can spin freely. Now try your ${adcs[0]} and watch it turn!`,
      ),
      checklist: [
        T('The model hangs freely and rotates with little friction', 'It spins easily on the thread'),
        T('You can see the effect of your attitude hardware', 'You made it turn!'),
      ],
      xp: 40,
    })
  }

  if (thermal.length) {
    add({
      id: 'thermal',
      phase: T('Keep it comfortable', 'Hot and cold'),
      title: T('Run the two-can experiment', 'The black and white test'),
      nova: T(
        'This is the cheapest real experiment in the whole build, and it produces a graph you could put in a mission review.',
        'This experiment costs almost nothing and it is REAL science.',
      ),
      body: T(
        `Paint two identical containers, one matt white and one matt black, put a thermistor in each, and leave them in the sun for an hour while you log both. The black one will run far hotter. That difference in absorptivity is the whole of passive thermal control, and it is why your ${thermal[0]} matters.`,
        'Paint one tin white and one black, put a temperature sensor in each, and leave them in the sun. Check them after an hour. Which one is hotter? Why do you think that is?',
      ),
      checklist: [
        T('Both containers logged for at least an hour', 'You waited an hour'),
        T('You have a graph of the two temperatures', 'You wrote the temperatures down'),
        T('You can explain the difference', 'You can explain why!'),
      ],
      xp: 40,
    })
  }

  if (structure.length) {
    add({
      id: 'structure',
      phase: T('Put it together', 'Build the body'),
      title: T('Stack the boards and close the frame', 'Put it all in its box'),
      nova: T(
        'Boards on standoffs, in a stack, inside a frame. You are building the PC/104 architecture real CubeSats use, at kitchen-table scale.',
        'Stack your boards like a sandwich, then put them in the frame you made.',
      ),
      body: T(
        `Mount the boards on M3 standoffs so they sit in a stack with air between them, then fit the stack into your ${structure[0]}. Route the wires so nothing is strained and nothing can rub. Every wire that can move will eventually break.`,
        `Screw your boards onto little posts so they stack up with space in between, then slide the stack into your frame. Tuck the wires away neatly so nothing can pull loose.`,
      ),
      checklist: [
        T('Boards are on standoffs, not resting on each other', 'The boards are not touching each other'),
        T('No wire is stretched tight or trapped', 'No wires are squashed or pulled'),
        T('Everything is inside the frame and nothing rattles', 'It all fits and nothing rattles'),
      ],
      xp: 50,
    })
  }

  add({
    id: 'shake',
    phase: T('Test it', 'Test it!'),
    title: T('Shake it, on purpose', 'The shake test'),
    nova: T(
      'NASA requires CubeSats to survive about 10 Grms of random vibration for two minutes. You cannot do that at home — but you can absolutely find the loose connector.',
      'Real satellites get shaken really hard before they fly. This is what breaks most first satellites!',
    ),
    body: T(
      'Hold it firmly and shake it hard for thirty seconds, then check it still boots and still transmits. Better still, tape it to something that vibrates. Everything that falls off now would have fallen off on the rocket.',
      'Give it a good shake for thirty seconds, then switch it on. Does everything still work? Anything that falls off now would have fallen off on the rocket!',
    ),
    checklist: [
      T('It still boots after shaking', 'It still turns on'),
      T('It still transmits after shaking', 'It still sends messages'),
      T('Nothing came loose', 'Nothing fell off'),
    ],
    xp: 40,
  })

  add({
    id: 'cold',
    phase: T('Test it', 'Test it!'),
    title: T('Put it in the freezer', 'Freeze it'),
    nova: T(
      'You cannot make a vacuum at home, but you can absolutely make it cold — and cold is what kills batteries.',
      'You cannot make space at home, but you CAN make it very cold!',
    ),
    body: T(
      'Seal it in a bag with a little rice to keep condensation off, put it in the freezer for twenty minutes, then take it out and check it. Watch the battery voltage in particular: capacity drops sharply when a lithium cell is cold, and that is precisely why real spacecraft carry survival heaters.',
      'Put it in a sealed bag in the freezer for twenty minutes. Then check it. Batteries hate the cold — that is why real satellites have little heaters!',
    ),
    checklist: [
      T('Sealed in a bag so it does not get wet', 'In a bag so it stays dry'),
      T('It still works when cold', 'It still works when freezing'),
      T('You noted what the battery voltage did', 'You saw what the battery did'),
    ],
    warning: T(
      'Let it warm back to room temperature inside the sealed bag before opening, or condensation will form on the electronics.',
      'Let it warm up before you open the bag, or it will get wet inside.',
    ),
  })

  if (ground.length) {
    add({
      id: 'ops',
      phase: T('Fly it', 'Fly it!'),
      title: T('Run a day in the life', 'Pretend it is a real day'),
      nova: T(
        'The most common reason a working satellite returns no science is that nobody rehearsed the operations. Rehearse them.',
        'Lots of satellites work perfectly and still fail — because nobody practised!',
      ),
      body: T(
        `Set up your ${ground[0]}, run the satellite on battery alone for an hour, and log everything it sends. Then have someone secretly unplug a sensor and see how long it takes you to notice from the telemetry alone. That is operations.`,
        `Set up your ground station and let the satellite run on its battery for a whole hour. Write down everything it says. Then get someone to break something secretly — can you tell what happened just from the messages?`,
      ),
      checklist: [
        T('An hour of telemetry logged with no gaps', 'An hour of messages saved'),
        T('You spotted the injected fault from telemetry', 'You worked out what broke'),
      ],
      xp: 60,
    })
  }

  add({
    id: 'fly',
    phase: T('Fly it', 'Fly it!'),
    title: orbit.length ? T(`Fly it: ${orbit[0]}`, 'Send it up!') : T('Fly it', 'Send it up!'),
    nova: T(
      'Whatever gets it off the ground — a drone, a balloon, a rocket, or a long piece of string from a window — the data is real.',
      'Time to fly! Even from a window on a string, the data is real.',
    ),
    body: T(
      'Get it as high as you safely and legally can, and log the whole flight. Then do the thing that makes it science: compare what you predicted with what you measured, and write down where you were wrong. That last part is the entire job.',
      'Get it up as high as you safely can, and save everything it tells you. Then look at your numbers — did they match what you expected? Being surprised is the best part!',
    ),
    checklist: [
      T('You have permission and a safe, legal site', 'A grown-up said yes and the place is safe'),
      T('Telemetry logged for the whole flight', 'You saved all the messages'),
      T('You compared prediction with measurement', 'You checked if you were right'),
    ],
    warning: T(
      'Drones, balloons and rockets are all regulated. Check your national rules before you fly anything.',
      'There are rules about flying things. Always check with a grown-up first.',
    ),
    xp: 120,
  })

  return steps
}

export const PHASES = ['Before you start', 'Make it think', 'Give it power', 'Make it talk', 'Give it a job', 'Point it', 'Keep it comfortable', 'Put it together', 'Test it', 'Fly it']
