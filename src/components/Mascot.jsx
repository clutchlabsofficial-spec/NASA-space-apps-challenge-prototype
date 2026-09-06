// NOVA — a little CubeSat who walks the child through the build. They are the
// same shape as the thing being designed, which is the point: the mascot IS a
// satellite, so its parts get named as the child adds them.

const MOODS = {
  happy: { eye: 'M -3 0 a 3 3 0 0 1 6 0', mouth: 'M -5 4 q 5 5 10 0', brow: null },
  thinking: { eye: 'M -3 0 a 3 3 0 0 1 6 0', mouth: 'M -4 5 q 4 -2 8 0', brow: 'M -18 -9 l 8 -3' },
  excited: { eye: 'M -3.5 0 a 3.5 3.5 0 0 1 7 0', mouth: 'M -6 3 q 6 8 12 0', brow: null },
  worried: { eye: 'M -2.5 0 a 2.5 2.5 0 0 1 5 0', mouth: 'M -5 6 q 5 -4 10 0', brow: 'M -18 -10 l 8 2' },
}

export default function Mascot({ mood = 'happy', size = 84, talking = false }) {
  const m = MOODS[mood] || MOODS.happy
  return (
    <svg
      className={`mascot ${talking ? 'mascot--talking' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Nova, your satellite guide"
    >
      {/* solar wings */}
      <g className="mascot__wing mascot__wing--l">
        <rect x="4" y="38" width="20" height="26" rx="2" fill="#1d123b" stroke="#684f7b" strokeWidth="2" />
        <line x1="14" y1="38" x2="14" y2="64" stroke="#684f7b" strokeWidth="1.4" />
        <line x1="4" y1="51" x2="24" y2="51" stroke="#684f7b" strokeWidth="1.4" />
      </g>
      <g className="mascot__wing mascot__wing--r">
        <rect x="76" y="38" width="20" height="26" rx="2" fill="#1d123b" stroke="#684f7b" strokeWidth="2" />
        <line x1="86" y1="38" x2="86" y2="64" stroke="#684f7b" strokeWidth="1.4" />
        <line x1="76" y1="51" x2="96" y2="51" stroke="#684f7b" strokeWidth="1.4" />
      </g>

      {/* antenna */}
      <line x1="50" y1="30" x2="50" y2="16" stroke="#684f7b" strokeWidth="2.6" strokeLinecap="round" />
      <circle className="mascot__blip" cx="50" cy="13" r="4" fill="#c89bff" />

      {/* body, with the solid bottom lip everything else in this app uses */}
      <rect x="24" y="52" width="52" height="14" rx="6" fill="#65417c" />
      <rect x="24" y="30" width="52" height="32" rx="7" fill="#040121" stroke="#c89bff" strokeWidth="2.5" />

      {/* face */}
      <g transform="translate(39 44)">
        <path d={m.eye} fill="none" stroke="#f0e6ff" strokeWidth="3" strokeLinecap="round" />
        {m.brow && <path d={m.brow} fill="none" stroke="#684f7b" strokeWidth="2" strokeLinecap="round" />}
      </g>
      <g transform="translate(61 44)">
        <path d={m.eye} fill="none" stroke="#f0e6ff" strokeWidth="3" strokeLinecap="round" />
        {m.brow && <path d={m.brow} transform="scale(-1 1)" fill="none" stroke="#684f7b" strokeWidth="2" strokeLinecap="round" />}
      </g>
      <path d={m.mouth} transform="translate(50 48)" fill="none" stroke="#c89bff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

/** Nova saying something. The one phrase worth remembering gets highlighted. */
export function MascotSays({ mood = 'happy', size = 76, children, highlight }) {
  return (
    <div className="says">
      <Mascot mood={mood} size={size} talking />
      <div className="says__bubble">
        {highlight && <strong className="says__highlight">{highlight}</strong>}
        <div>{children}</div>
      </div>
    </div>
  )
}
