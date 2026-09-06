import { useEffect, useState } from 'react'
import { STATIONS, visibleOptions, resolvePicks, isChosen, asList, isCustom, pickKey } from '../data/stations/index.js'
import { briefingFor, notesTriggeredBy } from '../lib/consequences.js'
import { t, Note, SourceChips } from './bits.jsx'
import { MascotSays } from './Mascot.jsx'
import OptionCard from './OptionCard.jsx'
import InventPanel from './InventPanel.jsx'
import CubeSatSVG from './CubeSatSVG.jsx'

const scrollBehavior = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

export default function StationView({ station, picks, mode, missionId, onToggle, onUpdate, onGoto, onBackToPath, onFinish }) {
  const [expanded, setExpanded] = useState(null)
  const index = STATIONS.indexOf(station)
  const options = visibleOptions(station, mode)
  const briefing = briefingFor(station.id, picks)
  const chosen = resolvePicks(station.id, picks)
  const customPicks = asList(picks[station.id]).filter(isCustom)
  const fired = chosen.length ? notesTriggeredBy(station.id, picks) : []
  const next = STATIONS[index + 1]
  const allDone = STATIONS.every((s) => asList(picks[s.id]).length > 0)

  useEffect(() => {
    setExpanded(null)
    window.scrollTo({ top: 0, behavior: scrollBehavior() })
  }, [station.id])

  return (
    <div className="shell station">
      <header className="lesson__head">
        <button className="lesson__close" onClick={onBackToPath} aria-label="Back to the build path">
          ✕
        </button>
        <div className="lesson__bar" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={STATIONS.length}>
          <span style={{ width: `${((index + 1) / STATIONS.length) * 100}%` }} />
        </div>
        <span className="lesson__count mono">{index + 1}/{STATIONS.length}</span>
      </header>

      <div className="lesson__title">
        <span className="mono lesson__code">{station.code}</span>
        <h1>{t(station.name, mode)}</h1>
        <p>{t(station.subtitle, mode)}</p>
      </div>

      <MascotSays mood="thinking">{t(station.primer, mode)}</MascotSays>

      {station.realTalk && (
        <div className="realtalk">
          <span className="realtalk__tag mono">{mode === 'explorer' ? 'Did you know' : 'Real talk'}</span>
          <p>{t(station.realTalk, mode)}</p>
        </div>
      )}

      {briefing.length > 0 && (
        <section className="briefing">
          <span className="label briefing__head">
            {mode === 'explorer' ? 'Because of what you already picked' : 'Incoming constraints from your earlier choices'}
          </span>
          {briefing.map((r) => (
            <Note key={r.id} rule={r} mode={mode} />
          ))}
        </section>
      )}

      <div className="question">
        <h2>{t(station.question, mode)}</h2>
        <span className={`question__mode mono ${station.multi ? 'question__mode--multi' : ''}`}>
          {station.multi
            ? mode === 'explorer' ? '✚ Pick as many as you like!' : 'Multiple choices allowed'
            : mode === 'explorer' ? 'Pick one' : 'Choose one'}
        </span>
      </div>

      <div className="options">
        {options.map((o) => (
          <OptionCard
            key={o.id}
            option={o}
            mode={mode}
            multi={station.multi}
            chosen={isChosen(picks, station.id, o.id)}
            expanded={expanded === o.id}
            onToggleOpen={() => setExpanded(expanded === o.id ? null : o.id)}
            onChoose={() => onToggle(station.id, o.id)}
            firedNotes={fired}
          />
        ))}
      </div>

      {mode === 'explorer' && station.options.some((o) => o.level === 'engineer') && (
        <p className="label options__more">
          There are more advanced choices here — switch to Engineer Mode to see them
        </p>
      )}

      <InventPanel
        station={station}
        mode={mode}
        missionId={missionId}
        picks={picks}
        customPicks={customPicks}
        onAdopt={(custom) => onToggle(station.id, custom)}
        onUpdate={(key, custom) => onUpdate(station.id, key, custom)}
        onRemove={(custom) => onToggle(station.id, custom)}
      />

      <SourceChips ids={station.sources} label={mode === 'explorer' ? 'Where this comes from' : 'Station references'} />

      {chosen.length > 0 && (
        <div className="fitted">
          <div className="fitted__art">
            <CubeSatSVG picks={picks} />
          </div>
          <div className="fitted__list">
            <span className="label">{mode === 'explorer' ? 'On your satellite now' : 'Fitted at this station'}</span>
            <ul>
              {chosen.map((o) => (
                <li key={o.id}>
                  <span>{t(o.name, mode)}</span>
                  <button className="fitted__remove" onClick={() => onToggle(station.id, o.custom ? o.detail : o.id)}>
                    {mode === 'explorer' ? 'take off' : 'remove'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Duolingo's pinned action bar: one obvious thing to do next, always. */}
      <div className="actionbar">
        <div className="actionbar__inner">
          <button className="btn btn--bare" onClick={onBackToPath}>
            {mode === 'explorer' ? 'Back to the path' : 'Build path'}
          </button>
          {allDone && !next ? (
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
                ? mode === 'explorer' ? 'Pick something first' : 'Choose an approach'
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
