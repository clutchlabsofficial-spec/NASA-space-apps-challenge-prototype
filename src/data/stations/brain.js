export const brain = {
  id: 'brain',
  order: 6,
  code: 'CDH',
  name: { e: 'Brain — Command & Data Handling', x: 'The Brain' },
  subtitle: { e: 'The onboard computer, and the radiation problem it has to survive', x: 'The computer that runs everything' },
  question: { e: 'What will you use as your flight computer?', x: 'What kind of computer will run your satellite?' },
  primer: {
    e: 'The onboard computer runs the flight software, sequences everything the satellite does, collects payload data, keeps the clock, and decides what to do when something goes wrong. The unusual part is the environment: outside the atmosphere and the magnetosphere’s protection, charged particles pass straight through silicon. Two things happen. Total ionising dose builds up slowly and degrades transistors permanently, measured in krad. Single-event effects are instantaneous: a passing particle flips a memory bit (an upset) or, worse, triggers a short-circuit-like conducting path (a latch-up) that can destroy the chip if power is not removed fast.',
    x: 'The brain is the computer that tells every other part what to do. Space is a hard place for computers, because tiny invisible bullets from the Sun and from deep space go straight through the chips. Sometimes they just flip a 1 into a 0. Sometimes they cause a short circuit that can burn the chip out unless the satellite notices and switches it off quickly.',
  },
  realTalk: {
    e: 'The choice here is not really "which chip is fastest" — it is how much you trust software and circuit tricks to catch radiation faults versus how much you pay for silicon that does not have them in the first place.',
    x: 'The real question is not which computer is fastest. It is whether you buy an expensive tough chip, or a cheap one plus a clever plan for when it goes wrong.',
  },
  sources: ['soa-avionics'],
  options: [
    {
      id: 'cots-mcu',
      level: 'both',
      name: { e: 'COTS microcontroller (ARM Cortex-M class)', x: 'An ordinary small computer chip' },
      blurb: { e: 'An off-the-shelf embedded microcontroller with a watchdog and a hard reset plan.', x: 'A normal little chip, plus a plan for when space breaks it.' },
      how: {
        e: 'A commercial ARM Cortex-M runs a small real-time operating system such as FreeRTOS. Protection is architectural rather than material: an independent watchdog timer resets the processor if the software stops petting it, current-limiting circuitry detects a latch-up as an over-current event and power-cycles the rail, and critical memory is protected with error-detection-and-correction codes.',
        x: 'You use a normal chip like the ones in a robot kit, and then add a guard: a simple timer that resets the computer if it stops saying "I am fine", and a circuit that cuts the power if the chip suddenly starts drawing too much.',
      },
      madeOf: {
        e: 'Standard commercial silicon on a PC/104-format board, with an external watchdog IC, latch-up protection, and often a rad-tolerant supervisory circuit as the one hardened part.',
        x: 'A normal circuit board with a normal chip and a couple of small protective parts.',
      },
      whyChosen: {
        e: 'It is cheap, it is fast to develop for, and hundreds of student CubeSats have proved that a well-watchdogged commercial part survives a one- to two-year LEO mission perfectly well. In LEO you are still partly shielded by Earth’s magnetic field.',
        x: 'It is cheap and easy to program, and hundreds of school satellites have shown it works fine for a year or two.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Lowest cost, fastest development, huge tool and library ecosystem.', x: 'Cheap, and easy to write programs for.' },
          { e: 'Adequate for short LEO missions with good fault handling.', x: 'Good enough for a short mission close to Earth.' },
        ],
        limits: [
          { e: 'Low total ionising dose tolerance — degradation accumulates over a long mission.', x: 'Slowly gets damaged, so it will not last many years.' },
          { e: 'Resets cost you data and observation time.', x: 'Every time it restarts, you lose whatever it was doing.' },
          { e: 'Poor choice for high-radiation orbits or anything beyond Earth.', x: 'A bad idea for the Moon or Mars.' },
        ],
      },
      facts: [
        { label: 'Typical TID', value: 'NASA SoA lists commercial CubeSat OBCs around 20–40 krad (AAC Sirius 20 krad; EnduroSat OBC I 40 krad)' },
        { label: 'Protection', value: 'NASA SoA: "Watchdog timers, selective power cycling, and software-based fault isolation—can improve robustness."' },
        { label: 'Software', value: 'FreeRTOS is the common lightweight kernel; NASA’s open-source cFS is used from CubeSat to flagship' },
      ],
      flown: 'The overwhelming majority of university CubeSats',
      sources: ['soa-avionics', 'nasa-cfs'],
      tags: ['cdh:cots', 'cdh:low-power', 'cdh:low-rad', 'cdh:cheap', 'cdh:low-compute'],
    },
    {
      id: 'cots-soc-fpga',
      level: 'both',
      name: { e: 'COTS SoC / FPGA (Xilinx Zynq class)', x: 'A powerful chip that can rewire itself' },
      blurb: { e: 'A processor and reconfigurable logic on one die — enough compute to process data before you send it.', x: 'A strong chip that can change its own wiring to do special jobs fast.' },
      how: {
        e: 'A system-on-chip pairs ARM processor cores with FPGA fabric — logic gates whose interconnections are defined by a configuration file, so you build custom hardware in software. That makes it excellent at the things a general CPU is bad at: image compression, signal demodulation, running a neural network on a video frame. The fabric’s configuration memory is itself radiation-sensitive, so flight designs continuously scrub it, rewriting the configuration to repair bit flips before they accumulate.',
        x: 'This chip has a normal computer inside plus a special part that can rewire itself into whatever circuit you need — great for squashing pictures or listening to radio. Space particles can scramble that wiring, so the satellite keeps quietly redrawing it to fix any damage.',
      },
      madeOf: {
        e: 'Commercial Zynq-7000 or UltraScale+ silicon, with ECC-protected memory, configuration scrubbing logic, and latch-up protection on the power rails.',
        x: 'A powerful commercial chip, with extra circuits that keep checking it for mistakes.',
      },
      whyChosen: {
        e: 'Chosen when downlink is the bottleneck. If you can compress or triage onboard — pick the 3% of frames with a fire in them, decode AIS messages into a few kilobytes of text — you turn an impossible downlink problem into an easy one. D-Orbit ran a neural network onboard in orbit in 2023 doing exactly this kind of work.',
        x: 'You pick this when you cannot send everything home. If the satellite can look at its own pictures and only send the interesting ones, a slow radio suddenly becomes fast enough.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Massive onboard processing — makes data reduction and onboard AI possible.', x: 'Powerful enough to sort its own data before sending it.' },
          { e: 'Reconfigurable in orbit: you can upload new logic, not just new software.', x: 'You can change how it works even after launch.' },
        ],
        limits: [
          { e: 'Much higher power draw than a microcontroller, and it is on all the time.', x: 'Uses a lot more electricity.' },
          { e: 'Configuration memory needs continuous scrubbing; more complex fault management.', x: 'Needs constant checking to fix radiation damage.' },
          { e: 'FPGA development is a specialist skill and a schedule risk for a student team.', x: 'Hard to learn and slow to program.' },
        ],
      },
      facts: [
        { label: 'TID examples', value: 'NASA SoA: GomSpace NanoMind HP MK3 (Xilinx Zynq) >20 krad; Xiphos Q7S (Zynq-7020) 25 krad' },
        { label: 'Onboard AI', value: 'NASA SoA: in July 2023 D-Orbit’s ION SCV004 ran the RaVAEn neural network onboard, demonstrating image compression and on-chip few-shot training' },
      ],
      flown: 'GomSpace NanoMind HP, Xiphos Q7S, D-Orbit ION',
      sources: ['soa-avionics'],
      tags: ['cdh:soc', 'cdh:high-compute', 'cdh:high-power', 'cdh:low-rad', 'cdh:onboard-processing'],
    },
    {
      id: 'rad-hard',
      level: 'both',
      name: { e: 'Radiation-hardened processor', x: 'A space-toughened chip' },
      blurb: { e: 'Silicon designed and manufactured so radiation faults mostly cannot happen.', x: 'A chip specially built so space cannot break it.' },
      how: {
        e: 'Hardening happens at the process and layout level: guard rings and silicon-on-insulator construction make latch-up structurally impossible, memory cells are built with redundant storage nodes so a single strike cannot flip them, and critical logic is triplicated with a voter that takes the majority answer. The result is a chip that shrugs off what would reset a commercial part.',
        x: 'These chips are built differently on purpose. Important circuits are built three times over, and a little judge inside picks whichever answer two of them agree on. So one particle strike cannot fool it.',
      },
      madeOf: {
        e: 'Purpose-built rad-hard silicon: LEON/SPARC parts such as the GR712RC or GR740, Vorago VA41630, BAE parts. Typically older process nodes, deliberately, because larger transistors hold more charge and are harder to upset.',
        x: 'Chips made in special factories. Funnily enough they use older, chunkier designs on purpose — bigger parts are harder for a space particle to knock over.',
      },
      whyChosen: {
        e: 'Chosen when a reset is unacceptable or unrecoverable: deep space, high-radiation orbits, long missions, or anything where a fault happens outside ground-station contact and nobody can intervene for hours.',
        x: 'Used when a crash would be a disaster — like a satellite going to the Moon, where nobody can reach it to fix it.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Radiation-tested to at least 50 krad TID for the common families; latch-up immune by construction.', x: 'Survives radiation that would break a normal chip.' },
          { e: 'Predictable real-time behaviour and long mission life.', x: 'Reliable for many years.' },
        ],
        limits: [
          { e: 'Dramatically more expensive — often more than the rest of the bus combined.', x: 'Extremely expensive.' },
          { e: 'Far slower than contemporary commercial silicon; a phone outruns it easily.', x: 'Much slower than a normal computer.' },
          { e: 'Long lead times and export-control paperwork.', x: 'Hard to buy and slow to arrive.' },
        ],
      },
      facts: [
        { label: 'Devices', value: 'Vorago VA10820/VA41620/VA41630, Cobham GR740, BAE 5545 — all radiation tested to at least 50 krad TID' },
        { label: 'Flown part', value: 'NASA SoA lists the "GR712RC dual-core 32-bit LEON3 fault-tolerant, SPARC V8 processor" on a CubeSat entry' },
        { label: 'High-reliability', value: 'Aitech SP0-S rated at "100 krad TID"' },
      ],
      flown: 'Standard on NASA science missions; increasingly used on cislunar and deep-space CubeSats',
      sources: ['soa-avionics'],
      tags: ['cdh:radhard', 'cdh:high-rad', 'cdh:expensive', 'cdh:low-compute', 'cdh:reliable'],
    },
    {
      id: 'hybrid-cdh',
      level: 'engineer',
      name: { e: 'Hybrid: COTS performance + hardened supervisor', x: 'Fast chip with a tough bodyguard' },
      blurb: { e: 'A powerful commercial processor watched over by a small radiation-hardened guardian.', x: 'A quick computer, with a tough little one keeping an eye on it.' },
      how: {
        e: 'A high-performance commercial SoC does the work, while a small rad-hard microcontroller holds the authority: it owns the power switches, monitors current for latch-up, keeps the real-time clock, holds a known-good backup image, and can force a reboot or a fallback to safe mode. The system is allowed to fail, as long as recovery cannot fail.',
        x: 'The big fast computer does all the work, but a small tough chip is in charge of the power switches. If the big one crashes or gets stuck, the little one just turns it off and on again — and the little one is built so it cannot crash.',
      },
      madeOf: {
        e: 'Commercial SoC plus a hardened supervisor such as a Vorago part, latch-up protection circuitry, redundant non-volatile storage for golden images, and a hardware watchdog.',
        x: 'A powerful chip plus a small space-proof chip, wired so the small one can always reset the big one.',
      },
      whyChosen: {
        e: 'This is where a lot of modern smallsat avionics has landed: you cannot afford rad-hard compute, but you can afford rad-hard authority. NASA has explicitly moved toward COTS for missions of at least a year while noting C&DH needs higher reliability than raw COTS gives.',
        x: 'It is the best of both: the speed of a cheap chip, with something reliable in charge of rescuing it.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Near-COTS performance and cost with a genuinely dependable recovery path.', x: 'Fast and cheap, but can always be rescued.' },
          { e: 'The failure mode becomes a brief outage rather than a lost mission.', x: 'A crash costs you minutes, not the whole satellite.' },
        ],
        limits: [
          { e: 'Two processors means two software builds, two update paths and more integration testing.', x: 'Two computers means twice as much software to write and test.' },
          { e: 'The supervisor logic is safety-critical and easy to get subtly wrong.', x: 'If you get the rescue plan wrong, it does not rescue anything.' },
        ],
      },
      facts: [
        { label: 'NASA posture', value: 'NASA has shifted toward COTS for smallsat missions lasting at least a year, while noting C&DH needs higher reliability than COTS parts alone currently provide' },
        { label: 'Techniques', value: 'ECC/EDAC on memory, cold redundancy (full backup OBC), scrubbing, rad-hard supervisory circuits' },
      ],
      flown: 'Common architecture in modern commercial smallsat avionics',
      sources: ['soa-avionics'],
      tags: ['cdh:hybrid', 'cdh:high-compute', 'cdh:reliable', 'cdh:onboard-processing', 'cdh:complex'],
    },
  ],
}
