import { STATIONS, asList, isCustom, visualIdsFor } from '../data/stations/index.js'

// Turns a build into a 3D model, using the same parts vocabulary the sketch
// reader emits — so one renderer draws both "the satellite you designed" and
// "the satellite you drew", and they sit side by side at the end.
//
// The geometry is deliberately readable rather than accurate: a child should be
// able to point at a shape and say "those are my solar wings".

const part = (shape, label, material, position, size, rotation = [0, 0, 0], extra = {}) =>
  ({ shape, label, material, position, size, rotation, ...extra })

// Body proportions follow the real form factors: 1U is a 10 cm cube, 3U is
// three stacked, 6U is two rows of three.
const BODY = {
  '1u': [1.6, 1.6, 1.6],
  '3u': [1.6, 4.4, 1.6],
  '6u': [3.4, 4.4, 1.6],
  '12u': [3.4, 4.4, 3.4],
}

export function buildSatelliteModel(picks) {
  const parts = []
  const at = (station, id) => visualIdsFor(station, picks[station]).includes(id)
  const any = (station) => asList(picks[station]).length > 0

  const structure = visualIdsFor('structure', picks.structure)[0] || '3u'
  const [bw, bh, bd] = BODY[structure] || BODY['3u']

  // ---- primary structure -------------------------------------------------
  // Gold when wrapped in insulation, otherwise bare panel.
  const skin = at('thermal', 'mli-straps') ? 'gold' : 'body'
  parts.push(part('box', 'main body', skin, [0, 0, 0], [bw, bh, bd]))

  // Corner rails — the only part that touches the deployer.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      parts.push(part('box', 'corner rail', 'metal', [sx * bw / 2, 0, sz * bd / 2], [0.16, bh + 0.06, 0.16]))
    }
  }

  // A cold radiator face reads as a white panel on one side.
  if (at('thermal', 'passive-coatings') || at('thermal', 'cryocooler')) {
    parts.push(part('panel', 'radiator', 'accent', [bw / 2 + 0.06, 0, 0], [bh * 0.8, bd * 0.85, 0.08], [0, 90, 0]))
  }

  // ---- power -------------------------------------------------------------
  if (at('power', 'body-mounted')) {
    for (const sz of [-1, 1]) {
      parts.push(part('panel', 'solar cells', 'panel', [0, 0, sz * (bd / 2 + 0.05)], [bw * 0.86, bh * 0.86, 0.06]))
    }
  }
  if (at('power', 'deployable-fixed') || at('power', 'articulated')) {
    const tilt = at('power', 'articulated') ? 22 : 0
    const wingW = bh * 1.05
    for (const sx of [-1, 1]) {
      parts.push(part('panel', 'solar wing', 'panel', [sx * (bw / 2 + wingW / 2 + 0.25), 0, 0], [wingW, bh * 0.8, 0.07], [0, 0, sx * tilt]))
      parts.push(part('rod', 'wing hinge', 'metal', [sx * (bw / 2 + 0.14), 0, 0], [0.07, 0.3, 0.07], [0, 0, 90]))
    }
    if (at('power', 'articulated')) {
      for (const sx of [-1, 1]) {
        parts.push(part('cylinder', 'array drive', 'metal', [sx * (bw / 2 + 0.3), 0, 0], [0.17, 0.26, 0.17], [0, 0, 90]))
      }
    }
  }

  // ---- payload, at the top of the stack ----------------------------------
  const top = bh / 2
  if (at('payload', 'thermal-ir')) {
    parts.push(part('box', 'thermal camera', 'body', [0, top + 0.35, 0], [0.9, 0.7, 0.9]))
    parts.push(part('cylinder', 'infrared lens', 'lens', [0, top + 0.82, 0], [0.34, 0.24, 0.34]))
  }
  if (at('payload', 'vis-multispectral') || at('payload', 'hyperspectral')) {
    parts.push(part('cylinder', 'telescope', 'body', [0, top + 0.72, 0], [0.42, 1.45, 0.42]))
    parts.push(part('cylinder', 'camera lens', 'lens', [0, top + 1.46, 0], [0.44, 0.12, 0.44]))
  }
  if (at('payload', 'sdr-receiver')) {
    parts.push(part('rod', 'VHF antenna', 'metal', [0, top + 1.2, 0], [0.05, 2.4, 0.05]))
    parts.push(part('rod', 'VHF antenna', 'metal', [0, top + 0.5, 0], [0.05, 2.0, 0.05], [0, 0, 90]))
  }
  if (at('payload', 'gnss-ro')) {
    for (const sy of [-1, 1]) {
      parts.push(part('panel', 'GNSS antenna', 'gold', [0, sy * (top * 0.55), bd / 2 + 0.12], [0.8, 0.8, 0.09]))
    }
  }
  if (at('payload', 'particle-telescope')) {
    parts.push(part('cylinder', 'particle telescope', 'metal', [0, top + 0.5, 0], [0.3, 1.0, 0.3]))
    parts.push(part('cone', 'collimator', 'metal', [0, top + 1.15, 0], [0.34, 0.4, 0.34]))
  }
  if (at('payload', 'ka-radar')) {
    parts.push(part('dish', 'radar reflector', 'metal', [0, top + 1.2, 0], [1.5, 1.5, 1.5], [180, 0, 0]))
    parts.push(part('rod', 'feed boom', 'metal', [0, top + 0.5, 0], [0.06, 1.2, 0.06]))
  }

  // ---- communications, at the bottom -------------------------------------
  const bottom = -bh / 2
  if (at('comms', 'uhf-vhf')) {
    for (const sx of [-1, 1]) {
      parts.push(part('rod', 'tape antenna', 'metal', [sx * 1.0, bottom - 0.85, 0], [0.045, 2.2, 0.045], [0, 0, sx * 38]))
    }
  }
  if (at('comms', 's-band')) {
    parts.push(part('panel', 'S-band patch', 'gold', [0, bottom - 0.09, 0], [0.7, 0.7, 0.1], [90, 0, 0]))
  }
  if (at('comms', 'x-band')) {
    parts.push(part('cone', 'X-band horn', 'metal', [0, bottom - 0.5, 0], [0.55, 1.0, 0.55], [180, 0, 0]))
  }
  if (at('comms', 'optical')) {
    parts.push(part('cylinder', 'laser terminal', 'body', [0, bottom - 0.4, 0], [0.3, 0.7, 0.3]))
    parts.push(part('sphere', 'laser aperture', 'accent', [0, bottom - 0.78, 0], [0.19, 0.19, 0.19]))
  }

  // ---- attitude control --------------------------------------------------
  if (at('adcs', 'wheels-plus-torquers') || at('adcs', 'integrated-startracker')) {
    for (const [i, axis] of [[0, 0, 0], [0, 0, 90], [90, 0, 0]].entries()) {
      parts.push(part('cylinder', 'reaction wheel', 'metal', [(i - 1) * 0.42, -bh * 0.18, 0], [0.26, 0.14, 0.26], axis))
    }
  }
  if (at('adcs', 'integrated-startracker')) {
    parts.push(part('cone', 'star tracker', 'body', [-bw / 2 - 0.3, top * 0.55, 0], [0.26, 0.6, 0.26], [0, 0, 90]))
  }
  if (at('adcs', 'magnetorquers')) {
    for (const [i, pos] of [[-0.4, 0, 0], [0.4, 0, 0], [0, 0, 0.4]].entries()) {
      parts.push(part('cylinder', 'torque rod', 'accent', [pos[0], -bh * 0.3, pos[2]], [0.09, 0.8, 0.09], i === 2 ? [90, 0, 0] : [0, 0, 90]))
    }
  }
  if (at('adcs', 'passive-magnetic')) {
    parts.push(part('box', 'permanent magnet', 'accent', [0, -bh * 0.3, 0], [0.9, 0.18, 0.18]))
  }
  if (at('adcs', 'gravity-gradient')) {
    parts.push(part('rod', 'gravity boom', 'metal', [0, top + 1.8, 0], [0.05, 3.4, 0.05]))
    parts.push(part('sphere', 'tip mass', 'metal', [0, top + 3.6, 0], [0.24, 0.24, 0.24]))
  }

  // ---- propulsion and disposal -------------------------------------------
  if (at('propulsion', 'cold-gas') || at('propulsion', 'green-mono') || at('propulsion', 'electric')) {
    parts.push(part('sphere', 'propellant tank', 'metal', [bw / 2 - 0.35, -bh * 0.3, 0], [0.32, 0.32, 0.32]))
    parts.push(part('cone', 'thruster nozzle', 'metal', [0, bottom - 0.28, bd / 2 - 0.3], [0.17, 0.4, 0.17], [180, 0, 0]))
  }
  if (at('propulsion', 'drag-sail')) {
    parts.push(part('panel', 'drag sail', 'gold', [0, bottom - 1.7, 0], [3.6, 3.6, 0.03], [90, 0, 45]))
    for (const a of [45, 135, 225, 315]) {
      const r = (a * Math.PI) / 180
      parts.push(part('rod', 'sail boom', 'metal', [Math.cos(r) * 1.2, bottom - 1.7, Math.sin(r) * 1.2], [0.04, 2.4, 0.04], [90, 0, a]))
    }
  }
  if (at('propulsion', 'tether')) {
    parts.push(part('rod', 'electrodynamic tether', 'metal', [0, bottom - 2.2, 0], [0.035, 4.2, 0.035]))
  }

  // ---- internals, visible where the body is open -------------------------
  if (any('brain')) parts.push(part('panel', 'flight computer', 'accent', [0, bh * 0.12, 0], [bw * 0.7, bd * 0.7, 0.08], [90, 0, 0]))
  if (any('battery')) parts.push(part('box', 'battery', 'lens', [0, -bh * 0.05, 0], [bw * 0.5, 0.26, bd * 0.5]))

  return {
    name: 'Your satellite',
    reading: '',
    parts,
    /** Which stations are represented, so the caller can annotate the view. */
    stations: STATIONS.filter((s) => asList(picks[s.id]).length).map((s) => s.id),
  }
}

/** Something to look at before any choice has been made. */
export const DEMO_PICKS = {
  structure: ['3u'],
  power: ['deployable-fixed'],
  payload: ['thermal-ir'],
  comms: ['uhf-vhf'],
  adcs: ['wheels-plus-torquers'],
  thermal: ['passive-coatings'],
  brain: ['cots-mcu'],
  battery: ['li-ion-18650'],
}
