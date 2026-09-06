import CubeSatSVG from './CubeSatSVG.jsx'
import { STATIONS, resolvePick } from '../data/stations/index.js'
import { t } from './bits.jsx'

export default function Viewer({ picks, mode }) {
  return (
    <aside className="viewer">
      <div className="panel viewer__frame">
        <div className="viewer__head">
          <span className="label">Flight configuration</span>
          <span className="label">{Object.keys(picks).length}/{STATIONS.length}</span>
        </div>
        <CubeSatSVG picks={picks} />
      </div>

      <div className="panel manifest">
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
    </aside>
  )
}
