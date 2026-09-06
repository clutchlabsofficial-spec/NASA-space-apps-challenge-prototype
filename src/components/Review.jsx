import { buildReview, NEXT_STEPS } from '../lib/review.js'
import { STATIONS, getOption } from '../data/stations/index.js'
import { t, Note, SourceChips } from './bits.jsx'
import CubeSatSVG from './CubeSatSVG.jsx'

const FIT_STAMP = {
  ideal: { e: 'Right instrument', x: 'Perfect tool' },
  partial: { e: 'Partial answer', x: 'Sort of works' },
  no: { e: 'Wrong instrument', x: 'Wrong tool' },
}

export default function Review({ missionId, picks, mode, onGoto, onRestart, onRefs }) {
  const r = buildReview(missionId, picks)
  const mission = r.mission.mission
  const good = r.notes.filter((n) => n.kind === 'good')
  const tensions = r.notes.filter((n) => n.kind === 'tension')
  const blockers = r.notes.filter((n) => n.kind === 'blocker')

  return (
    <div className="shell review">
      <header className="review__head">
        <div className="mono" style={{ color: 'var(--primary)' }}>
          {mission.codename} · {mode === 'explorer' ? 'Your finished satellite' : 'Flight readiness review'}
        </div>
        <h1>{mode === 'explorer' ? 'Here is what you built.' : 'This is the spacecraft you designed.'}</h1>
        <p>
          {mode === 'explorer'
            ? 'Nothing here is made up. This is what a real satellite built from your exact choices could genuinely do — and what it honestly could not.'
            : 'None of the following is simulated. Every statement below is derived from what is genuinely true of the hardware classes you selected, checked against your stated mission objective.'}
        </p>
      </header>

      <div className="review__grid">
        <div>
          {/* ---- mission verdict ---- */}
          <section className={`panel card verdict verdict--${r.mission.fit}`}>
            <span className="label">{mode === 'explorer' ? 'Did you pick the right tool?' : 'Mission objective assessment'}</span>
            <span className="verdict__stamp">{t(FIT_STAMP[r.mission.fit], mode)}</span>
            <h2 className="card__title" style={{ marginBottom: 10 }}>{t(mission.name, mode)}</h2>
            <p>{t(r.mission.base, mode)}</p>
            {r.mission.blockers.length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="label">{mode === 'explorer' ? 'Things that get in the way' : 'Objective-level shortfalls'}</span>
                {r.mission.blockers.map((b, i) => (
                  <p key={i} style={{ color: 'var(--muted)', fontSize: '0.94rem' }}>{t(b, mode)}</p>
                ))}
              </div>
            )}
            <SourceChips ids={mission.sources} label={mode === 'explorer' ? 'The real mission this is based on' : 'Reference mission'} />
            <p style={{ marginTop: 12, fontSize: '0.88rem', color: 'var(--muted-dim)' }}>{mission.realAnalog}</p>
          </section>

          {/* ---- what it could do ---- */}
          <section className="panel card">
            <span className="label">{mode === 'explorer' ? 'What your satellite could really do' : 'Realistic capability'}</span>
            <ul className="claims claims--can">
              {r.capabilities.map((c, i) => (
                <li key={i}>{t(c, mode)}</li>
              ))}
            </ul>
          </section>

          {/* ---- what it could not ---- */}
          {r.limits.length > 0 && (
            <section className="panel card">
              <span className="label">{mode === 'explorer' ? 'What it could not do' : 'Honest limitations'}</span>
              <ul className="claims claims--cannot">
                {r.limits.map((c, i) => (
                  <li key={i}>{t(c, mode)}</li>
                ))}
              </ul>
            </section>
          )}

          {/* ---- coupling notes ---- */}
          {(blockers.length > 0 || tensions.length > 0 || good.length > 0) && (
            <section className="panel card">
              <span className="label">
                {mode === 'explorer' ? 'How your choices affect each other' : 'Subsystem coupling — the consequences of your combination'}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                {[...blockers, ...tensions, ...good].map((n) => (
                  <Note key={n.id} rule={n} mode={mode} />
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ---- right column ---- */}
        <div>
          <section className="panel card">
            <CubeSatSVG picks={picks} />
          </section>

          <section className="panel card">
            <span className="label">{mode === 'explorer' ? 'Your parts list' : 'Configuration manifest'}</span>
            <div className="manifest manifest--review">
              {STATIONS.map((s) => {
                const opt = getOption(s.id, picks[s.id])
                return (
                  <button
                    key={s.id}
                    className="manifest__row"
                    onClick={() => onGoto(s.id)}
                    style={{ background: 'none', border: 0, borderBottom: '1px solid var(--line-faint)', textAlign: 'left', width: '100%' }}
                  >
                    <span className="manifest__k">{s.code}</span>
                    <span className="manifest__v">{opt ? t(opt.name, mode) : '—'}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="panel card">
            <span className="label">{mode === 'explorer' ? 'How long it would last' : 'Expected operational life'}</span>
            <div className="statline">
              <span className="statline__k mono">{mode === 'explorer' ? 'Time in orbit' : 'Orbital lifetime'}</span>
              <span className="statline__v">{t(r.lifetime.orbitLife, mode)}</span>
            </div>
            {r.lifetime.limiters.map((l, i) => (
              <div className="statline" key={i}>
                <span className="statline__k mono">{mode === 'explorer' ? 'What wears out' : 'Life-limiting mechanism'}</span>
                <span className="statline__v">{t(l, mode)}</span>
              </div>
            ))}
          </section>

          <section className={`panel card compliance compliance--${r.disposal.status}`}>
            <span className="compliance__stamp">{r.disposal.status === 'ok' ? 'Compliant' : 'Non-compliant'}</span>
            <div>
              <span className="label">{mode === 'explorer' ? 'Space junk check' : 'Orbital debris disposal'}</span>
              <p style={{ fontSize: '0.94rem' }}>{t(r.disposal.text, mode)}</p>
            </div>
          </section>
        </div>
      </div>

        {/* ---- what a real team does next ---- */}
        <section className="panel card">
          <span className="label">{mode === 'explorer' ? 'What happens before it could fly' : 'What a real team would do next'}</span>
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
            {mode === 'explorer'
              ? 'Designing the satellite is only the start. Before anything goes to space, it has to survive some very rough treatment on the ground.'
              : 'Design closure is not the hard part. These are the gates between a paper spacecraft and a launch manifest, and they are where most first-time CubeSat programmes actually lose time.'}
          </p>
          <div className="steps">
            {NEXT_STEPS.map((s, i) => (
              <div className="step" key={i}>
                <h4>{t(s.title, mode)}</h4>
                <p>{t(s.body, mode)}</p>
                <SourceChips ids={s.sources} label="Source" />
              </div>
            ))}
          </div>
        </section>

      <div className="review__actions">
        <button className="btn" onClick={onRestart}>
          {mode === 'explorer' ? 'Build another one' : 'Start a new mission'}
        </button>
        <button className="btn btn--ghost" onClick={() => onGoto(STATIONS[0].id)}>
          {mode === 'explorer' ? 'Go back and change things' : 'Revise the design'}
        </button>
        <button className="btn btn--bare" onClick={onRefs}>
          All references
        </button>
      </div>
    </div>
  )
}
