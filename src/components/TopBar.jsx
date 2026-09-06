import { useEffect, useState } from 'react'

/** A floating "+20 XP" that acknowledges the work and gets out of the way. */
function XpToast({ toast, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!toast) return
    setLeaving(false)
    const a = setTimeout(() => setLeaving(true), 1600)
    const b = setTimeout(onDone, 2200)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [toast, onDone])

  if (!toast) return null
  return (
    <div className={`xptoast ${leaving ? 'xptoast--out' : ''}`} key={toast.id} role="status">
      <span className="xptoast__amount">+{toast.amount} XP</span>
      <span className="xptoast__label">{toast.label}</span>
    </div>
  )
}

export default function TopBar({ mode, setMode, mission, screen, built, total, parts, xp, toast, onClearToast, onHome }) {
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

      <XpToast toast={toast} onDone={onClearToast} />
    </header>
  )
}
