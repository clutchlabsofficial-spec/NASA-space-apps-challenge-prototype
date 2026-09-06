import { MISSIONS } from '../data/missions.js'
import { t, SourceChips } from './bits.jsx'
import { MascotSays } from './Mascot.jsx'

export default function MissionSelect({ mode, onPick, onRefs }) {
  return (
    <div className="shell">
      <section className="hero">
        <div className="hero__eyebrow mono">Mission planning · step 00</div>
        <h1>
          Build a real satellite,
          <br />
          <em>one subsystem at a time.</em>
        </h1>
        <p className="hero__lede">
          {mode === 'explorer'
            ? 'Real satellites are built out of parts that each have a job. You will choose every part yourself — and each time you choose, you will find out how that part really works on real spacecraft flying right now.'
            : 'Real engineers do not start with a satellite. They start with a question, then build the smallest spacecraft that can answer it. Pick your mission, then work through every subsystem — structure, power, brain, pointing, thermal, comms, propulsion — choosing between approaches that real CubeSats actually fly.'}
        </p>
      </section>

      <MascotSays mood="excited" highlight={mode === 'explorer' ? 'Hi! I am Nova.' : 'Nova, mission planning.'}>
        {mode === 'explorer'
          ? 'I am a real little satellite. Pick a job for YOUR satellite and we will build it together — one piece at a time.'
          : 'Every real mission starts with a question, not a spacecraft. Choose the question yours will answer and the whole design follows from it.'}
      </MascotSays>

      <div className="label" style={{ marginBottom: 10 }}>
        {mode === 'explorer' ? 'Choose a job for your satellite' : 'Select mission objective'}
      </div>

      <div className="missiongrid">
        {MISSIONS.map((m) => (
          <button key={m.id} className="missioncard" onClick={() => onPick(m.id)}>
            <div className="missioncard__code mono">{m.codename}</div>
            <h3>{t(m.name, mode)}</h3>
            <p>{t(m.tagline, mode)}</p>
            <div className="missioncard__go">Select →</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 36, maxWidth: 720 }}>
        <SourceChips
          ids={['soa-gnc', 'cubesat101', 'cds', 'fcc-5yr']}
          label={mode === 'explorer' ? 'Where the facts come from' : 'Primary references'}
        />
        <p style={{ marginTop: 14, color: 'var(--muted-dim)', fontSize: '0.88rem' }}>
          Every option in this app describes hardware that has genuinely flown, with figures taken from published NASA
          and mission sources.{' '}
          <button className="linkbtn" onClick={onRefs}>
            See the full reference list
          </button>
        </p>
      </div>
    </div>
  )
}
