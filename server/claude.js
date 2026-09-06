import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { STATIONS, getStation } from '../src/data/stations/index.js'
import { tagMenuFor } from '../src/data/vocab.js'
import { buildSketchPrompt, sketchSchema, sanitiseModel } from '../src/lib/sketch3d.js'
import {
  ideaSchema,
  buildSystemPrompt,
  buildUserText,
  SKETCH_INSTRUCTION,
  DECLINED_RESULT,
  VERDICTS,
  sanitiseTags,
} from '../src/lib/prompt.js'

const client = new Anthropic()

// Kid-facing latency matters more than depth here, and the task is bounded:
// judge one idea against a body of reference material we supply. Adaptive
// thinking at low effort is the right point on that curve.
const EFFORT = 'low'

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

export async function reviewIdea({ stationId, missionId, mode = 'engineer', text, imageBase64, imageMediaType, picks = {} }) {
  if (!getStation(stationId)) throw Object.assign(new Error('Unknown subsystem'), { status: 400 })
  const tagMenu = tagMenuFor(stationId)

  const content = []
  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: imageMediaType || 'image/jpeg', data: imageBase64 },
    })
    content.push({ type: 'text', text: SKETCH_INSTRUCTION })
  }
  content.push({ type: 'text', text: buildUserText({ stationId, text, picks }) })

  let response
  try {
    response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: EFFORT,
        format: { type: 'json_schema', schema: ideaSchema(tagMenu) },
      },
      system: buildSystemPrompt({ stationId, missionId, mode }),
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
  if (response.stop_reason === 'refusal') return DECLINED_RESULT

  const raw = response.content.find((b) => b.type === 'text')?.text
  if (!raw) throw Object.assign(new Error('Empty response from the model'), { status: 502 })

  const parsed = Parsed.safeParse(JSON.parse(raw))
  if (!parsed.success) throw Object.assign(new Error('Model returned an unexpected shape'), { status: 502 })

  return { ...parsed.data, tags: sanitiseTags(parsed.data.tags, tagMenu), usage: response.usage }
}

/** Read a child's drawing and return it as a 3D parts list. */
export async function describeSketch({ imageBase64, imageMediaType, mode = 'engineer', context }) {
  let response
  try {
    response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      // Reading a drawing and rebuilding it in 3D is a harder spatial task than
      // judging a written idea, so it gets more room to think.
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: sketchSchema } },
      system: buildSketchPrompt({ mode, context }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: imageMediaType || 'image/jpeg', data: imageBase64 } },
            { type: 'text', text: 'This is my drawing of my satellite. Please rebuild it in 3D.' },
          ],
        },
      ],
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw Object.assign(new Error('The drawing reader is not configured on the server.'), { status: 503 })
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw Object.assign(new Error('Lots of drawings at once. Wait a few seconds and try again.'), { status: 429 })
    }
    throw err
  }

  if (response.stop_reason === 'refusal') {
    throw Object.assign(new Error('That picture could not be used. Try a drawing of your satellite on plain paper.'), { status: 400 })
  }
  const raw = response.content.find((b) => b.type === 'text')?.text
  if (!raw) throw Object.assign(new Error('Empty response from the model'), { status: 502 })
  return sanitiseModel(JSON.parse(raw))
}

export const STATION_IDS = STATIONS.map((s) => s.id)
