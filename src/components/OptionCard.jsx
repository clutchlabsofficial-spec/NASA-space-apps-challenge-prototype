import { t, SourceChips, Note } from './bits.jsx'

/** `reference` renders the card as flown hardware to compare against rather
 *  than a menu item to choose. The fit button becomes a secondary "build this
 *  instead" — still available, but no longer the obvious action. */
export default function OptionCard({ option, mode, chosen, multi, expanded, onToggleOpen, onChoose, firedNotes, reference = false }) {
  return (
    <div className={`option ${chosen ? 'option--chosen' : ''} ${reference ? 'option--ref' : ''}`}>
      <button className="option__bar" onClick={onToggleOpen} aria-expanded={expanded}>
        <span className={`option__mark ${multi ? 'option__mark--box' : ''}`} aria-hidden="true">
          {chosen ? '✓' : ''}
        </span>
        <span className="option__text">
          <span className="option__name">
            {t(option.name, mode)}
            {option.level === 'engineer' && <span className="option__flag">Engineer</span>}
          </span>
          <span className="option__blurb">{t(option.blurb, mode)}</span>
        </span>
        <span className="option__chev mono">{expanded ? 'Close' : 'Tell me more'}</span>
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
            <div className="detail__block detail__block--wide">
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
            <button className={`btn ${chosen || reference ? 'btn--ghost' : ''}`} onClick={onChoose}>
              {chosen
                ? mode === 'explorer' ? 'Take it off' : 'Remove from build'
                : reference
                  ? mode === 'explorer' ? 'Actually, build this one' : 'Use this instead of mine'
                  : mode === 'explorer' ? 'Put it on my satellite' : 'Fit to spacecraft'}
            </button>
          </div>

          {chosen && firedNotes?.length > 0 && (
            <div className="fired">
              <span className="label">{mode === 'explorer' ? 'Look what this changes' : 'Consequences of this choice'}</span>
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
