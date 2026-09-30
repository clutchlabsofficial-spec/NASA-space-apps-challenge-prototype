import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { STATIONS, resolvePicks, asList, isCustom, visibleOptions } from '../data/stations/index.js'
import { briefingFor, notesTriggeredBy } from '../lib/consequences.js'
import { lessonFor } from '../data/lessons.js'
import { t, Note, SourceChips } from './bits.jsx'
import { MascotSays } from './Mascot.jsx'
import Lesson from './Lesson.jsx'
import Describe from './Describe.jsx'
import OptionCard from './OptionCard.jsx'
import CubeSatSVG from './CubeSatSVG.jsx'

/**
 * A station now has two phases, in this order:
 *
 *   1. LEARN    — the lesson. What this part does, how the real approaches
 *                 differ, and the trade-off that separates them.
 *   2. DESIGN   — describe your own, in your own words.
 *
 * The old behaviour (a grid of option cards to pick from) is still reachable,
 * but it has been demoted to "show me what real engineers built" — a reference
 * you can open *after* you have had your own idea. That ordering is the whole
 * point: a child who sees the menu first will pick from the menu.
 */

const scrollBehavior = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

export default function StationView({
  station,
  picks,
  mode,
  age,
  missionId,
  onToggle,
  onUpdate,
  onGoto,
  onBackToPath,
  onFinish,
}) {
  const lesson = lessonFor(station.id)
  const [phase, setPhase] = useState(lesson ? 'learn' : 'design')
  const [showReal, setShowReal] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const reduced = useReducedMotion()

  const index = STATIONS.indexOf(station)
  const briefing = briefingFor(station.id, picks)
  const chosen = resolvePicks(station.id, picks)
  const fired = chosen.length ? notesTriggeredBy(station.id, picks) : []
  const options = visibleOptions(station, mode)
  const next = STATIONS[index + 1]
  const allDone = STATIONS.every((s) => asList(picks[s.id]).length > 0)

  useEffect(() => {
    setPhase(lessonFor(station.id) ? 'learn' : 'design')
    setShowReal(false)
    setExpanded(null)
    window.scrollTo({ top: 0, behavior: scrollBehavior() })
  }, [station.id])

  const goDesign = () => {
    setPhase('design')
    window.scrollTo({ top: 0, behavior: scrollBehavior() })
  }

  return (
    <div className="shell station">
      <header className="stationbar">
        <button className="stationbar__close" onClick={onBackToPath} aria-label="Back to the build path">
          ✕
        </button>
        <div
          className="stationbar__bar"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={STATIONS.length}
        >
          <span style={{ width: `${((index + 1) / STATIONS.length) * 100}%` }} />
        </div>
        <span className="stationbar__count mono">
          {index + 1}/{STATIONS.length}
        </span>
      </header>

      {/* Two dots, so a child always knows which half of the station they are
          in and that learning comes before deciding. */}
      <nav className="phases" aria-label="Station steps">
        <button
          className={`phase ${phase === 'learn' ? 'phase--on' : ''}`}
          onClick={() => setPhase('learn')}
          disabled={!lesson}
        >
          <span className="phase__n">1</span>
          {mode === 'explorer' ? 'Learn it' : 'Learn'}
        </button>
        <span className="phase__link" aria-hidden="true" />
        <button
          className={`phase ${phase === 'design' ? 'phase--on' : ''}`}
          onClick={goDesign}
        >
          <span className="phase__n">2</span>
          {mode === 'explorer' ? 'Design yours' : 'Design'}
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {phase === 'learn' && lesson ? (
          <motion.div
            key="learn"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.32 }}
          >
            <Lesson lesson={lesson} station={station} mode={mode} onReady={goDesign} />
          </motion.div>
        ) : (
          <motion.div
            key="design"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.32 }}
          >
            {briefing.length > 0 && (
              <section className="briefing">
                <span className="label briefing__head">
                  {mode === 'explorer'
                    ? 'Because of what you already decided'
                    : 'Incoming constraints from your earlier choices'}
                </span>
                {briefing.map((r) => (
                  <Note key={r.id} rule={r} mode={mode} />
                ))}
              </section>
            )}

            {lesson && (
              <Describe
                station={station}
                lesson={lesson}
                mode={mode}
                age={age}
                missionId={missionId}
                picks={picks}
                onAdopt={(custom) => onToggle(station.id, custom)}
              />
            )}

            {fired.length > 0 && (
              <section className="briefing briefing--after">
                <span className="label briefing__head">
                  {mode === 'explorer' ? 'What this changes' : 'Consequences of this decision'}
                </span>
                {fired.map((r) => (
                  <Note key={r.id} rule={r} mode={mode} />
                ))}
              </section>
            )}

            {chosen.length > 0 && (
              <div className="fitted">
                <div className="fitted__art">
                  <CubeSatSVG picks={picks} />
                </div>
                <div className="fitted__list">
                  <span className="label">
                    {mode === 'explorer' ? 'On your satellite now' : 'Fitted at this station'}
                  </span>
                  <ul>
                    {chosen.map((o) => (
                      <li key={o.id}>
                        <span>{t(o.name, mode)}</span>
                        <button
                          className="fitted__remove"
                          onClick={() => onToggle(station.id, o.custom ? o.detail : o.id)}
                        >
                          {mode === 'explorer' ? 'take off' : 'remove'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* The real hardware, deliberately behind a tap and deliberately
                after the child has had their own idea. Comparing your design
                to what engineers actually flew is a good lesson; being shown
                the answers before you think is not. */}
            <section className="realworld">
              <button
                className="realworld__toggle"
                onClick={() => setShowReal((v) => !v)}
                aria-expanded={showReal}
              >
                <span className="squeeze">
                  {mode === 'explorer' ? 'What did real engineers build?' : 'Compare with flown hardware'}
                </span>
                <span className="realworld__cue">{showReal ? 'Hide' : 'Show me'}</span>
              </button>

              <AnimatePresence initial={false}>
                {showReal && (
                  <motion.div
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <MascotSays mood="thinking">
                      {mode === 'explorer'
                        ? 'These really flew. Is yours like any of them? Being different is fine — being different for a reason is even better.'
                        : 'These have all flown. Find where your design sits relative to them — and if it sits somewhere new, work out why nobody went there.'}
                    </MascotSays>
                    <div className="options options--reference">
                      {options.map((o) => (
                        <OptionCard
                          key={o.id}
                          option={o}
                          mode={mode}
                          multi={station.multi}
                          chosen={false}
                          reference
                          expanded={expanded === o.id}
                          onToggleOpen={() => setExpanded(expanded === o.id ? null : o.id)}
                          onChoose={() => onToggle(station.id, o.id)}
                          firedNotes={fired}
                        />
                      ))}
                    </div>
                    <SourceChips
                      ids={station.sources}
                      label={mode === 'explorer' ? 'Where this comes from' : 'Station references'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="actionbar">
        <div className="actionbar__inner">
          <button className="btn btn--bare" onClick={onBackToPath}>
            {mode === 'explorer' ? 'Back to the path' : 'Build path'}
          </button>
          {phase === 'learn' && lesson ? (
            <button className="btn btn--big" onClick={goDesign}>
              {mode === 'explorer' ? 'My turn →' : 'Design mine →'}
            </button>
          ) : allDone && !next ? (
            <button className="btn btn--big" onClick={onFinish}>
              {mode === 'explorer' ? 'See your satellite!' : 'Flight readiness review'}
            </button>
          ) : (
            <button
              className="btn btn--big"
              onClick={() => (next ? onGoto(next.id) : onBackToPath())}
              disabled={chosen.length === 0}
            >
              {chosen.length === 0
                ? mode === 'explorer' ? 'Describe yours first' : 'Decide this subsystem'
                : next
                  ? mode === 'explorer' ? 'Next part →' : 'Continue →'
                  : mode === 'explorer' ? 'Done!' : 'Continue →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
