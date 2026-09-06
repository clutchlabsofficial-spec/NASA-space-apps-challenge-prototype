import { sourceList } from '../data/sources.js'

export default function References({ onBack, mode }) {
  return (
    <div className="shell refs">
      <div className="mono" style={{ color: 'var(--primary)' }}>Reference list</div>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '12px 0' }}>
        {mode === 'explorer' ? 'Where all these facts come from' : 'Everything in this app is sourced'}
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        {mode === 'explorer'
          ? 'None of this was made up. Every number and every explanation comes from real engineering documents written by the people who build satellites.'
          : 'No performance figure in this app was invented. Numbers are quoted from published NASA technical reports, the CubeSat Design Specification, regulatory filings and mission documentation. Where a figure is a range, that range is the source’s.'}
      </p>

      <div className="reflist">
        {sourceList.map((s) => (
          <a key={s.id} className="ref" href={s.url} target="_blank" rel="noreferrer">
            <span className="ref__org label">{s.org}</span>
            <div className="ref__title">{s.title}</div>
            <div className="ref__url">{s.url}</div>
          </a>
        ))}
      </div>

      <button className="btn" style={{ marginTop: 28 }} onClick={onBack}>
        ← Back
      </button>
    </div>
  )
}
