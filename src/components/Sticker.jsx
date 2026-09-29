/**
 * A rotated roundel, in the spirit of the reference boards' sticker badges.
 * Used sparingly — one per screen at most — to carry a claim that deserves to
 * be shouted rather than read.
 */
export default function Sticker({ children, tone = 'primary', rotate = -12, className = '' }) {
  return (
    <span className={`sticker sticker--${tone} ${className}`} style={{ '--rot': `${rotate}deg` }}>
      {children}
    </span>
  )
}

/** The hand-drawn squiggle the reference boards use as a bit of energy. */
export function Squiggle({ className = '', width = 120 }) {
  return (
    <svg className={`squiggle ${className}`} width={width} height={width * 0.42} viewBox="0 0 120 50" fill="none" aria-hidden="true">
      <path
        d="M4 32c8-18 16 12 24-4S44 6 52 20s12 24 20 10 12-22 20-10 12 18 20 8"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}
