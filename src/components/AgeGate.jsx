import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { animate, createSpring, stagger, utils } from 'animejs'
import { parseAge, modeForAge, MODE_LABEL, MIN_AGE, MAX_AGE } from '../lib/age.js'
import { PHOTOS } from '../data/photos.js'

/**
 * The first screen. One question: how old are you?
 *
 * Nothing here is a gate in the restrictive sense — no age is turned away, and
 * the answer only chooses how things are worded. But it is the first thing the
 * app asks, because every sentence after it depends on the answer.
 *
 * Deliberately not a dropdown of ranges. A child typing "9" is telling the
 * truth about themselves; a child picking "8–10" is being sorted into a box.
 * The number also goes to Claude verbatim, where it calibrates far better than
 * a bucket would.
 */
export default function AgeGate({ onStart }) {
  const [raw, setRaw] = useState('')
  const [touched, setTouched] = useState(false)
  const [override, setOverride] = useState(null)
  const inputRef = useRef(null)
  const numbersRef = useRef(null)
  const reduced = useReducedMotion()

  const age = parseAge(raw)
  const suggested = age != null ? modeForAge(age) : null
  const mode = override || suggested

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 450)
    return () => clearTimeout(id)
  }, [])

  /* The quick-pick numbers fly in on a spring. anime.js drives this rather than
     Motion because a stagger across eleven siblings is one call here, and the
     spring solver gives the overshoot that makes them feel like physical
     buttons rather than fading divs. */
  useEffect(() => {
    if (reduced) return
    const el = numbersRef.current
    if (!el) return
    const chips = el.querySelectorAll('.agechip')
    if (!chips.length) return
    animate(chips, {
      scale: [0, 1],
      y: [18, 0],
      opacity: [0, 1],
      delay: stagger(38, { start: 260 }),
      ease: createSpring({ stiffness: 120, damping: 11 }),
    })
    return () => utils.remove(chips)
  }, [reduced])

  const submit = (e) => {
    e?.preventDefault()
    setTouched(true)
    if (age == null) return
    onStart({ age, mode: mode || modeForAge(age) })
  }

  const quick = [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18]

  return (
    <motion.main
      className="gate"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="gate__sky" aria-hidden="true">
        <img src={PHOTOS.deploy.src} alt="" loading="eager" />
      </div>

      <div className="gate__inner">
        <motion.p
          className="squeeze gate__eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Before we build anything
        </motion.p>

        <motion.h1
          className="poster-xl gate__title"
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, type: 'spring', stiffness: 90, damping: 14 }}
        >
          How old<br />are you?
        </motion.h1>

        <motion.p
          className="gate__why"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34 }}
        >
          It changes how I explain things — not what I tell you. The engineering
          is exactly the same either way.
        </motion.p>

        <form className="gate__form" onSubmit={submit}>
          <div className="gate__row">
            <input
              ref={inputRef}
              className="gate__input"
              type="number"
              inputMode="numeric"
              min={MIN_AGE}
              max={MAX_AGE}
              placeholder="10"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              aria-label="Your age"
              aria-describedby="gate-hint"
            />
            <button className="btn btn--primary gate__go" type="submit" disabled={age == null}>
              Start building
            </button>
          </div>

          <div className="agechips" ref={numbersRef} role="group" aria-label="Quick pick your age">
            {quick.map((n) => (
              <button
                key={n}
                type="button"
                className={`agechip ${age === n ? 'agechip--on' : ''}`}
                onClick={() => {
                  setRaw(String(n))
                  setOverride(null)
                }}
              >
                {n}
              </button>
            ))}
          </div>

          <p id="gate-hint" className="gate__hint">
            {touched && age == null
              ? `Type a number between ${MIN_AGE} and ${MAX_AGE}.`
              : 'Grown-ups welcome too — put your real age in.'}
          </p>

          <AnimatePresence mode="wait">
            {mode && (
              <motion.div
                key={mode}
                className="gate__mode"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <span className="gate__modelabel">
                  I&rsquo;ll use <strong>{MODE_LABEL[mode].name}</strong> words
                  <span className="gate__modehint"> — {MODE_LABEL[mode].hint.toLowerCase()}</span>
                </span>
                <button
                  type="button"
                  className="gate__swap"
                  onClick={() => setOverride(mode === 'explorer' ? 'engineer' : 'explorer')}
                >
                  {mode === 'explorer' ? 'Give me the technical words instead' : 'Use simpler words instead'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="gate__privacy">
          Nothing you type is saved anywhere. Close the tab and it is all gone.
        </p>
      </div>
    </motion.main>
  )
}
