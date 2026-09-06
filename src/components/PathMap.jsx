import { useEffect, useRef } from 'react'
import { STATIONS, resolvePicks, stationDone } from '../data/stations/index.js'
import CubeSatSVG from './CubeSatSVG.jsx'
import Mascot, { MascotSays } from './Mascot.jsx'
import { t } from './bits.jsx'

// The build path. Eleven subsystems as a winding run of nodes, so a child can
// see the whole job at once, how far in they are, and what is next — and the
// satellite they are assembling sits at the top, gaining parts as they go.

// A gentle serpentine rather than a straight column: it reads as a journey.
// The bend is one-directional — nudging left as well would push nodes past the
// page gutter on a narrow phone, clipping them and their callouts.
const OFFSETS = [0, 0.35, 0.7, 1, 0.7, 0.35, 0, 0.35, 0.7, 1, 0.7]

export default function PathMap({ mode, mission, picks, built, allDone, onOpen, onFinish }) {
  const nextIndex = STATIONS.findIndex((s) => !stationDone(picks, s.id))
  const currentRef = useRef(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' })
  }, [])

  return (
    <div className="shell path">
      <div className="path__banner">
        <span className="path__banner-eyebrow mono">
          {mission.codename} · {mode === 'explorer' ? 'Your mission' : 'Mission objective'}
        </span>
        <h1>{t(mission.name, mode)}</h1>
        <p>{t(mission.tagline, mode)}</p>
      </div>

      <div className="path__hero panel">
        <CubeSatSVG picks={picks} />
        <div className="path__hero-caption">
          <span className="label">{mode === 'explorer' ? 'Your satellite so far' : 'Current configuration'}</span>
          <strong>{built}/{STATIONS.length}</strong>
        </div>
      </div>

      {built === 0 && (
        <MascotSays mood="excited" highlight={mode === 'explorer' ? 'Hi, I am Nova!' : 'Nova here.'}>
          {mode === 'explorer'
            ? 'I am a satellite too! Tap the first circle and we will build you one, piece by piece. There is no wrong answer — every choice teaches you something real.'
            : 'Work down the path. Each stop is a real subsystem, and each choice is an approach that has genuinely flown. Several stops let you fit more than one thing, exactly as real spacecraft do.'}
        </MascotSays>
      )}

      <ol className="path__list">
        {STATIONS.map((station, i) => {
          const done = stationDone(picks, station.id)
          const isNext = i === nextIndex
          const chosen = resolvePicks(station.id, picks)
          const offset = OFFSETS[i % OFFSETS.length]

          return (
            <li
              key={station.id}
              className={`pathnode ${done ? 'pathnode--done' : ''} ${isNext ? 'pathnode--next' : ''}`}
              style={{ '--nudge': offset }}
              ref={isNext ? currentRef : null}
            >
              {isNext && !done && (
                <span className="pathnode__callout mono">
                  {mode === 'explorer' ? 'Build this!' : 'Next up'}
                </span>
              )}
              <button className="pathnode__btn" onClick={() => onOpen(station.id)}>
                <span className="pathnode__code mono">{station.code}</span>
                <span className="pathnode__tick" aria-hidden="true">{done ? '✓' : i + 1}</span>
              </button>
              <span className="pathnode__label">
                <strong>{t(station.name, mode)}</strong>
                {chosen.length > 0 && (
                  <em>{chosen.map((o) => t(o.name, mode)).join(' + ')}</em>
                )}
                {station.multi && chosen.length === 0 && (
                  <em className="pathnode__multi">
                    {mode === 'explorer' ? 'you can pick more than one' : 'multiple choices allowed'}
                  </em>
                )}
              </span>
            </li>
          )
        })}

        <li className={`pathnode pathnode--finish ${allDone ? 'pathnode--done' : ''}`} style={{ '--nudge': 0 }}>
          <button className="pathnode__btn pathnode__btn--finish" onClick={onFinish} disabled={!allDone}>
            <Mascot mood={allDone ? 'excited' : 'thinking'} size={54} />
          </button>
          <span className="pathnode__label">
            <strong>{mode === 'explorer' ? 'See your satellite!' : 'Flight readiness review'}</strong>
            <em>
              {allDone
                ? mode === 'explorer' ? 'Everything is built — go and look' : 'All subsystems assigned'
                : mode === 'explorer' ? `${STATIONS.length - built} parts still to build` : `${STATIONS.length - built} subsystems outstanding`}
            </em>
          </span>
        </li>
      </ol>
    </div>
  )
}
