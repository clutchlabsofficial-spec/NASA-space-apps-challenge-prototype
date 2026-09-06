import { useState } from 'react'
import { reviewIdea, fileToDownscaledDataUrl } from '../lib/api.js'
import { t } from './bits.jsx'
import SketchStudio from './SketchStudio.jsx'

const VERDICT = {
  works: {
    stamp: { e: 'This would work', x: 'This works!' },
    tone: 'good',
  },
  partly: {
    stamp: { e: 'Partly works', x: 'Almost' },
    tone: 'tension',
  },
  'wont-work': {
    stamp: { e: 'Physics says no', x: 'This would not work' },
    tone: 'blocker',
  },
  'off-topic': {
    stamp: { e: 'Not a subsystem idea', x: 'Let us get back to the satellite' },
    tone: 'tension',
  },
}

/**
 * A child's own idea for a subsystem. Claude judges it against the same curated
 * reference material the standard options come from, and — crucially — returns
 * tags from the app's fixed vocabulary, so an invented part flows through the
 * coupling rules and the final review exactly like a real one.
 */
export default function InventPanel({ station, mode, missionId, picks, currentCustom, onAdopt, onRemove }) {
  const [open, setOpen] = useState(Boolean(currentCustom))
  const [text, setText] = useState(currentCustom?.sourceText || '')
  const [sketch, setSketch] = useState(null)
  const [sketchName, setSketchName] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(currentCustom || null)

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
      setError(mode === 'explorer' ? 'Write your idea or add a drawing first.' : 'Describe the idea or attach a sketch.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await reviewIdea({
        stationId: station.id,
        missionId,
        mode,
        text,
        image: sketch,
        picks,
      })
      setResult({ ...res, sourceText: text, generatedMode: mode })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const adopt = () => {
    onAdopt({
      kind: 'custom',
      name: result.name,
      summary: result.summary,
      howItWorks: result.howItWorks,
      realCounterpart: result.realCounterpart,
      goodThinking: result.goodThinking,
      physicsProblems: result.physicsProblems,
      verdict: result.verdict,
      tags: result.tags,
      sourceText: text,
      generatedMode: result.generatedMode,
      modelPath: currentCustom?.modelPath || null,
    })
  }

  const meta = result ? VERDICT[result.verdict] : null
  const staleMode = result?.generatedMode && result.generatedMode !== mode
  const adoptable = result && result.verdict !== 'off-topic' && result.tags.length > 0

  if (!open) {
    return (
      <button className="invent__open" onClick={() => setOpen(true)}>
        <span className="invent__spark" aria-hidden="true">✳</span>
        <span>
          <strong>{mode === 'explorer' ? 'Or invent your own!' : 'Or design your own'}</strong>
          <em>
            {mode === 'explorer'
              ? 'Have a different idea? Describe it or draw it, and find out if it would really work.'
              : 'Describe or sketch your own approach. Claude will judge it against real engineering and fold it into your build.'}
          </em>
        </span>
        <span className="invent__go mono">Open →</span>
      </button>
    )
  }

  return (
    <section className="panel invent">
      <div className="invent__head">
        <span className="label">
          {mode === 'explorer' ? 'Your own idea for this part' : `Your own ${t(station.name, mode)} design`}
        </span>
        <button className="invent__close" onClick={() => setOpen(false)} aria-label="Close">
          ✕
        </button>
      </div>

      <textarea
        className="invent__text"
        rows={4}
        maxLength={1200}
        placeholder={
          mode === 'explorer'
            ? 'What is your idea? For example: "a big umbrella that opens up to catch sunlight"'
            : 'Describe your approach — what it does, how you think it works, what it is made of.'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="invent__row">
        <label className="btn btn--bare invent__attach">
          {sketch ? `✓ ${sketchName}` : mode === 'explorer' ? '✎ Add a drawing' : '✎ Attach a sketch'}
          <input type="file" accept="image/*" hidden onChange={(e) => attachSketch(e.target.files?.[0])} />
        </label>
        {sketch && (
          <button className="btn btn--bare" onClick={() => { setSketch(null); setSketchName(null) }}>
            Remove drawing
          </button>
        )}
        <span className="spacer" />
        <button className="btn" onClick={submit} disabled={busy}>
          {busy
            ? mode === 'explorer' ? 'Thinking…' : 'Reviewing…'
            : mode === 'explorer' ? 'Would this work?' : 'Review my design'}
        </button>
      </div>

      {error && <p className="invent__error">{error}</p>}

      {result && (
        <div className={`invent__result note note--${meta.tone}`}>
          <span className="note__kind">{t(meta.stamp, mode)}</span>
          <div className="note__title">{result.name}</div>
          <p>{result.summary}</p>

          {result.howItWorks && (
            <div className="invent__block">
              <span className="label">{mode === 'explorer' ? 'How it would work' : 'The engineering'}</span>
              <p>{result.howItWorks}</p>
            </div>
          )}

          {result.realCounterpart && (
            <div className="invent__block invent__real">
              <span className="label">{mode === 'explorer' ? 'Real engineers build this too' : 'Closest real hardware'}</span>
              <p>{result.realCounterpart}</p>
            </div>
          )}

          {result.goodThinking?.length > 0 && (
            <div className="invent__block">
              <span className="label">{mode === 'explorer' ? 'Clever bits' : 'What is genuinely good here'}</span>
              <ul className="tradeoffs--good">
                {result.goodThinking.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          {result.physicsProblems?.length > 0 && (
            <div className="invent__block">
              <span className="label">{mode === 'explorer' ? 'Problems to solve' : 'What physics does to it'}</span>
              <ul className="tradeoffs--limit">
                {result.physicsProblems.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {result.tags?.length > 0 && (
            <div className="invent__tags">
              <span className="label">{mode === 'explorer' ? 'What this means for the rest of your satellite' : 'Engineering properties applied to your build'}</span>
              <div className="invent__chips">
                {result.tags.map((tag) => (
                  <span key={tag} className="invent__chip mono">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {staleMode && (
            <div className="invent__stale">
              <span>
                {mode === 'explorer'
                  ? 'This was written for older readers.'
                  : 'This was written in Explorer wording.'}
              </span>
              <button className="btn btn--bare" onClick={submit} disabled={busy}>
                {busy ? 'Rewriting…' : mode === 'explorer' ? 'Say it more simply' : 'Rewrite for Engineer Mode'}
              </button>
            </div>
          )}

          <div className="invent__row invent__actions">
            {adoptable ? (
              <button className="btn" onClick={adopt}>
                {currentCustom
                  ? mode === 'explorer' ? 'Update my satellite' : 'Update the build'
                  : mode === 'explorer' ? 'Put this on my satellite' : 'Use this design'}
              </button>
            ) : (
              <span className="label">
                {mode === 'explorer' ? 'Try describing a satellite part' : 'Nothing here to fit to the spacecraft yet'}
              </span>
            )}
            {currentCustom && (
              <button className="btn btn--bare" onClick={onRemove}>
                {mode === 'explorer' ? 'Take it off again' : 'Remove from build'}
              </button>
            )}
          </div>
        </div>
      )}

      {currentCustom && (
        <div className="invent__sketch3d">
          <SketchStudio
            mode={mode}
            label={mode === 'explorer' ? 'Turn your drawing into a real 3D model' : 'Sketch to 3D — this part'}
            existingModel={currentCustom.modelPath}
            onModel={(modelPath) => onAdopt({ ...currentCustom, modelPath })}
          />
        </div>
      )}
    </section>
  )
}
