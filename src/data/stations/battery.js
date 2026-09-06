export const battery = {
  id: 'battery',
  order: 5,
  code: 'BAT',
  name: { e: 'Energy Storage — the Battery', x: 'The Power Store' },
  subtitle: { e: 'What keeps the spacecraft alive through every eclipse', x: 'What keeps it running in the dark' },
  question: { e: 'What will you store energy in?', x: 'Where will your satellite keep its power?' },
  primer: {
    e: 'In low Earth orbit you go into Earth’s shadow roughly sixteen times a day, so the battery is charged and discharged around 5,800 times a year. That is a brutal cycling duty, and it is the reason spacecraft batteries are operated at shallow depth of discharge rather than being run flat. The battery is also the most temperature-sensitive item on the whole vehicle.',
    x: 'Your satellite goes into Earth’s shadow about sixteen times every day. That means the battery gets used and refilled thousands of times a year — so you never drain it all the way, or it wears out fast. Batteries also hate being too cold or too hot.',
  },
  realTalk: {
    e: 'A battery is also the main safety concern in launch integration: it is the one component with stored energy that can vent, ignite or explode on the pad, so launch providers scrutinise the cell choice, the protection circuitry and the inhibit design closely.',
    x: 'The battery is the part rocket companies worry about most, because it is the only bit that stores enough energy to catch fire. It gets checked very carefully before launch.',
  },
  sources: ['soa-power', 'cubesat101'],
  options: [
    {
      id: 'li-ion-18650',
      level: 'both',
      name: { e: 'Lithium-ion 18650 cells', x: 'Chunky round batteries' },
      blurb: { e: 'The cylindrical cell you find in laptops and power tools, flown almost unchanged.', x: 'The same kind of battery as in a laptop — and it really goes to space.' },
      how: {
        e: 'Lithium ions shuttle between a graphite anode and a metal-oxide cathode through a liquid electrolyte. The 18650 is a standardised 18 mm × 65 mm steel can, which makes it mechanically robust and easy to hold securely against launch vibration.',
        x: 'Tiny particles called ions travel back and forth inside the battery: one way when it charges, the other way when you use it. The metal can around it is tough, which matters when a rocket is shaking it.',
      },
      madeOf: {
        e: 'Steel case, graphite anode, lithium metal-oxide cathode, liquid electrolyte, plus a protection board handling cell balancing, over-current and over-discharge cut-off.',
        x: 'A metal can with special chemicals inside, plus a small circuit board that stops it being overcharged or over-drained.',
      },
      whyChosen: {
        e: 'Enormous terrestrial production makes these cheap, well-characterised and available in flight-screened lots. NASA has real heritage here: LG Chem ICR18650 cells flew on PhoneSat and Europa Clipper, and a Panasonic NCR18650B pack flew on the Mars Ingenuity helicopter.',
        x: 'Because millions are made for laptops, they are cheap and very well understood. NASA has flown them on Mars — the little Ingenuity helicopter used them.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Excellent specific energy: commercial Li-ion cells give 150–270 Wh/kg.', x: 'Stores a lot of energy for its weight.' },
          { e: 'Cheap, available, and with real flight heritage.', x: 'Cheap and already proven in space.' },
        ],
        limits: [
          { e: 'Must be kept warm: charging a lithium-ion cell below 0 °C plates lithium metal and permanently damages it.', x: 'If it gets too cold, charging it wrecks it — so it needs a heater.' },
          { e: 'Capacity fades with cycling; deep discharge accelerates it badly.', x: 'It wears out over time, faster if you keep draining it flat.' },
          { e: 'A liquid electrolyte in a sealed can is the main fire-safety review item.', x: 'It is the part that could catch fire, so it gets checked hard.' },
        ],
      },
      facts: [
        { label: 'Specific energy', value: 'NASA SoA: "Commercial Li-ion energy cells typically provide 150-270 Wh/kg and an average voltage of 3.6 V"' },
        { label: 'Cell examples', value: 'Panasonic NCR18650B 243 Wh/kg (Mars Ingenuity); Sony US18650 VTC4 250 Wh/kg' },
        { label: 'Cycle life', value: 'NASA SoA lists Li-ion at 2,000–70,000 cycles depending on use' },
      ],
      flown: 'NASA PhoneSat, Europa Clipper, Mars Ingenuity',
      sources: ['soa-power'],
      tags: ['bat:liion', 'bat:high-energy', 'bat:needs-heater', 'bat:cold-sensitive'],
    },
    {
      id: 'lipo-pouch',
      level: 'both',
      name: { e: 'Lithium-polymer pouch cells', x: 'Flat squishy batteries' },
      blurb: { e: 'Flat, flexible cells that fit awkward gaps. Lower energy, easier packaging.', x: 'Flat batteries that can be tucked into odd spaces.' },
      how: {
        e: 'Same lithium chemistry, but with a gel or solid polymer electrolyte in a foil pouch instead of a rigid can. Without a steel case the cell can be made thin and shaped to fit, but it also has no structural protection of its own.',
        x: 'Same idea as the round ones, but wrapped in foil instead of metal, so they can be flat and thin. That means they fit in gaps — but they are also easier to damage.',
      },
      madeOf: {
        e: 'Aluminised foil pouch, gel or solid polymer electrolyte, lithium electrodes. Flight designs need a rigid retention frame and compression control, because pouch cells swell as they age.',
        x: 'Foil packets with special jelly inside. They need a frame around them, because they puff up slightly as they get old.',
      },
      whyChosen: {
        e: 'Chosen for volume-constrained builds where a cylindrical cell simply will not fit, and where the packaging win outweighs the lower energy density.',
        x: 'Picked when there is just no room for round batteries and you need something that fits a thin gap.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Packs into thin or irregular volumes a cylindrical cell cannot use.', x: 'Fits into flat spaces.' },
          { e: 'Lighter casing than a steel can.', x: 'Lighter, because there is no metal can.' },
        ],
        limits: [
          { e: 'Lower specific energy than Li-ion: NASA SoA puts LiPo at 150–200 Wh/kg.', x: 'Stores less energy for the same weight.' },
          { e: 'Shorter cycle life than cylindrical Li-ion.', x: 'Wears out sooner.' },
          { e: 'Swelling and puncture risk demand careful mechanical design.', x: 'They puff up and can be punctured, so they must be held safely.' },
        ],
      },
      facts: [
        { label: 'Specific energy', value: 'NASA SoA: LiPo cells "deliver a lower energy density (150-200 Wh/kg)"' },
        { label: 'Cycle life', value: 'NASA SoA describes LiPo cycle life as "shorter" than Li-ion' },
      ],
      flown: 'Widely used in commercial CubeSat EPS modules',
      sources: ['soa-power'],
      tags: ['bat:lipo', 'bat:medium-energy', 'bat:needs-heater', 'bat:cold-sensitive', 'bat:compact'],
    },
    {
      id: 'lifepo4',
      level: 'engineer',
      name: { e: 'Lithium iron phosphate (LiFePO₄)', x: 'The tough, safe battery' },
      blurb: { e: 'Trades energy density for thermal stability and cycle life.', x: 'Holds less power, but is much harder to damage.' },
      how: {
        e: 'The cathode uses an iron phosphate olivine structure with very strong phosphorus–oxygen bonds. It does not release oxygen when overheated the way a metal-oxide cathode can, so it will not sustain thermal runaway in the same way — the failure mode that makes launch providers nervous.',
        x: 'The chemicals inside are held together much more tightly, so if it gets too hot it does not catch fire the way other lithium batteries can.',
      },
      madeOf: {
        e: 'Iron phosphate cathode, graphite anode, liquid electrolyte, in cylindrical or prismatic cells. Flat discharge voltage curve around 3.2 V.',
        x: 'Iron and phosphorus based chemicals instead of the usual ones — cheaper metals, and much more stable.',
      },
      whyChosen: {
        e: 'Picked when cycle life and safety dominate: a long-duration mission that will see tens of thousands of eclipse cycles, or a build where the launch safety review is the binding constraint.',
        x: 'Chosen for satellites that need to last a very long time, or when safety matters more than squeezing in every last bit of power.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Much better thermal stability — a far gentler failure mode.', x: 'Far less likely to catch fire.' },
          { e: 'Long cycle life at deeper depth of discharge than Li-ion tolerates.', x: 'Can be used harder for longer without wearing out.' },
        ],
        limits: [
          { e: 'Noticeably lower specific energy — you carry more mass for the same stored energy.', x: 'Heavier for the same amount of power stored.' },
          { e: 'Lower cell voltage (~3.2 V) means more cells in series for the same bus voltage.', x: 'You need more of them to reach the right voltage.' },
        ],
      },
      facts: [
        { label: 'Use in flight hardware', value: 'NASA SoA lists LiFePO₄ in products such as the Dragonfly Aerospace 28-300 module and SkyLabs SKY-NANOeps-BMM' },
      ],
      flown: 'Used in several commercial nanosatellite EPS products',
      sources: ['soa-power'],
      tags: ['bat:lifepo4', 'bat:low-energy', 'bat:safe', 'bat:long-life', 'bat:cold-tolerant'],
    },
    {
      id: 'supercap-hybrid',
      level: 'engineer',
      name: { e: 'Battery + supercapacitor hybrid', x: 'Battery with a burst tank' },
      blurb: { e: 'A small battery for endurance plus supercapacitors for short, violent power spikes.', x: 'A normal battery plus something that can dump power very fast.' },
      how: {
        e: 'Supercapacitors store charge electrostatically at an electrode surface rather than through a chemical reaction, so they charge and discharge almost instantly and survive effectively unlimited cycles. They pair with a battery: the battery carries the average load, the capacitor bank absorbs the pulse.',
        x: 'A normal battery is like a water tank with a thin pipe — steady but slow. A supercapacitor is a small tank with a huge pipe: it empties in a flash. Using both gives you steady power and sudden bursts.',
      },
      madeOf: {
        e: 'Battery cells plus an electric double-layer capacitor bank, with power management deciding what draws from which.',
        x: 'A battery plus special fast capacitors, and a small circuit that decides which one to use.',
      },
      whyChosen: {
        e: 'Chosen for pulsed loads: a radar transmit pulse, a high-power burst downlink, a pulsed plasma thruster. Without the capacitor bank, those pulses would force you to oversize the whole battery just to handle peak current.',
        x: 'Used when the satellite needs a huge burst of power for a moment — like a radar pulse. Otherwise you would need a much bigger battery just for those flashes.',
      },
      tradeoffs: {
        strengths: [
          { e: 'Very high power density and effectively unlimited cycle life.', x: 'Can give a huge burst, over and over, forever.' },
          { e: 'Protects the battery from damaging peak currents.', x: 'Saves the main battery from being strained.' },
        ],
        limits: [
          { e: 'Very poor energy density — a supercapacitor cannot store much for its mass.', x: 'It cannot hold much energy at all.' },
          { e: 'Self-discharges quickly, so it cannot be a primary store.', x: 'It leaks its charge away, so it cannot be your main battery.' },
          { e: 'Adds another power-management path to design and test.', x: 'Adds complexity.' },
        ],
      },
      facts: [
        { label: 'Energy', value: 'NASA SoA: recent supercapacitors reach "60 Wh/kg" (previously ~7 Wh/kg)' },
        { label: 'Power / cycles', value: '"very high power densities (10–100 kW/kg)" and "over 1 million cycles"' },
      ],
      flown: 'Emerging; used for pulsed-load small spacecraft applications',
      sources: ['soa-power'],
      tags: ['bat:supercap', 'bat:pulse', 'bat:low-energy', 'bat:long-life'],
    },
  ],
}
