import { useMemo } from 'react'
import { MISSIONS } from '../data/missions.js'
import { buildSatelliteModel, DEMO_PICKS } from '../lib/satelliteModel.js'
import { t, SourceChips } from './bits.jsx'
import { MascotSays } from './Mascot.jsx'
import Model3D from './Model3D.jsx'
import Reveal from './Reveal.jsx'
import Sticker, { Squiggle } from './Sticker.jsx'

// Facts about the orbit the hero satellite is notionally in. Annotating the
// picture with real figures is borrowed straight from the reference poster —
// and here the numbers are true, which is the whole point of the app.
const HERO_DATA = [
  { k: 'Altitude', v: '500 km', side: 'left' },
  { k: 'Inclination', v: '97.7°', side: 'left' },
  { k: 'Orbital period', v: '94 min', side: 'right' },
  { k: 'Sunrises per day', v: '16', side: 'right' },
]

export default function MissionSelect({ mode, onPick, onRefs }) {
  // A satellite to look at before a single choice has been made — an empty
  // stage shows nothing about what this app is.
  const demo = useMemo(() => buildSatelliteModel(DEMO_PICKS), [])

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__stage">
          <Model3D model={demo} variant="hero" />
        </div>

        <div className="hero__grain" aria-hidden="true" />

        <div className="shell hero__inner">
          <div className="hero__eyebrow mono">
            <span className="hero__dot" aria-hidden="true" />
            NASA Space Apps · Build-along
          </div>

          <h1 className="hero__title">
            <span>Build a</span>
            <span className="hero__title--accent">real</span>
            <span>satellite</span>
          </h1>

          <Sticker rotate={-9} className="hero__sticker">
            <span>Every part</span>
            <strong>Real</strong>
            <span>No made-up specs</span>
          </Sticker>

          <p className="hero__lede">
            {mode === 'explorer'
              ? 'Pick a job for your satellite, then build it piece by piece — and watch it appear in 3D as you go.'
              : 'Choose the question your mission answers, then work through eleven real subsystems. Every option has flown; every figure is quoted from NASA.'}
          </p>

          <a className="hero__cue mono" href="#missions">
            Choose your mission
            <span className="hero__cue-line" aria-hidden="true" />
          </a>
        </div>

        <div className="hero__data" aria-hidden="true">
          {HERO_DATA.map((d) => (
            <div key={d.k} className={`datum datum--${d.side}`}>
              <span className="datum__k mono">{d.k}</span>
              <span className="datum__v mono">{d.v}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="shell">
        <Reveal>
          <MascotSays mood="excited" highlight={mode === 'explorer' ? 'Hi! I am Nova.' : 'Nova, mission planning.'}>
            {mode === 'explorer'
              ? 'I am a real little satellite. Pick a job for YOUR satellite and we will build it together — one piece at a time.'
              : 'Every real mission starts with a question, not a spacecraft. Choose the question yours will answer and the whole design follows from it.'}
          </MascotSays>
        </Reveal>

        <section id="missions" className="missions">
          <Reveal className="missions__head">
            <span className="mono section__index">01 — Mission</span>
            <h2 className="poster poster--md">
              {mode === 'explorer' ? 'What is your satellite for?' : 'Select mission objective'}
              <Squiggle className="missions__squiggle" width={96} />
            </h2>
          </Reveal>

          <div className="missiongrid">
            {MISSIONS.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <button className="missioncard" onClick={() => onPick(m.id)}>
                  <span className="missioncard__no mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="missioncard__code mono">{m.codename}</span>
                  <h3>{t(m.name, mode)}</h3>
                  <p>{t(m.tagline, mode)}</p>
                  <span className="missioncard__go mono">
                    {mode === 'explorer' ? 'Build this' : 'Select'} <span aria-hidden="true">→</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="landing__foot">
          <SourceChips
            ids={['soa-gnc', 'cubesat101', 'cds', 'fcc-5yr']}
            label={mode === 'explorer' ? 'Where the facts come from' : 'Primary references'}
          />
          <p>
            Every option describes hardware that has genuinely flown, with figures quoted from published NASA and
            mission sources.{' '}
            <button className="linkbtn" onClick={onRefs}>See the full reference list</button>
          </p>
        </Reveal>
      </div>
    </div>
  )
}
