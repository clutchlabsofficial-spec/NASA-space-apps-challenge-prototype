// A hand-drawn 2D cutaway that gains real hardware as the build progresses.
// Nothing here is decorative-only: every element corresponds to a choice the
// player actually made, and the internal stack is drawn the way a CubeSat is
// really laid out — boards stacked on standoffs along the long axis.

import { visualIdFor, isCustom } from '../data/stations/index.js'

const P = '#c89bff'
const A = '#684f7b'
const BA = '#65417c'
const CARD = '#040121'
const FG = '#f0e6ff'
const BG = '#050012'

const BODY = {
  '1u': { w: 62, h: 62 },
  '3u': { w: 62, h: 168 },
  '6u': { w: 118, h: 176 },
  '12u': { w: 146, h: 176 },
}

function SolarCells({ x, y, w, h, cols = 3, rows = 4 }) {
  const cells = []
  const cw = w / cols
  const ch = h / rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * cw + 1}
          y={y + r * ch + 1}
          width={cw - 2}
          height={ch - 2}
          fill="#1d123b"
          stroke={BA}
          strokeWidth="0.6"
        />,
      )
    }
  }
  return <g>{cells}</g>
}

function Board({ x, y, w, label, tone = A }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="11" fill={CARD} stroke={tone} strokeWidth="0.9" />
      <line x1={x + 3} y1={y + 5.5} x2={x + w - 3} y2={y + 5.5} stroke={tone} strokeWidth="0.5" strokeDasharray="2 2" />
      <text x={x + w / 2} y={y + 8} fontSize="5" fill={FG} opacity="0.75" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.4">
        {label}
      </text>
    </g>
  )
}

function Callout({ x, y, tx, ty, text }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={BA} strokeWidth="0.7" />
      <circle cx={x} cy={y} r="1.6" fill={P} />
      <text x={tx} y={ty - 3} fontSize="6.2" fill={P} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.6" textAnchor={tx < 200 ? 'start' : 'end'}>
        {text}
      </text>
    </g>
  )
}

export default function CubeSatSVG({ picks: rawPicks }) {
  // Custom parts borrow the drawing of whichever real option they are closest
  // to, so an invented antenna still looks like an antenna on the cutaway.
  const picks = {}
  const invented = new Set()
  for (const [stationId, pick] of Object.entries(rawPicks || {})) {
    const visual = visualIdFor(stationId, pick)
    if (visual) picks[stationId] = visual
    if (isCustom(pick)) invented.add(stationId)
  }
  const struct = picks.structure
  const dim = BODY[struct] || { w: 62, h: 168 }
  const cx = 200
  const cy = 178
  const x = cx - dim.w / 2
  const y = cy - dim.h / 2
  const right = x + dim.w
  const bottom = y + dim.h

  const wingW = dim.h > 100 ? 66 : 46
  const wingH = dim.h > 100 ? dim.h * 0.62 : dim.h
  const wingY = cy - wingH / 2
  const hasWings = picks.power === 'deployable-fixed' || picks.power === 'articulated'
  const tilt = picks.power === 'articulated' ? 10 : 0

  return (
    <svg viewBox="0 0 400 340" role="img" aria-label="Cutaway view of the satellite you are building">
      <defs>
        <linearGradient id="sail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BA} stopOpacity="0.34" />
          <stop offset="100%" stopColor={P} stopOpacity="0.08" />
        </linearGradient>
        <pattern id="hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="5" stroke={BA} strokeWidth="1" />
        </pattern>
        <radialGradient id="plume">
          <stop offset="0%" stopColor={P} stopOpacity="0.7" />
          <stop offset="100%" stopColor={P} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* orbit reference arc — a quiet reminder that this thing is falling around Earth */}
      <path d="M 8 296 Q 200 246 392 296" fill="none" stroke={A} strokeWidth="0.7" strokeDasharray="3 5" opacity="0.55" />
      <text x="12" y="310" fontSize="6" fill={A} fontFamily="IBM Plex Mono, monospace" letterSpacing="1">
        NADIR / EARTH
      </text>

      {/* ---------------- deployables that sit behind the body ---------------- */}

      {picks.propulsion === 'drag-sail' && (
        <g>
          <path d={`M ${cx} ${bottom} L ${cx - 108} ${bottom + 56} L ${cx} ${bottom + 78} L ${cx + 108} ${bottom + 56} Z`} fill="url(#sail)" stroke={BA} strokeWidth="0.9" />
          <line x1={cx} y1={bottom} x2={cx - 108} y2={bottom + 56} stroke={P} strokeWidth="0.8" />
          <line x1={cx} y1={bottom} x2={cx + 108} y2={bottom + 56} stroke={P} strokeWidth="0.8" />
          <Callout x={cx - 60} y={bottom + 44} tx={36} ty={bottom + 66} text="DRAG SAIL" />
        </g>
      )}

      {picks.propulsion === 'tether' && (
        <g>
          <line x1={cx} y1={bottom} x2={cx} y2="330" stroke={P} strokeWidth="1.2" strokeDasharray="6 3" />
          <Callout x={cx} y="318" tx={236} ty="322" text="EDT TAPE 70 m" />
        </g>
      )}

      {picks.adcs === 'gravity-gradient' && (
        <g>
          <line x1={cx} y1={y} x2={cx} y2={y - 74} stroke={A} strokeWidth="2" />
          <circle cx={cx} cy={y - 78} r="7" fill={CARD} stroke={P} strokeWidth="1.2" />
          <Callout x={cx} y={y - 50} tx={244} ty={y - 54} text="GG BOOM + TIP MASS" />
        </g>
      )}

      {/* ---------------- solar wings ---------------- */}

      {hasWings && (
        <g>
          <g transform={`rotate(${-tilt} ${x} ${cy})`}>
            <rect x={x - wingW} y={wingY} width={wingW} height={wingH} fill={CARD} stroke={A} strokeWidth="1" />
            <SolarCells x={x - wingW} y={wingY} w={wingW} h={wingH} cols={3} rows={5} />
            <line x1={x - 3} y1={cy} x2={x} y2={cy} stroke={P} strokeWidth="2" />
          </g>
          <g transform={`rotate(${tilt} ${right} ${cy})`}>
            <rect x={right} y={wingY} width={wingW} height={wingH} fill={CARD} stroke={A} strokeWidth="1" />
            <SolarCells x={right} y={wingY} w={wingW} h={wingH} cols={3} rows={5} />
            <line x1={right} y1={cy} x2={right + 3} y2={cy} stroke={P} strokeWidth="2" />
          </g>
          {picks.power === 'articulated' && (
            <>
              <circle cx={x - 2} cy={cy} r="4.5" fill={CARD} stroke={P} strokeWidth="1" />
              <circle cx={right + 2} cy={cy} r="4.5" fill={CARD} stroke={P} strokeWidth="1" />
              <Callout x={right + 2} y={cy} tx={392} ty={cy - 18} text="SADA DRIVE" />
            </>
          )}
        </g>
      )}

      {/* ---------------- primary structure ---------------- */}

      <rect
        x={x}
        y={y}
        width={dim.w}
        height={dim.h}
        fill={CARD}
        stroke={struct ? P : A}
        strokeWidth={struct ? 1.6 : 1}
        strokeDasharray={struct ? '0' : '5 4'}
      />
      {/* corner rails — the only part that touches the deployer */}
      {struct && (
        <g>
          {[
            [x, y],
            [right - 5, y],
            [x, bottom - 5],
            [right - 5, bottom - 5],
          ].map(([rx, ry], i) => (
            <rect key={i} x={rx} y={ry} width="5" height="5" fill={BA} />
          ))}
          <rect x={x} y={y} width="4" height={dim.h} fill={A} opacity="0.35" />
          <rect x={right - 4} y={y} width="4" height={dim.h} fill={A} opacity="0.35" />
        </g>
      )}

      {/* body-mounted cells */}
      {picks.power === 'body-mounted' && (
        <>
          <SolarCells x={x + 6} y={y + 6} w={dim.w - 12} h={dim.h - 12} cols={2} rows={Math.max(2, Math.round(dim.h / 34))} />
          <Callout x={x + dim.w / 2} y={y + 14} tx={26} ty={y + 8} text="BODY-MOUNTED CELLS" />
        </>
      )}

      {/* MLI wrap */}
      {picks.thermal === 'mli-straps' && (
        <rect x={x - 4} y={y - 4} width={dim.w + 8} height={dim.h + 8} fill="none" stroke={P} strokeWidth="1.4" strokeDasharray="2 3" opacity="0.75" />
      )}
      {/* white radiator face */}
      {(picks.thermal === 'passive-coatings' || picks.thermal === 'cryocooler') && (
        <>
          <rect x={right - 7} y={y + 12} width="6" height={dim.h - 24} fill={FG} opacity="0.16" stroke={FG} strokeOpacity="0.4" strokeWidth="0.6" />
          <Callout x={right - 4} y={y + 30} tx={392} ty={y + 22} text="RADIATOR" />
        </>
      )}

      {/* ---------------- internal stack ---------------- */}

      {struct && (
        <g>
          {picks.brain && <Board x={x + 8} y={cy - 6} w={dim.w - 16} label="C&DH" tone={P} />}
          {picks.battery && <Board x={x + 8} y={cy + 10} w={dim.w - 16} label="BATT" tone={A} />}
          {picks.power && <Board x={x + 8} y={cy + 26} w={dim.w - 16} label="EPS" tone={A} />}
          {picks.comms && <Board x={x + 8} y={cy + 42} w={dim.w - 16} label="RADIO" tone={A} />}
          {/* standoffs */}
          <line x1={x + 10} y1={cy - 8} x2={x + 10} y2={cy + 55} stroke={A} strokeWidth="0.6" />
          <line x1={right - 10} y1={cy - 8} x2={right - 10} y2={cy + 55} stroke={A} strokeWidth="0.6" />
        </g>
      )}

      {/* battery survival heater */}
      {picks.thermal === 'heaters' && picks.battery && (
        <>
          <path
            d={`M ${x + 9} ${cy + 22} l 6 0 l 0 -3 l 6 0 l 0 3 l 6 0 l 0 -3 l 6 0 l 0 3 l 6 0`}
            fill="none"
            stroke={P}
            strokeWidth="1.1"
          />
          <Callout x={x + 20} y={cy + 21} tx={22} ty={cy + 46} text="SURVIVAL HEATER" />
        </>
      )}

      {/* phase change / heat pipe */}
      {picks.thermal === 'pcm-heatpipe' && (
        <>
          <rect x={x + 8} y={cy + 58} width={dim.w - 16} height="9" fill="url(#hatch)" stroke={A} strokeWidth="0.8" />
          <Callout x={x + 14} y={cy + 62} tx={22} ty={cy + 84} text="PCM / HEAT PIPE" />
        </>
      )}

      {/* ---------------- ADCS hardware ---------------- */}

      {picks.adcs === 'passive-magnetic' && (
        <>
          <rect x={cx - 16} y={cy + 58} width="32" height="7" fill={CARD} stroke={P} strokeWidth="1" />
          <rect x={cx - 16} y={cy + 58} width="16" height="7" fill={BA} opacity="0.6" />
          <Callout x={cx} y={cy + 61} tx={22} ty={cy + 86} text="PERMANENT MAGNET" />
        </>
      )}
      {picks.adcs === 'magnetorquers' && (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={cx - 20 + i * 14} y={cy + 58} width="9" height="16" fill={CARD} stroke={A} strokeWidth="0.8" />
              {[0, 1, 2, 3].map((j) => (
                <line key={j} x1={cx - 20 + i * 14} y1={cy + 61 + j * 4} x2={cx - 11 + i * 14} y2={cy + 61 + j * 4} stroke={P} strokeWidth="0.7" />
              ))}
            </g>
          ))}
          <Callout x={cx - 6} y={cy + 66} tx={22} ty={cy + 92} text="TORQUE RODS ×3" />
        </>
      )}
      {(picks.adcs === 'wheels-plus-torquers' || picks.adcs === 'integrated-startracker') && (
        <>
          {[-1, 0, 1].map((i) => (
            <g key={i}>
              <circle cx={cx + i * 17} cy={cy + 68} r="7.5" fill={CARD} stroke={P} strokeWidth="1" />
              <circle cx={cx + i * 17} cy={cy + 68} r="2.4" fill={BA} />
              <line x1={cx + i * 17 - 5} y1={cy + 68} x2={cx + i * 17 + 5} y2={cy + 68} stroke={A} strokeWidth="0.6" />
            </g>
          ))}
          <Callout x={cx - 17} y={cy + 68} tx={22} ty={cy + 96} text="REACTION WHEELS ×3" />
        </>
      )}
      {picks.adcs === 'integrated-startracker' && (
        <>
          <path d={`M ${x - 16} ${y + 32} l 16 -7 l 0 20 z`} fill={CARD} stroke={P} strokeWidth="1" />
          <line x1={x - 22} y1={y + 22} x2={x - 16} y2={y + 30} stroke={A} strokeWidth="0.7" />
          <line x1={x - 22} y1={y + 46} x2={x - 16} y2={y + 40} stroke={A} strokeWidth="0.7" />
          <Callout x={x - 12} y={y + 35} tx={20} ty={y + 30} text="STAR TRACKER" />
        </>
      )}

      {/* ---------------- payload, at the top of the stack ---------------- */}

      {picks.payload === 'thermal-ir' && (
        <>
          <rect x={cx - 16} y={y - 22} width="32" height="24" fill={CARD} stroke={P} strokeWidth="1.2" />
          <ellipse cx={cx} cy={y - 22} rx="13" ry="4" fill={BG} stroke={P} strokeWidth="1.2" />
          <ellipse cx={cx} cy={y - 22} rx="8" ry="2.4" fill={BA} opacity="0.7" />
          <Callout x={cx + 14} y={y - 12} tx={382} ty={y - 22} text="LWIR/MWIR IMAGER" />
        </>
      )}
      {(picks.payload === 'vis-multispectral' || picks.payload === 'hyperspectral') && (
        <>
          <rect x={cx - 13} y={y - 40} width="26" height="42" fill={CARD} stroke={P} strokeWidth="1.2" />
          <rect x={cx - 17} y={y - 44} width="34" height="6" fill={BG} stroke={P} strokeWidth="1.2" />
          <line x1={cx - 13} y1={y - 26} x2={cx + 13} y2={y - 26} stroke={A} strokeWidth="0.7" />
          <line x1={cx - 13} y1={y - 14} x2={cx + 13} y2={y - 14} stroke={A} strokeWidth="0.7" />
          {picks.payload === 'hyperspectral' && (
            <path d={`M ${cx - 7} ${y - 8} l 14 0 l -7 -12 z`} fill="none" stroke={P} strokeWidth="1" />
          )}
          <Callout
            x={cx + 13} y={y - 32} tx={382} ty={y - 36}
            text={picks.payload === 'hyperspectral' ? 'SPECTROMETER' : 'VIS/NIR TELESCOPE'}
          />
        </>
      )}
      {picks.payload === 'sdr-receiver' && (
        <>
          <rect x={cx - 15} y={y - 16} width="30" height="18" fill={CARD} stroke={P} strokeWidth="1.2" />
          <line x1={cx - 40} y1={y - 30} x2={cx + 40} y2={y - 30} stroke={P} strokeWidth="1.4" />
          <line x1={cx} y1={y - 30} x2={cx} y2={y - 16} stroke={P} strokeWidth="1" />
          <Callout x={cx + 30} y={y - 30} tx={382} ty={y - 40} text="VHF AIS ANTENNA" />
        </>
      )}
      {picks.payload === 'gnss-ro' && (
        <>
          <rect x={x - 18} y={y + 6} width="16" height="22" fill={CARD} stroke={P} strokeWidth="1.1" />
          <rect x={right + 2} y={y + 6} width="16" height="22" fill={CARD} stroke={P} strokeWidth="1.1" />
          <Callout x={right + 10} y={y + 17} tx={382} ty={y + 6} text="GNSS-RO LIMB ANT" />
        </>
      )}
      {picks.payload === 'particle-telescope' && (
        <>
          <rect x={cx - 10} y={y - 26} width="20" height="28" fill={CARD} stroke={P} strokeWidth="1.2" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={cx - 10} y1={y - 20 + i * 6} x2={cx + 10} y2={y - 20 + i * 6} stroke={P} strokeWidth="0.9" />
          ))}
          <rect x={cx - 6} y={y - 34} width="12" height="9" fill={BG} stroke={BA} strokeWidth="1.4" />
          <Callout x={cx + 10} y={y - 20} tx={382} ty={y - 28} text="PARTICLE TELESCOPE" />
        </>
      )}
      {picks.payload === 'ka-radar' && (
        <>
          <path d={`M ${cx - 46} ${y - 8} Q ${cx} ${y - 62} ${cx + 46} ${y - 8}`} fill="none" stroke={P} strokeWidth="1.6" />
          <path d={`M ${cx - 46} ${y - 8} Q ${cx} ${y - 44} ${cx + 46} ${y - 8}`} fill="none" stroke={A} strokeWidth="0.7" strokeDasharray="3 3" />
          <line x1={cx} y1={y - 34} x2={cx} y2={y} stroke={A} strokeWidth="1.2" />
          <Callout x={cx + 30} y={y - 24} tx={382} ty={y - 40} text="DEPLOYABLE Ka REFLECTOR" />
        </>
      )}

      {/* ---------------- comms antenna ---------------- */}

      {picks.comms === 'uhf-vhf' && (
        <>
          <line x1={x + 6} y1={bottom} x2={x - 44} y2={bottom + 40} stroke={P} strokeWidth="1.3" />
          <line x1={right - 6} y1={bottom} x2={right + 44} y2={bottom + 40} stroke={P} strokeWidth="1.3" />
          <Callout x={right + 26} y={bottom + 24} tx={382} ty={bottom + 40} text="UHF TAPE MONOPOLES" />
        </>
      )}
      {picks.comms === 's-band' && (
        <>
          <rect x={cx - 12} y={bottom} width="24" height="7" fill={CARD} stroke={P} strokeWidth="1.2" />
          <rect x={cx - 8} y={bottom + 1.6} width="16" height="3.8" fill={BA} opacity="0.7" />
          <Callout x={cx + 10} y={bottom + 4} tx={382} ty={bottom + 20} text="S-BAND PATCH" />
        </>
      )}
      {picks.comms === 'x-band' && (
        <>
          <path d={`M ${cx - 8} ${bottom} l -14 26 l 44 0 l -14 -26 z`} fill={CARD} stroke={P} strokeWidth="1.2" />
          <line x1={cx - 20} y1={bottom + 30} x2={cx + 26} y2={bottom + 30} stroke={A} strokeWidth="0.8" strokeDasharray="2 2" />
          <Callout x={cx + 16} y={bottom + 18} tx={382} ty={bottom + 34} text="X-BAND HIGH GAIN" />
        </>
      )}
      {picks.comms === 'optical' && (
        <>
          <circle cx={cx} cy={bottom + 10} r="9" fill={CARD} stroke={P} strokeWidth="1.3" />
          <circle cx={cx} cy={bottom + 10} r="3.4" fill={P} opacity="0.65" />
          <path d={`M ${cx - 3} ${bottom + 18} L ${cx - 16} ${bottom + 62} L ${cx + 16} ${bottom + 62} L ${cx + 3} ${bottom + 18} Z`} fill="url(#plume)" />
          <Callout x={cx + 9} y={bottom + 10} tx={382} ty={bottom + 22} text="OPTICAL TERMINAL" />
        </>
      )}

      {/* ---------------- propulsion ---------------- */}

      {(picks.propulsion === 'cold-gas' || picks.propulsion === 'green-mono' || picks.propulsion === 'electric') && (
        <g>
          <circle cx={cx + (dim.w > 90 ? 34 : 0)} cy={cy + 74} r="9" fill={CARD} stroke={A} strokeWidth="1" />
          <text x={cx + (dim.w > 90 ? 34 : 0)} y={cy + 76.5} fontSize="5" fill={FG} opacity="0.7" textAnchor="middle" fontFamily="IBM Plex Mono, monospace">
            {picks.propulsion === 'electric' ? 'PROP' : 'TANK'}
          </text>
          <path d={`M ${cx - 6} ${bottom} l -3 9 l 18 0 l -3 -9 z`} fill={CARD} stroke={P} strokeWidth="1.1" transform={`translate(${dim.w > 90 ? 34 : 0} 0)`} />
          {picks.propulsion === 'electric' && (
            <ellipse cx={cx + (dim.w > 90 ? 34 : 0)} cy={bottom + 20} rx="9" ry="14" fill="url(#plume)" />
          )}
          <Callout
            x={cx + (dim.w > 90 ? 34 : 0)} y={cy + 74} tx={382} ty={cy + 96}
            text={picks.propulsion === 'electric' ? 'ELECTRIC THRUSTER' : picks.propulsion === 'cold-gas' ? 'COLD GAS' : 'GREEN MONOPROP'}
          />
        </g>
      )}

      {/* ---------------- cryocooler ---------------- */}
      {picks.thermal === 'cryocooler' && (
        <>
          <rect x={cx - 24} y={y + 8} width="14" height="20" fill={CARD} stroke={P} strokeWidth="1" />
          <line x1={cx - 10} y1={y + 12} x2={cx - 2} y2={y + 12} stroke={P} strokeWidth="2" />
          <Callout x={cx - 17} y={y + 18} tx={20} ty={y + 12} text="CRYOCOOLER" />
        </>
      )}

      {/* ---------------- invented parts marker ---------------- */}
      {invented.size > 0 && (
        <g>
          <rect x="8" y="8" width="96" height="15" fill={CARD} stroke={P} strokeWidth="0.8" strokeDasharray="3 2" />
          <text x="56" y="18.5" fontSize="6" fill={P} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" letterSpacing="0.8">
            {invented.size} PART{invented.size > 1 ? 'S' : ''} YOU INVENTED
          </text>
        </g>
      )}

      {/* ---------------- empty state ---------------- */}
      {!struct && (
        <text x={cx} y={cy} fontSize="7" fill={A} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.4">
          AWAITING STRUCTURE
        </text>
      )}
    </svg>
  )
}
