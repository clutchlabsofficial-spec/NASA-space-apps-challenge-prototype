import { STATIONS } from '../data/stations/index.js'

export default function TopBar({ mode, setMode, mission, picks, onHome, screen }) {
  const done = STATIONS.filter((s) => picks[s.id]).length

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <button className="topbar__mark" onClick={onHome} style={{ background: 'none', border: 0, padding: 0 }}>
          CUBESAT<span>/</span>BUILDER
        </button>
        {mission && (
          <div className="topbar__mission mono">
            <span style={{ color: 'var(--primary)' }}>{mission.codename}</span>
            <span>·</span>
            <span>{mode === 'explorer' ? mission.name.x : mission.name.e}</span>
          </div>
        )}
      </div>

      {mission && screen !== 'mission' && (
        <div className="topbar__progress">
          <span className="label">{done}/{STATIONS.length}</span>
          <div className="pips">
            {STATIONS.map((s) => (
              <span key={s.id} className={`pip ${picks[s.id] ? 'pip--done' : ''}`} title={s.code} />
            ))}
          </div>
        </div>
      )}

      <div className="modeswitch" role="group" aria-label="Reading mode">
        <button aria-pressed={mode === 'explorer'} onClick={() => setMode('explorer')}>
          Explorer
        </button>
        <button aria-pressed={mode === 'engineer'} onClick={() => setMode('engineer')}>
          Engineer
        </button>
      </div>
      <span className="modeswitch__hint">
        {mode === 'explorer' ? 'Ages under 11 · simpler words, same facts' : 'Ages 11–18 · full vocabulary, more options'}
      </span>
    </header>
  )
}
