import CubeSatSVG from './CubeSatSVG.jsx'
import { STATIONS, resolvePick } from '../data/stations/index.js'
import { useIsDesktop } from '../lib/useMediaQuery.js'
import { t } from './bits.jsx'

export default function Viewer({ picks, mode }) {
  const isDesktop = useIsDesktop()
  const done = Object.keys(picks).length

  return (
    <aside className="viewer">
      <div className="panel viewer__frame">
        <div className="viewer__head">
          <span className="label">Flight configuration</span>
          <span className="label">{done}/{STATIONS.length}</span>
        </div>
        <CubeSatSVG picks={picks} />
      </div>

      {/* On a phone an eleven-row manifest between the satellite and the actual
          content pushes everything off the first screen, so it collapses. */}
      <details className="panel manifest" open={isDesktop}>
        <summary className="manifest__summary">
          <span className="label">{mode === 'explorer' ? 'Your parts list' : 'Configuration manifest'}</span>
          <span className="mono manifest__count">{done}/{STATIONS.length}</span>
        </summary>
        <div className="manifest__body">
          {STATIONS.map((s) => {
            const opt = resolvePick(s.id, picks[s.id])
            return (
              <div className="manifest__row" key={s.id}>
                <span className="manifest__k">{s.code}</span>
                <span className={`manifest__v ${opt ? '' : 'manifest__v--empty'}`}>
                  {opt ? t(opt.name, mode) : mode === 'explorer' ? 'not chosen yet' : 'unassigned'}
                  {opt?.custom && <span className="manifest__own">yours</span>}
                </span>
              </div>
            )
          })}
        </div>
      </details>
    </aside>
  )
}
