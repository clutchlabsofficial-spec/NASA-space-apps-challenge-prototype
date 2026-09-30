import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { animate, stagger, createSpring, utils } from 'animejs'
import { reviewIdea, fileToDownscaledDataUrl } from '../lib/api.js'
import { t } from './bits.jsx'

/**
 * "Describe it in your own words."
 *
 * This replaces the rack of option cards as the primary way a subsystem gets
 * decided. The cards are still in the data — they are what the lesson taught
 * from, and what Claude is grounded against — but a child no longer picks one.
 * They read the trade-off, then say what they want, and Claude places their
 * description on that trade-off and maps it into the app's tag vocabulary so
 * the rest of the satellite responds to it exactly as it would to a stock part.
 *
 * The examples are seeds, not choices. Tapping one fills the box with text the
 * child can then edit — which is the difference between offering a starting
 * point and offering a menu.
 */

const VERDICT = {
  works: { stamp: { e: 'This would work', x: 'This works!' }, tone: 'good' },
  partly: { stamp: { e: 'Partly works', x: 'Almost' }, tone: 'tension' },
  'wont-work': { stamp: { e: 'Physics says no', x: 'This would not work' }, tone: 'blocker' },
  'off-topic': { stamp: { e: 'Not a subsystem idea', x: 'Let us get back to the satellite' }, tone: 'tension' },
}

export default function Describe({
  station,
  lesson,
  mode,
  age,
  missionId,
  picks,
  onAdopt,
  busyLabel,
}) {
  const [text, setText] = useState('')
  const [sketch, setSketch] = useState(null)
  const [sketchName, setSketchName] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const seedsRef = useRef(null)
  const resultRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const chips = seedsRef.current?.querySelectorAll('.seed')
    if (!chips?.length) return
    animate(chips, {
      opacity: [0, 1],
      y: [14, 0],
      delay: stagger(60, { start: 150 }),
      ease: createSpring({ stiffness: 110, damping: 13 }),
    })
    return () => utils.remove(chips)
  }, [reduced, station.id])

  /* The verdict card lands with a little weight — it is the moment the child
     finds out whether their idea survives contact with physics. */
  useEffect(() => {
    if (!result || reduced) return
    const el = resultRef.current
    if (!el) return
    animate(el, {
      opacity: [0, 1],
      y: [22, 0],
      scale: [0.985, 1],
      ease: createSpring({ stiffness: 100, damping: 15 }),
    })
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    return () => utils.remove(el)
  }, [result, reduced])

  async function attachSketch(file) {
    if (!file) return
    try {
      setError(null)
      setSketch(await fileToDownscaledDataUrl(file))
      setSketchName(file.name || 'your drawing')
    } catch (err) {
      setError(err.message)
    }
  }

  async function submit() {
    if (!text.trim() && !sketch) {
      setError(mode === 'explorer' ? 'Write your idea, or add a drawing.' : 'Describe your design, or attach a sketch.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await reviewIdea({
        stationId: station.id,
        missionId,
        mode,
        age,
        text: text.trim(),
        image: sketch,
        picks,
      })
      setResult({ ...res, sourceText: text.trim(), generatedMode: mode })
    } catch (err) {
      setError(err.message || 'That did not go through. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  const meta = result ? VERDICT[result.verdict] || VERDICT.partly : null
  const adoptable = result && result.verdict !== 'off-topic' && !result.declined

  function adopt() {
    onAdopt({
      kind: 'custom',
      name: result.name,
      summary: result.summary,
      howItWorks: result.howItWorks,
      realCounterpart: result.realCounterpart,
      goodThinking: result.goodThinking,
      physicsProblems: result.physicsProblems,
      tags: result.tags,
      verdict: result.verdict,
      sourceText: result.sourceText,
      sketch,
      model3d: null,
    })
    setResult(null)
    setText('')
    setSketch(null)
    setSketchName(null)
  }

  return (
    <section className="describe" style={{ '--role': `var(--role-${lesson.role})` }}>
      <header className="describe__head">
        <span className="squeeze describe__tag">Your turn</span>
        <h3 className="poster-md describe__title">{t(lesson.invite, mode)}</h3>
        <p className="describe__sub">
          {mode === 'explorer'
            ? 'There is no right answer here. Say what you want and I will tell you honestly what would happen.'
            : 'There is no correct answer. Describe what you want and I will tell you what physics does to it.'}
        </p>
      </header>

      <div className="seeds" ref={seedsRef}>
        <span className="label seeds__label">
          {mode === 'explorer' ? 'Stuck? Tap one and change it' : 'Stuck? Start from one of these and edit it'}
        </span>
        <div className="seeds__row">
          {lesson.examples.map((ex, i) => (
            <button key={i} type="button" className="seed" onClick={() => setText(t(ex, mode))}>
              {t(ex, mode)}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className="describe__box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        maxLength={1200}
        placeholder={
          mode === 'explorer'
            ? 'Write it however you like…'
            : 'Describe your design — what it is, how it works, why you chose it…'
        }
        aria-label={t(lesson.invite, mode)}
      />

      <div className="describe__row">
        <label className="btn btn--ghost describe__sketch">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => attachSketch(e.target.files?.[0])}
          />
          {sketch ? `✓ ${sketchName}` : mode === 'explorer' ? '✎ Add a drawing' : '✎ Attach a sketch'}
        </label>

        <motion.button
          type="button"
          className="btn btn--primary describe__go"
          onClick={submit}
          disabled={busy}
          whileTap={reduced ? undefined : { scale: 0.96 }}
        >
          {busy
            ? busyLabel || (mode === 'explorer' ? 'Thinking…' : 'Checking the physics…')
            : mode === 'explorer'
              ? 'Would this work?'
              : 'Check my design'}
        </motion.button>
      </div>

      {error && <p className="describe__error">{error}</p>}

      <AnimatePresence>
        {result && (
          <div className={`verdict note note--${meta.tone}`} ref={resultRef}>
            <span className="note__kind">{t(meta.stamp, mode)}</span>
            <div className="verdict__name">{result.name}</div>
            <p className="verdict__summary">{result.summary}</p>

            {result.howItWorks && (
              <div className="verdict__block">
                <span className="label">{mode === 'explorer' ? 'How it would work' : 'The engineering'}</span>
                <p>{result.howItWorks}</p>
              </div>
            )}

            {result.realCounterpart && (
              <div className="verdict__block verdict__real">
                <span className="label">
                  {mode === 'explorer' ? 'Real engineers build this too' : 'Closest real hardware'}
                </span>
                <p>{result.realCounterpart}</p>
              </div>
            )}

            {result.goodThinking?.length > 0 && (
              <div className="verdict__block">
                <span className="label">{mode === 'explorer' ? 'Clever bits' : 'What is genuinely good here'}</span>
                <ul className="tradeoffs--good">
                  {result.goodThinking.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            )}

            {result.physicsProblems?.length > 0 && (
              <div className="verdict__block">
                <span className="label">{mode === 'explorer' ? 'Problems to solve' : 'What physics does to it'}</span>
                <ul className="tradeoffs--limit">
                  {result.physicsProblems.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            <div className="verdict__actions">
              {adoptable ? (
                <motion.button
                  className="btn btn--primary"
                  onClick={adopt}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                >
                  {mode === 'explorer' ? 'Put this on my satellite' : 'Fit this to the spacecraft'}
                </motion.button>
              ) : (
                <span className="label">
                  {mode === 'explorer' ? 'Try describing a satellite part' : 'Nothing here to fit yet'}
                </span>
              )}
              <button className="btn btn--bare" onClick={() => setResult(null)}>
                {mode === 'explorer' ? 'Change my idea' : 'Revise'}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
