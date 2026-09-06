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
cp .env.example .env      # add your Anthropic and Tripo keys
npm run dev               # web on :5173, API proxy on :8787
npm run build             # static output in dist/
```

`npm run dev` runs both halves. The guided build works with no keys at all — only the two AI
features need them, and they fail with a readable message rather than breaking the app.

Vite + React and plain CSS on the front, a small Express proxy on the back. No database; all
build state lives in React state in `App.jsx`.

## Design your own — Claude

Every subsystem station has an **Or design your own** panel underneath the standard options. A
child types their idea, or attaches a drawing, and Claude reviews it against the same curated,
sourced reference material the standard options come from — which is passed in the system prompt,
so the model judges the idea against real engineering rather than its own recollection.

It returns a verdict, how the idea would really work, **the closest real hardware that has
actually flown**, what is genuinely smart about it, what physics does to it — and a set of tags.

The tags are the important part. The coupling engine and the final review reason about a
satellite purely through tags, so Claude is constrained by a JSON-schema `enum` to describe the
invention using the app's own closed vocabulary (`src/data/vocab.js`, derived from the curated
options so the two can never drift). An invented reaction-control system tagged `adcs:coarse`
therefore trips exactly the same "your camera will smear" rule a real magnetorquer would. A
child's invention is a first-class part of the spacecraft, not a side panel.

Implementation notes:

- `claude-opus-5` with adaptive thinking, at `effort: low` — the task is bounded (judge one idea
  against supplied reference material) and a child is waiting.
- Structured outputs (`output_config.format`) guarantee schema-valid JSON, because the response
  drives UI for a nine-year-old rather than a developer console.
- `stop_reason: "refusal"` is handled as a gentle in-app state, never a 500.
- Anthropic errors are caught by type, most specific first, and mapped to sentences a child can
  read.
- The analysis is written for the age mode that was active when it was requested. Switching mode
  offers to rewrite it rather than silently showing the wrong register.

## Sketch to 3D — read by Claude, built in the browser

Two places: **any part** once a child has adopted their own design, and **the whole
satellite** at the end, beside the engineering review.

There is no mesh-generation service in the loop. Claude reads the drawing as an
engineering sketch and returns a parts list in a constrained vocabulary of shapes
(`box`, `panel`, `cylinder`, `dish`, `rod`, `sphere`, `cone`) with positions,
sizes and materials; `Model3D.jsx` assembles it in three.js. Hover or tap a part
and it names itself.

This is the better answer for this app, not a workaround:

- **It works everywhere**, including the published page, which cannot reach any
  third-party host.
- **A child's felt-tip drawing becomes a clean, readable spacecraft with named
  parts**, rather than the lumpy mesh photogrammetry gives you from a crayon
  sketch.
- No per-model cost, no five-minute expiring URLs, no upload endpoint to keep
  working.

`sanitiseModel` clamps every position and size before anything reaches the
renderer — a model that flies off to infinity is worse than no model.

## Optional: photogrammetry via Tripo AI

Two places, both opt-in:

- **Any part, at any station** — once a child has adopted their own design, they can photograph
  the drawing of it and get a 3D model of that part.
- **The whole satellite, at the end** — next to the honest engineering review, they draw how they
  picture their finished spacecraft and it comes back as a mesh they can orbit.

`server/tripo.js` and the `/api/sketch` routes remain for local experimentation
with real photogrammetry meshes. They are **not wired into the UI** — the
in-browser builder above is the path the app uses.

Uses Tripo v3 (`openapi.tripo3d.ai/v3`): upload the image for a file token, `POST
/generation/image-to-model`, poll `GET /tasks/{id}` every 2.5s. **Tripo v2 retires on
2026-11-01** — during the hackathon — so nothing here touches it.

Tripo's finished-model URLs **expire after five minutes**, so the proxy downloads the GLB the
instant a task succeeds and serves it itself. The browser is never handed a URL that may already
be dead. Models are held in memory only and dropped an hour later.

> **One thing to verify before the event:** Tripo's docs site is a JS app that would not render
> for scraping, so the file-upload path could not be confirmed from the public docs. It defaults
> to `/upload/sts` and is isolated behind `TRIPO_UPLOAD_PATH` in `server/tripo.js`; a 404 there
> returns an error naming that env var. Everything else in the flow is confirmed against Tripo's
> v3 quick-start.

## Keys, cost and safety

No key ever reaches the browser. `server/` holds both and the Vite dev server proxies `/api`
to it.

Budget guards live in `server/guard.js` and matter because a booth demo runs for hours with a
queue of children at it:

| Guard | Default | Env var |
|---|---|---|
| Idea reviews per session | 40 | `SESSION_IDEA_LIMIT` |
| 3D models per session | 4 | `SESSION_MODEL_LIMIT` |
| 3D models per server, per day | 200 | `GLOBAL_MODEL_LIMIT` |
| Requests per session per minute | 20 | `MAX_REQUESTS_PER_MINUTE` |

A Tripo job that fails before it is accepted refunds the child's model allowance.

Safety, for a kid-facing app at a public event:

- The camera cannot be opened until a notice has been read explaining, in age-appropriate words,
  that the photo goes to another computer, that it is not stored, and to **photograph the
  drawing, not people**.
- The system prompt keeps Claude on satellite engineering; off-topic input gets a friendly
  redirect and an `off-topic` verdict rather than an answer.
- Nothing a child submits is written to disk. Sessions are in-memory and swept after six hours.
- Both AI features are entirely optional — the full eleven-subsystem build and its review work
  with the server switched off.

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
  `picks` directly. Add a conditional group keyed on the new option id. Custom parts borrow the
  drawing of whichever curated option they are closest to by tag overlap, so an invented antenna
  still looks like an antenna.
- **What Claude is allowed to say about an invention**: the tag menu comes from
  `src/data/vocab.js`. Adding a tag to a curated option automatically makes it available to
  inventions too; add a line to `TAG_GLOSSARY` so the model knows what it means.

## Try it without installing anything

A single-file build of the app is published as an Artifact and works on a phone,
tablet, laptop or desktop:

**https://claude.ai/code/artifact/c3c45ac3-1efa-419d-bdc1-f2296661646b**

What works there and what does not:

| | Published page | Run locally |
|---|---|---|
| Eleven subsystems, coupling rules, final review | ✅ | ✅ |
| Both age modes, all sources | ✅ | ✅ |
| Design your own — Claude reviews your idea | ✅ via the page's `sample` capability | ✅ via the proxy |
| Sketch to 3D | ✅ | ✅ |

`npm run build:artifact` regenerates it: `VITE_TARGET=artifact` switches the AI
transport to the page's own capability and `scripts/build-artifact.mjs` inlines
the CSS and bundle into one file.

Both transports share `src/lib/prompt.js`, so the system prompt, the JSON schema
and the tag vocabulary are identical whichever path a review takes.

## Choosing many

Real spacecraft combine hardware inside a subsystem — magnetorquers *and*
reaction wheels, coatings *and* MLI *and* survival heaters, a UHF beacon
alongside an X-band downlink. So seven of the eleven stations are multi-select
(`multi: true` in the station data) and the other four stay exclusive, because
you fly one orbit in one chassis.

A station therefore holds an **array** of picks, each either a curated option id
or an invention. `resolvePicks`, `tagsFor` and `visualIdsFor` are the only places
that need to know, so the coupling rules, the review and the cutaway drawing all
handle combinations without special cases — pick magnetorquers and wheels and the
drawing shows both.

## The game layer

The interaction model is Duolingo's, rendered in this project's own palette
rather than Duolingo's:

- **A build path** of eleven nodes in a one-directional serpentine, with the
  satellite growing at the top and the next stop calling itself out.
- **Nova**, a small CubeSat mascot who introduces each subsystem and reacts to
  what you draw. Nova is the same kind of object the child is designing, which is
  why the mascot can name its own parts.
- **Chunky keys** with a solid bottom lip that depresses on press — no blur, no
  gradient.
- **A pinned action bar**, so there is always exactly one obvious next thing.
- **XP** awarded for real work: deciding a subsystem, inventing a part, drawing
  your satellite. Never for time spent.

Two motion decisions worth keeping: the "next up" node pulses three times and
then stops, because an endlessly pulsing target is tiring and hard to tap
confidently; and everything animated is disabled under `prefers-reduced-motion`.

## Responsive

One codebase from a 320px phone to a 2560px desktop, with three real layouts
rather than a squeezed desktop:

- **Phone** — single column. The satellite cutaway leads but is capped at 32vh,
  the eleven-row manifest collapses behind a disclosure, and the subsystem rail
  becomes a snap-scrolling strip that keeps the active station centred.
- **Tablet** — single column at a comfortable measure, with the satellite and its
  manifest side by side.
- **Desktop** — the three-column mission-control view, widening again past 1700px.

Tap targets are driven by **width**, not `pointer: coarse`: touchscreen laptops
and hybrid tablets report a fine pointer, and emulators disagree with real
hardware, so anything phone- or tablet-sized gets 44px targets and a coarse
pointer at any width gets them too.

`prefers-reduced-motion` is honoured in CSS *and* in JS — the rail's
scroll-into-view and the page's scroll-to-top both check it, because a
`behavior: 'smooth'` in script ignores the CSS media query.

## Visual system

Dark mission-control UI. Chakra Petch (geometric technical display) paired with IBM Plex Mono
for all data, labels and figures. Palette is fixed in `src/styles/tokens.css`:

`#050012` background · `#040121` card · `#f0e6ff` foreground · `#c89bff` primary CTA ·
`#1d123b` secondary CTA · `#684f7b` accent · `#65417c` background accent

Every other colour in the app is one of those seven at an alpha.
