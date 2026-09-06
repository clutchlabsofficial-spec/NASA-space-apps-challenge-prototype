# CubeSat Builder

An interactive build-along that teaches real satellite engineering by making you design one,
subsystem by subsystem. Built for the NASA Space Apps Challenge.

It is **not** a flight simulator. There is no launch, no orbit animation, no win/lose state.
Instead: you pick a real mission goal, then work through every subsystem a real CubeSat has,
choosing between approaches that genuinely fly today. Each choice opens up how that hardware
actually works, what it is made of, why engineers pick it, and what it honestly costs you.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

Vite + React, plain CSS. No backend, no persistence, no external state — everything lives in
React state in `App.jsx`.

## The two age modes

A single toggle in the top bar switches every string in the app.

- **Engineer Mode** (11–18) — full technical vocabulary, and more options per subsystem.
  Options marked `level: 'engineer'` only appear here.
- **Explorer Mode** (under 11) — simpler wording and playful framing, but the *same underlying
  facts*. Nothing is made inaccurate to make it simpler; a microbolometer is still described as
  pads that warm up when heat rays land on them, not as "a magic camera".

Every piece of copy is stored as `{ e, x }` — engineer text and explorer text — and rendered
through the `t(pair, mode)` helper in `src/components/bits.jsx`.

## No invented stats

There is deliberately no mass/power/cost budget game. Numbers are only shown when they are
quoted from a real published source, and each option carries source chips linking to it.
The full list lives in `src/data/sources.js` and is rendered on the References screen.

Primary sources:

- NASA **State-of-the-Art of Small Spacecraft Technology** — per-chapter, for GNC, power,
  propulsion, structures, thermal, avionics, communications and deorbit systems
- NASA **CubeSat 101** (CubeSat Launch Initiative)
- Cal Poly **CubeSat Design Specification Rev. 14.1**
- **FCC 5-year deorbit rule** (Second Report and Order, September 2022)
- Flown missions via ESA eoPortal and NASA JPL: FOREST, Planet Dove, Spire Lemur-2, CSSWE,
  MinXSS, RainCube, MarCO, TBIRD

## The eleven subsystems

Ordered the way a real team works: mission first, then the instrument, then the bus around it.

| # | Code | Subsystem |
|---|------|-----------|
| 01 | ORB | Orbit & mission design |
| 02 | PL | Payload — the instrument |
| 03 | STR | Structure & mechanisms |
| 04 | EPS | Power — solar arrays |
| 05 | BAT | Energy storage |
| 06 | CDH | Brain — command & data handling |
| 07 | ADCS | Attitude determination & control |
| 08 | TCS | Thermal control |
| 09 | COM | Communications |
| 10 | GND | Ground segment & operations |
| 11 | PROP | Propulsion & end of life |

Ground segment and end-of-life disposal are included deliberately: they are real parts of a
real mission that beginner material usually drops, and they are where student missions most
often actually fail.

## How the coupling works

Choices are not independent explainers sitting in a row. `src/lib/consequences.js` holds a set
of qualitative rules — no scores, no numbers — that fire on combinations of tags:

```js
{
  id: 'battery-cold-needs-heater',
  station: 'thermal',
  kind: 'tension',
  needs: ['bat:cold-sensitive'],
  title: { e: '…', x: '…' },
  body:  { e: '…', x: '…' },
}
```

Each option declares `tags`, the rules read the union of tags across the whole build, and the
result appears in three places:

- as **incoming constraints** at the top of a station, before you choose there
- as **immediate consequences** inside the card you just selected
- as the **subsystem coupling** section of the final review

`kind` is `good` (this pairing pays off), `tension` (a real cost you have accepted) or
`blocker` (this combination does not work).

## The end state

`src/lib/review.js` assembles the closing synthesis. It states what the spacecraft could
realistically do and what it could not, estimates operational life and what limits it, and runs
a genuine orbital-debris compliance check against the FCC 5-year rule. It also assesses the
build against the mission you chose — including telling you plainly when you have flown a
perfectly good satellite carrying the wrong instrument, which is how real missions fail.

## Adding content

- **A new option**: add an entry to the relevant file in `src/data/stations/`. Every option
  needs `how`, `madeOf`, `whyChosen`, `tradeoffs.strengths`, `tradeoffs.limits`, `sources` and
  `tags`, each with engineer and explorer wording. `facts` should only carry quotable figures.
- **A new subsystem**: create a file in `src/data/stations/`, give it an `order` and a `code`,
  and register it in `src/data/stations/index.js`.
- **New coupling**: add a rule to `RULES` in `src/lib/consequences.js`.
- **The satellite drawing**: `src/components/CubeSatSVG.jsx` is hand-authored SVG that reads
  `picks` directly. Add a conditional group keyed on the new option id.

## Visual system

Dark mission-control UI. Chakra Petch (geometric technical display) paired with IBM Plex Mono
for all data, labels and figures. Palette is fixed in `src/styles/tokens.css`:

`#050012` background · `#040121` card · `#f0e6ff` foreground · `#c89bff` primary CTA ·
`#1d123b` secondary CTA · `#684f7b` accent · `#65417c` background accent

Every other colour in the app is one of those seven at an alpha.
