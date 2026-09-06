// Sketch to 3D, without a mesh-generation service.
//
// A published page cannot reach Tripo — the sandbox blocks outbound calls to
// any third-party host — so the model is built in the browser instead. Claude
// reads the drawing as an engineering sketch and returns a parts list in a
// constrained vocabulary of shapes; three.js assembles it.
//
// This is better than photogrammetry for this job, not a consolation prize: a
// child's felt-tip drawing turns into a clean, readable spacecraft with named
// parts they can point at, instead of a lumpy mesh. It is also instant, free,
// and works identically everywhere.

export const SHAPES = ['box', 'panel', 'cylinder', 'dish', 'rod', 'sphere', 'cone']
export const MATERIALS = ['body', 'panel', 'accent', 'metal', 'gold', 'lens']

export const sketchSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'reading', 'parts'],
  properties: {
    name: { type: 'string', description: 'A short name for the satellite they drew, 2-4 words.' },
    reading: { type: 'string', description: 'One or two friendly sentences saying what you can see in their drawing.' },
    parts: {
      type: 'array',
      minItems: 1,
      maxItems: 22,
      description: 'The satellite rebuilt from simple shapes. Origin is the centre of the main body. +X right, +Y up, +Z toward the viewer. Units are arbitrary but keep the whole craft within about -8..8 on every axis.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['shape', 'label', 'material', 'position', 'size'],
        properties: {
          shape: { type: 'string', enum: SHAPES },
          label: { type: 'string', description: 'What this part is, in the child’s terms — "solar wing", "camera", "antenna".' },
          material: { type: 'string', enum: MATERIALS },
          position: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3 },
          size: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3, description: 'Width, height, depth. For cylinder and rod, width is the radius and height is the length.' },
          rotation: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3, description: 'Optional rotation in degrees about X, Y, Z.' },
        },
      },
    },
  },
}

export function buildSketchPrompt({ mode, context }) {
  return `You are looking at a child's drawing of the satellite they have just designed in CubeSat Builder.

Rebuild what they drew as a simple 3D model, using only the shapes in the schema. Read the drawing generously and literally: if they drew four wings, build four wings; if they drew a smiley face on it, that is not a part, but a big dish on the front is. Keep the proportions they drew, even when those are not to scale — this is their satellite, not a corrected version of it.

Rules:
- Use the fewest parts that still look like their drawing. Twelve good parts beat twenty fiddly ones.
- The main body goes at or near the origin. Everything else hangs off it.
- Symmetry matters: a pair of wings should be mirrored exactly.
- Label every part in the words a ${mode === 'explorer' ? 'young child' : 'teenager'} would use.
- "reading" is you talking to them about their drawing. Warm and specific — name something you can actually see. Never say the drawing is bad, wrong or unclear.
${context ? `\nFor context, this is the satellite they designed:\n${context}` : ''}

Reply with JSON only, matching this schema exactly:
${JSON.stringify(sketchSchema)}`
}

/** Guard rails: a model that flies off to infinity is worse than no model. */
export function sanitiseModel(data) {
  if (!data || !Array.isArray(data.parts) || !data.parts.length) {
    throw new Error('The drawing could not be read as a satellite. Try a bolder outline.')
  }
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v) || 0))
  const parts = data.parts
    .filter((p) => p && SHAPES.includes(p.shape))
    .slice(0, 22)
    .map((p) => ({
      shape: p.shape,
      label: String(p.label || 'part').slice(0, 40),
      material: MATERIALS.includes(p.material) ? p.material : 'body',
      position: (p.position || [0, 0, 0]).slice(0, 3).map((v) => clamp(v, -12, 12)),
      size: (p.size || [1, 1, 1]).slice(0, 3).map((v) => clamp(Math.abs(v), 0.05, 12)),
      rotation: (p.rotation || [0, 0, 0]).slice(0, 3).map((v) => clamp(v, -360, 360)),
    }))
  if (!parts.length) throw new Error('The drawing could not be read as a satellite. Try a bolder outline.')
  return {
    name: String(data.name || 'Your satellite').slice(0, 60),
    reading: String(data.reading || '').slice(0, 400),
    parts,
  }
}
