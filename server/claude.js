import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { STATIONS, getStation, getOption } from '../src/data/stations/index.js'
import { getMission } from '../src/data/missions.js'
import { tagMenuFor, TAG_GLOSSARY } from '../src/data/vocab.js'

const client = new Anthropic()

// Kid-facing latency matters more than depth here, and the task is bounded:
// judge one idea against a body of reference material we supply. Adaptive
// thinking at low effort is the right point on that curve. The whole-satellite
// pass is a harder synthesis, so it gets medium.
const EFFORT = { station: 'low', whole: 'medium' }

const VERDICTS = ['works', 'partly', 'wont-work', 'off-topic']

// Structured outputs guarantee we get schema-valid JSON back — important when
// the response drives UI for a nine-year-old rather than a developer console.
const responseSchema = (tagMenu) => ({
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'name', 'summary', 'howItWorks', 'realCounterpart', 'goodThinking', 'physicsProblems', 'tags'],
  properties: {
    verdict: { type: 'string', enum: VERDICTS },
    name: { type: 'string', description: 'A short proper name for the invention, 2-5 words, in the spirit of what the child described.' },
    summary: { type: 'string', description: 'One sentence, plain language, describing what they invented.' },
    howItWorks: { type: 'string', description: 'Two to four sentences on the real physics or engineering their idea depends on.' },
    realCounterpart: { type: 'string', description: 'The closest thing real spacecraft engineers actually build or have flown, named specifically. If there is genuinely nothing close, say so plainly.' },
    goodThinking: { type: 'array', items: { type: 'string' }, description: '1-3 specific things that are genuinely smart about the idea. Never generic praise.' },
    physicsProblems: { type: 'array', items: { type: 'string' }, description: '1-3 honest, specific problems physics or engineering would cause. Empty only if there really are none.' },
    tags: { type: 'array', items: { type: 'string', enum: tagMenu }, description: 'The engineering properties of this invention, chosen ONLY from the allowed list.' },
  },
})

const Parsed = z.object({
  verdict: z.enum(VERDICTS),
  name: z.string(),
  summary: z.string(),
  howItWorks: z.string(),
  realCounterpart: z.string(),
  goodThinking: z.array(z.string()),
  physicsProblems: z.array(z.string()),
  tags: z.array(z.string()),
})

function referenceMaterial(station) {
  // Ground the model in the same curated, sourced content the rest of the app
  // uses, so an invention is judged against the real options rather than the
  // model's own recollection.
  return station.options
    .map((o) => [
      `### ${o.name.e}`,
      `How it works: ${o.how.e}`,
      `Made of: ${o.madeOf.e}`,
      `Chosen because: ${o.whyChosen.e}`,
      `Limits: ${o.tradeoffs.limits.map((l) => l.e).join(' ')}`,
      o.facts?.length ? `Figures: ${o.facts.map((f) => `${f.label}: ${f.value}`).join('; ')}` : '',
      `Flown: ${o.flown}`,
      `Tags: ${o.tags.join(', ')}`,
    ].filter(Boolean).join('\n'))
    .join('\n\n')
}

function buildSystem(station, mission, mode, tagMenu) {
  const glossary = tagMenu.map((t) => (TAG_GLOSSARY[t] ? `- ${t}: ${TAG_GLOSSARY[t]}` : `- ${t}`)).join('\n')

  return `You are the engineering mentor inside CubeSat Builder, a learning app where children aged 8 to 18 design a real satellite subsystem by subsystem.

A child has invented their own idea for the ${station.name.e} subsystem instead of picking one of the standard options. Your job is to take their idea completely seriously and tell them the truth about it.

## How to talk to them
${mode === 'explorer'
    ? 'This child is under 11. Use short sentences and everyday words. Explain by comparison to things they already know. Never use a technical term without immediately explaining it. Warm, never patronising.'
    : 'This child is 11 to 18. Use real engineering vocabulary and explain it as you go. Treat them as a junior colleague, not a pupil.'}

## Rules that matter more than being nice
- Be honest. If their idea cannot work, say clearly why, name the physics, and treat that as interesting rather than as failure. Real engineers kill ideas every day.
- Be specific. "Great idea!" is useless. "Using the solar panel itself as the antenna is real — it is called a patch-on-panel design" is useful.
- Never invent performance figures, mission names, or specifications. If you do not know a number, describe the behaviour instead of inventing a value.
- Find the real counterpart. Children reinvent real spacecraft hardware constantly and do not know it. Telling a child that their idea already exists and has flown is the single best thing you can do for them.
- If their idea is genuinely novel or not something engineers build, say so plainly rather than pretending it maps to something.

## Off-topic input
If what they wrote has nothing to do with satellites, set verdict to "off-topic", keep every field friendly and brief, steer them back to the subsystem, and return an empty tags array. Do not lecture. Do not answer unrelated questions.

## Tags — this part is mechanical and important
The rest of the app reasons about their satellite purely through tags. Choose the tags that are actually true of what they described, ONLY from this list:
${glossary}

Choose the minimum set that honestly describes the engineering behaviour of their invention. If the idea is off-topic or too vague to have engineering properties, return an empty array.

## The child's mission
${mission ? `${mission.name.e} — ${mission.tagline.e}` : 'Not yet chosen.'}

## Reference: the standard options for this subsystem, with their real figures
${referenceMaterial(station)}`
}

export async function reviewIdea({ stationId, missionId, mode = 'engineer', text, imageBase64, imageMediaType, picks = {} }) {
  const station = getStation(stationId)
  if (!station) throw Object.assign(new Error('Unknown subsystem'), { status: 400 })

  const mission = missionId ? getMission(missionId) : null
  const tagMenu = tagMenuFor(stationId)

  const alreadyChosen = Object.entries(picks)
    .filter(([sid]) => sid !== stationId)
    .map(([sid, pick]) => {
      const s = getStation(sid)
      const label = typeof pick === 'string' ? getOption(sid, pick)?.name.e : pick?.name
      return label ? `- ${s.name.e}: ${label}` : null
    })
    .filter(Boolean)
    .join('\n')

  const content = []
  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: imageMediaType || 'image/jpeg', data: imageBase64 },
    })
    content.push({
      type: 'text',
      text: 'This is a photo of my drawing. If it is a drawing of a satellite part, read it as an engineering sketch — labels, arrows and shapes are all meaningful. If the photo shows something that is not a drawing of a satellite part, say so kindly and set verdict to off-topic.',
    })
  }
  content.push({
    type: 'text',
    text: [
      `My idea for the ${station.name.e} subsystem:`,
      text?.trim() || '(no words — see the drawing)',
      alreadyChosen ? `\nWhat I have already chosen for the rest of my satellite:\n${alreadyChosen}` : '',
    ].join('\n'),
  })

  let response
  try {
    response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: EFFORT.station,
        format: { type: 'json_schema', schema: responseSchema(tagMenu) },
      },
      system: buildSystem(station, mission, mode, tagMenu),
      messages: [{ role: 'user', content }],
    })
  } catch (err) {
    // Typed, most specific first — the operator needs to know which of these
    // it is, and the child needs a sentence that is not a stack trace.
    if (err instanceof Anthropic.AuthenticationError) {
      throw Object.assign(new Error('The idea reviewer is not configured on the server (missing or invalid Anthropic credentials).'), { status: 503 })
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw Object.assign(new Error('Lots of people are asking at once. Wait a few seconds and try again.'), { status: 429 })
    }
    if (err instanceof Anthropic.BadRequestError) {
      throw Object.assign(new Error(`The reviewer rejected that request: ${err.message}`), { status: 400 })
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw Object.assign(new Error('Could not reach the idea reviewer. Check the network and try again.'), { status: 503 })
    }
    throw err
  }

  // Opus 5 can decline; surface that as a gentle in-app state, not a 500.
  if (response.stop_reason === 'refusal') {
    return {
      verdict: 'off-topic',
      name: 'Let us try that again',
      summary: 'I could not work with that one.',
      howItWorks: '',
      realCounterpart: '',
      goodThinking: [],
      physicsProblems: [],
      tags: [],
      declined: true,
    }
  }

  const raw = response.content.find((b) => b.type === 'text')?.text
  if (!raw) throw Object.assign(new Error('Empty response from the model'), { status: 502 })

  const parsed = Parsed.safeParse(JSON.parse(raw))
  if (!parsed.success) throw Object.assign(new Error('Model returned an unexpected shape'), { status: 502 })

  // Belt and braces: the schema enum should already guarantee this, but a bad
  // tag would silently corrupt the consequence engine, so filter anyway.
  const tags = parsed.data.tags.filter((t) => tagMenu.includes(t))
  return { ...parsed.data, tags, usage: response.usage }
}

export const STATION_IDS = STATIONS.map((s) => s.id)
