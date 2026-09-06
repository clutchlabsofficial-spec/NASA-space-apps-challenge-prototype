import { t, SourceChips, Note } from './bits.jsx'

export default function OptionCard({ option, mode, picked, expanded, onToggle, onPick, firedNotes }) {
  return (
    <div className={`option panel ${picked ? 'option--picked' : ''}`}>
      <button className="option__bar" onClick={onToggle} aria-expanded={expanded}>
        <span className="option__dot" aria-hidden="true" />
        <span>
          <span className="option__name">
            {t(option.name, mode)}
            {option.level === 'engineer' && <span className="option__flag">Engineer</span>}
          </span>
          <span className="option__blurb" style={{ display: 'block' }}>
            {t(option.blurb, mode)}
          </span>
        </span>
        <span className="option__chev">{expanded ? 'Close −' : 'How it works +'}</span>
      </button>

      {expanded && (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__block">
              <span className="label">{mode === 'explorer' ? 'How it works' : 'How it actually works'}</span>
              <p>{t(option.how, mode)}</p>
            </div>
            <div className="detail__block">
              <span className="label">{mode === 'explorer' ? 'What it is made of' : 'Materials & construction'}</span>
              <p>{t(option.madeOf, mode)}</p>
            </div>
            <div className="detail__block" style={{ gridColumn: '1 / -1' }}>
              <span className="label">{mode === 'explorer' ? 'Why engineers pick it' : 'Why real engineers choose it'}</span>
              <p>{t(option.whyChosen, mode)}</p>
            </div>
          </div>

          <div className="tradeoffs">
            <div>
              <span className="label">{mode === 'explorer' ? 'Good things' : 'Strengths'}</span>
              <ul className="tradeoffs--good">
                {option.tradeoffs.strengths.map((s, i) => (
                  <li key={i}>{t(s, mode)}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="label">{mode === 'explorer' ? 'Not-so-good things' : 'Honest limits'}</span>
              <ul className="tradeoffs--limit">
                {option.tradeoffs.limits.map((s, i) => (
                  <li key={i}>{t(s, mode)}</li>
                ))}
              </ul>
            </div>
          </div>

          {option.facts?.length > 0 && (
            <div className="facts">
              {option.facts.map((f, i) => (
                <div className="facts__row" key={i}>
                  <span className="facts__k">{f.label}</span>
                  <span className="facts__v">{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {option.flown && (
            <div className="flown">
              <span className="label">{mode === 'explorer' ? 'This really flew' : 'Flight heritage'}</span>
              {option.flown}
            </div>
          )}

          <SourceChips ids={option.sources} label={mode === 'explorer' ? 'Read more' : 'Sources'} />

          <div className="detail__cta">
            <button className="btn" onClick={onPick}>
              {picked
                ? mode === 'explorer' ? 'Chosen ✓' : 'Selected ✓'
                : mode === 'explorer' ? 'Pick this one' : 'Select this approach'}
            </button>
            {picked && firedNotes?.length > 0 && (
              <span className="label">{mode === 'explorer' ? 'Look what this changes ↓' : 'Consequences of this choice ↓'}</span>
            )}
          </div>

          {picked && firedNotes?.length > 0 && (
            <div className="fired">
              {firedNotes.map((r) => (
                <Note key={r.id} rule={r} mode={mode} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
