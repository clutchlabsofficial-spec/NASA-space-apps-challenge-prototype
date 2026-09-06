export default function TopBar({ mode, setMode, mission, screen, built, total, parts, xp, onHome }) {
  const showStats = Boolean(mission) && screen !== 'mission'

  return (
    <header className="topbar">
      <button className="topbar__mark" onClick={onHome}>
        CUBESAT<span>/</span>BUILDER
      </button>

      {showStats && (
        <div className="stats" aria-label="Your progress">
          <span className="stat" title="Subsystems built">
            <span className="stat__icon" aria-hidden="true">🛰️</span>
            <span className="stat__value">{built}/{total}</span>
          </span>
          <span className="stat" title="Parts fitted">
            <span className="stat__icon" aria-hidden="true">🔧</span>
            <span className="stat__value">{parts}</span>
          </span>
          <span className="stat stat--xp" title="Experience points">
            <span className="stat__icon" aria-hidden="true">⚡</span>
            <span className="stat__value">{xp}</span>
          </span>
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
    </header>
  )
}
