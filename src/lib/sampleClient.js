// When the app runs as a published standalone page there is no proxy of ours to
// call, but the page can ask Claude directly through the `sample` capability.
// Same prompt, same schema, same tag vocabulary as the server path.

import { tagMenuFor } from '../data/vocab.js'
import {
  ideaSchema,
  buildSystemPrompt,
  buildUserText,
  SKETCH_INSTRUCTION,
  sanitiseTags,
} from './prompt.js'

let samplePromise = null
const getSample = () => {
  if (!samplePromise) {
    samplePromise = window.claude?.use
      ? window.claude.use('sample').catch(() => null)
      : Promise.resolve(null)
  }
  return samplePromise
}

export async function sampleAvailable() {
  return Boolean(await getSample())
}

export async function reviewIdeaViaSample({ stationId, missionId, mode, text, image, picks }) {
  const sample = await getSample()
  if (!sample) throw new Error('The idea reviewer is not available in this view.')

  const tagMenu = tagMenuFor(stationId)
  const schema = ideaSchema(tagMenu)

  // Images are a capability of their own; fall back to text rather than failing.
  let images
  if (image) {
    const limits = await sample.limits?.().catch(() => null)
    if (limits?.images) images = [image]
  }

  const instruction = [
    buildSystemPrompt({ stationId, missionId, mode }),
    '',
    '## Output',
    'Reply with JSON only, matching this schema exactly. No prose outside the JSON.',
    JSON.stringify(schema),
    '',
    images ? SKETCH_INSTRUCTION : '',
    '',
    buildUserText({ stationId, text, picks }),
  ].filter(Boolean).join('\n')

  let data
  try {
    data = await sample.json(instruction, {
      images,
      modelTier: 'default',
      // Two children describing the same idea should each get their own answer.
      cache: false,
    })
  } catch (err) {
    if (err?.code === 'not_granted') throw new Error('The idea reviewer needs your permission to run.')
    if (err?.code === 'rate_limited') throw new Error('Lots of people are asking at once. Wait a few seconds and try again.')
    throw new Error(err?.message || 'The idea reviewer could not answer that one.')
  }

  if (!data || typeof data !== 'object' || !data.verdict) {
    throw new Error('The idea reviewer returned something unreadable. Try rewording it.')
  }

  return {
    verdict: data.verdict,
    name: data.name || 'Your design',
    summary: data.summary || '',
    howItWorks: data.howItWorks || '',
    realCounterpart: data.realCounterpart || '',
    goodThinking: Array.isArray(data.goodThinking) ? data.goodThinking : [],
    physicsProblems: Array.isArray(data.physicsProblems) ? data.physicsProblems : [],
    tags: sanitiseTags(data.tags, tagMenu),
  }
}
