import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { animate, stagger, createSpring, utils } from 'animejs'
import { t, SourceChips } from './bits.jsx'
import { PHOTOS, NASA_NOTICE } from '../data/photos.js'

/**
 * A lesson, delivered before anything is chosen.
 *
 * The shape is fixed on purpose — hook, teaching beats, the trade-off axis, a
 * rule of thumb, one check — so that by the third station a child already
 * knows how a lesson goes and can concentrate on the content instead of the
 * layout.
 *
 * The axis is the part that matters. Every subsystem is a spectrum between
 * real engineering approaches, and once you can see the spectrum you can place
 * a design nobody has built yet — which is exactly what the child is asked to
 * do on the next screen.
 */

function Beat({ beat, mode, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduced = useReducedMotion()

  return (
    <motion.li
      ref={ref}
      className="beat"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="beat__n squeeze">{String(index + 1).padStart(2, '0')}</span>
      <div className="beat__body">
        <h3 className="beat__h">{t(beat.heading, mode)}</h3>
        <p>{t(beat.body, mode)}</p>
      </div>
    </motion.li>
  )
}

/** The trade-off spectrum. Cards slide in along the axis, left to right, which
 *  is the whole visual metaphor — these are positions on a line, not a menu. */
function Axis({ axis, mode }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView || reduced) return
    const cards = ref.current?.querySelectorAll('.axis__card')
    if (!cards?.length) return
    animate(cards, {
      opacity: [0, 1],
      x: [-28, 0],
      rotate: [-1.4, 0],
      delay: stagger(110),
      ease: createSpring({ stiffness: 90, damping: 14 }),
    })
    return () => utils.remove(cards)
  }, [inView, reduced])

  return (
    <section className="axis" ref={ref}>
      <header className="axis__head">
        <span className="squeeze axis__tag">The real trade-off</span>
        <h3 className="poster-md axis__title">{t(axis.label, mode)}</h3>
      </header>
      <div className="axis__line" aria-hidden="true" />
      <ol className="axis__cards">
        {axis.ends.map((end, i) => (
          <li key={i} className="axis__card">
            <span className="axis__dot" aria-hidden="true" />
            <h4 className="axis__name">{t(end.name, mode)}</h4>
            <p>{t(end.body, mode)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** One question. Tapping reveals the answer. Nothing is scored, because a
 *  child who gets it wrong should reread the lesson, not lose points. */
function Check({ check, mode }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className={`check ${open ? 'check--open' : ''}`}>
      <button
        type="button"
        className="check__q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="squeeze check__tag">Quick check</span>
        <span className="check__text">{t(check.q, mode)}</span>
        <span className="check__cue">{open ? 'Hide' : 'Show me'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="check__a"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{t(check.a, mode)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Lesson({ lesson, station, mode, onReady }) {
  const photo = PHOTOS[lesson.photo]
  const reduced = useReducedMotion()
  const titleRef = useRef(null)

  /* The station title stretches open along the variable font's width axis.
     This is the one place the `wdth` axis is animated rather than set, and it
     is why the app loads a variable family at all. */
  useEffect(() => {
    if (reduced) return
    const el = titleRef.current
    if (!el) return
    const obj = { w: 62 }
    animate(obj, {
      w: 125,
      duration: 900,
      ease: 'outExpo',
      onUpdate: () => {
        el.style.fontVariationSettings = `'wdth' ${obj.w.toFixed(1)}, 'wght' 800`
      },
    })
    return () => utils.remove(obj)
  }, [reduced, lesson])

  return (
    <div className="lesson" style={{ '--role': `var(--role-${lesson.role})` }}>
      <header className="lesson__head">
        <span className="squeeze lesson__code">{station.code} · Lesson</span>
        <h2 className="poster-lg lesson__title" ref={titleRef}>
          {t(station.name, mode)}
        </h2>
        <p className="lesson__hook">{t(lesson.hook, mode)}</p>
      </header>

      <figure className="lesson__figure">
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
        <figcaption>
          <strong>{photo.title}</strong>
          <span>{photo.caption}</span>
          <span className="lesson__credit">
            {photo.credit}
            {photo.year ? `, ${photo.year}` : ''}
          </span>
        </figcaption>
      </figure>

      <ol className="beats">
        {lesson.teach.map((beat, i) => (
          <Beat key={i} beat={beat} mode={mode} index={i} />
        ))}
      </ol>

      <Axis axis={lesson.axis} mode={mode} />

      <div className="rule">
        <span className="squeeze rule__tag">Remember this one</span>
        <p className="rule__text">{t(lesson.rule, mode)}</p>
      </div>

      <Check check={lesson.check} mode={mode} />

      <SourceChips ids={[lesson.source]} label="Where this comes from" />
      <p className="lesson__nasa">{NASA_NOTICE}</p>

      <motion.button
        type="button"
        className="btn btn--primary lesson__next"
        onClick={onReady}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        whileHover={reduced ? undefined : { y: -2 }}
      >
        {mode === 'explorer' ? 'Got it — now my turn' : 'Understood — let me design mine'}
      </motion.button>
    </div>
  )
}
