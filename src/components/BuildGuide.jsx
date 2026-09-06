import { useEffect, useMemo, useState } from 'react'
import { buildSteps } from '../lib/buildSteps.js'
import { t } from './bits.jsx'
import Mascot, { MascotSays } from './Mascot.jsx'

/**
 * The assembly guide, taught the way the reference app teaches a chess opening:
 * one step per screen, a mascot saying the one thing worth remembering, a
 * checklist you actually tick, and a single Continue. You cannot skim it, and
 * you always know how far through you are.
 */
export default function BuildGuide({ picks, mode, onBack, onAward, onDone }) {
  const steps = useMemo(() => buildSteps(picks, mode), [picks, mode])
  const [index, setIndex] = useState(0)
  const [ticked, setTicked] = useState({})
  const [finished, setFinished] = useState(false)

  const step = steps[index]
  const stepTicks = ticked[step?.id] || new Set()
  const allTicked = step ? stepTicks.size >= step.checklist.length : false

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [index, finished])

  const toggle = (i) =>
    setTicked((prev) => {
      const next = new Set(prev[step.id] || [])
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return { ...prev, [step.id]: next }
    })

  const advance = () => {
    onAward?.(step.xp || 20, t(step.title, mode))
    if (index + 1 < steps.length) setIndex(index + 1)
    else setFinished(true)
  }

  if (finished) {
    return (
      <div className="shell guide guide--done">
        <div className="guide__trophy">
          <Mascot mood="excited" size={128} talking />
        </div>
        <h1>{mode === 'explorer' ? 'You built a satellite!' : 'Build complete'}</h1>
        <p>
          {mode === 'explorer'
            ? 'You designed it, you bought the parts, you wired it up, you tested it and you flew it. That is exactly what a real space team does — just with a bigger budget.'
            : 'Design, procurement, integration, environmental test, operations rehearsal, flight. That is the full lifecycle of a real mission, and you have now walked all of it.'}
        </p>
        <div className="guide__done-actions">
          <button className="btn btn--big" onClick={onDone}>
            {mode === 'explorer' ? 'Back to my satellite' : 'Back to the review'}
          </button>
          <button className="btn btn--bare" onClick={() => { setIndex(0); setFinished(false) }}>
            {mode === 'explorer' ? 'Read it again' : 'Restart the guide'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="shell guide">
      <header className="lesson__head">
        <button className="lesson__close" onClick={onBack} aria-label="Back">✕</button>
        <div className="lesson__bar" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={steps.length}>
          <span style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="lesson__count mono">{index + 1}/{steps.length}</span>
      </header>

      <div className="guide__phase mono">{t(step.phase, mode)}</div>
      <h1 className="guide__title">{t(step.title, mode)}</h1>

      <MascotSays mood="thinking" size={68} lead={t(step.nova, mode)}>
        {t(step.body, mode)}
      </MascotSays>

      {step.warning && (
        <div className="guide__warning">
          <span className="mono">{mode === 'explorer' ? '⚠ Careful' : '⚠ Safety'}</span>
          <p>{t(step.warning, mode)}</p>
        </div>
      )}

      <div className="guide__checks">
        <span className="label">{mode === 'explorer' ? 'Tick these off' : 'Completion criteria'}</span>
        {step.checklist.map((c, i) => (
          <label key={i} className={`check ${stepTicks.has(i) ? 'check--on' : ''}`}>
            <input type="checkbox" checked={stepTicks.has(i)} onChange={() => toggle(i)} />
            <span className="check__mark" aria-hidden="true">{stepTicks.has(i) ? '✓' : ''}</span>
            <span>{t(c, mode)}</span>
          </label>
        ))}
      </div>

      <div className="actionbar">
        <div className="actionbar__inner">
          <button className="btn btn--bare" onClick={() => (index > 0 ? setIndex(index - 1) : onBack())} >
            {index > 0 ? (mode === 'explorer' ? 'Back a step' : 'Previous') : mode === 'explorer' ? 'Back' : 'Exit'}
          </button>
          <button className="btn btn--big" onClick={advance} disabled={!allTicked}>
            {allTicked
              ? index + 1 < steps.length
                ? mode === 'explorer' ? 'Next step →' : 'Continue →'
                : mode === 'explorer' ? 'Finish!' : 'Complete build'
              : mode === 'explorer' ? 'Tick them all first' : 'Complete the criteria'}
          </button>
        </div>
      </div>
    </div>
  )
}
