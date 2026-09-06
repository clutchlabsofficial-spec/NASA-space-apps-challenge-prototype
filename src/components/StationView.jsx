import { useEffect, useState } from 'react'
import { STATIONS, visibleOptions, isCustom } from '../data/stations/index.js'
import { briefingFor, notesTriggeredBy } from '../lib/consequences.js'
import { t, Note, SourceChips } from './bits.jsx'
import OptionCard from './OptionCard.jsx'
import Viewer from './Viewer.jsx'
import InventPanel from './InventPanel.jsx'

export default function StationView({ station, picks, mode, missionId, onPick, onGoto, onFinish }) {
  const [expanded, setExpanded] = useState(null)
  const index = STATIONS.indexOf(station)
  const options = visibleOptions(station, mode)
  const briefing = briefingFor(station.id, picks)
  const pick = picks[station.id]
  const customPick = isCustom(pick) ? pick : null
  const pickedId = typeof pick === 'string' ? pick : null
  const fired = pick ? notesTriggeredBy(station.id, picks) : []
  const allDone = STATIONS.every((s) => picks[s.id])

  // Opening a new station should not inherit the previous one's open card.
  useEffect(() => {
    setExpanded(typeof picks[station.id] === 'string' ? picks[station.id] : null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station.id])

  const next = STATIONS[index + 1]
  const prev = STATIONS[index - 1]

  return (
    <div className="shell build">
      {/* ---------------- station rail ---------------- */}
      <nav className="rail">
        <div className="rail__head label">{mode === 'explorer' ? 'Parts to build' : 'Subsystems'}</div>
        <div className="rail__list">
          {STATIONS.map((s, i) => (
            <button
              key={s.id}
              className={`railitem ${s.id === station.id ? 'railitem--active' : ''} ${picks[s.id] ? 'railitem--done' : ''}`}
              onClick={() => onGoto(s.id)}
            >
              <span className="railitem__code">{String(i + 1).padStart(2, '0')} {s.code}</span>
              <span className="railitem__name">{t(s.name, mode)}</span>
              <span className="railitem__tick">{picks[s.id] ? '✓' : ''}</span>
            </button>
          ))}
        </div>
        <button className="btn rail__done" onClick={onFinish} disabled={!allDone}>
          {allDone
            ? mode === 'explorer' ? 'See your satellite' : 'Flight readiness review'
            : mode === 'explorer' ? 'Finish every part first' : 'Complete all subsystems'}
        </button>
      </nav>

      {/* ---------------- station body ---------------- */}
      <main className="station">
        <header className="station__head">
          <div className="station__index mono">
            Station {String(index + 1).padStart(2, '0')} / {String(STATIONS.length).padStart(2, '0')} · {station.code}
          </div>
          <h1 className="station__title">{t(station.name, mode)}</h1>
          <p className="station__sub">{t(station.subtitle, mode)}</p>
        </header>

        <section className="panel primer">
          <span className="label">{mode === 'explorer' ? 'What this part does' : 'What this subsystem is for'}</span>
          <p>{t(station.primer, mode)}</p>
        </section>

        {station.realTalk && (
          <div className="realtalk">
            <span className="realtalk__tag mono">{mode === 'explorer' ? 'Did you know' : 'Real talk'}</span>
            <p>{t(station.realTalk, mode)}</p>
          </div>
        )}

        {briefing.length > 0 && (
          <section className="briefing">
            <span className="label briefing__head">
              {mode === 'explorer'
                ? 'Because of what you already picked'
                : 'Incoming constraints from your earlier choices'}
            </span>
            {briefing.map((r) => (
              <Note key={r.id} rule={r} mode={mode} />
            ))}
          </section>
        )}

        <h2 className="question">{t(station.question, mode)}</h2>

        <div className="options">
          {options.map((o) => (
            <OptionCard
              key={o.id}
              option={o}
              mode={mode}
              picked={pickedId === o.id}
              expanded={expanded === o.id}
              onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
              onPick={() => onPick(station.id, o.id)}
              firedNotes={fired}
            />
          ))}
        </div>

        <InventPanel
          station={station}
          mode={mode}
          missionId={missionId}
          picks={picks}
          currentCustom={customPick}
          onAdopt={(custom) => onPick(station.id, custom)}
          onRemove={() => onPick(station.id, null)}
        />

        {mode === 'engineer' && station.options.some((o) => o.level === 'engineer') && (
          <p className="label" style={{ marginTop: 14 }}>
            Options tagged Engineer are hidden in Explorer Mode
          </p>
        )}
        {mode === 'explorer' && station.options.some((o) => o.level === 'engineer') && (
          <p className="label" style={{ marginTop: 14 }}>
            There are more advanced choices here — switch to Engineer Mode to see them
          </p>
        )}

        <SourceChips ids={station.sources} label={mode === 'explorer' ? 'Where this comes from' : 'Station references'} />

        <div className="station__nav">
          {prev && (
            <button className="btn btn--bare" onClick={() => onGoto(prev.id)}>
              ← {t(prev.name, mode)}
            </button>
          )}
          <span className="spacer" />
          {next ? (
            <button className="btn" onClick={() => onGoto(next.id)} disabled={!pick}>
              {pick ? `${t(next.name, mode)} →` : mode === 'explorer' ? 'Pick one to continue' : 'Select an approach to continue'}
            </button>
          ) : (
            <button className="btn" onClick={onFinish} disabled={!allDone}>
              {mode === 'explorer' ? 'See your satellite →' : 'Flight readiness review →'}
            </button>
          )}
        </div>
      </main>

      <Viewer picks={picks} mode={mode} />
    </div>
  )
}
