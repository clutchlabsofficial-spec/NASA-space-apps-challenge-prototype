import { SOURCES } from '../data/sources.js'

/** Pick the wording for the current age mode. Same facts, different reader. */
export const t = (pair, mode) => (pair ? (mode === 'explorer' ? pair.x : pair.e) : '')

export function SourceChips({ ids = [], label = 'Sources' }) {
  if (!ids.length) return null
  return (
    <div className="sourcechips">
      <span className="label">{label}</span>
      {ids.map((id) => {
        const s = SOURCES[id]
        if (!s) return null
        return (
          <a key={id} className="sourcechip" href={s.url} target="_blank" rel="noreferrer" title={s.title}>
            {s.short}
          </a>
        )
      })}
    </div>
  )
}

const KIND_LABEL = {
  good: { e: 'This pays off', x: 'Good news' },
  tension: { e: 'Real tradeoff', x: 'Watch out' },
  blocker: { e: 'This does not work', x: 'This will not work' },
}

export function Note({ rule, mode }) {
  return (
    <div className={`note note--${rule.kind}`}>
      <span className="note__kind">{t(KIND_LABEL[rule.kind], mode)}</span>
      <div className="note__title">{t(rule.title, mode)}</div>
      <p>{t(rule.body, mode)}</p>
    </div>
  )
}
