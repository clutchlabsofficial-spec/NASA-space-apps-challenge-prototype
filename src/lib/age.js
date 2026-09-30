/**
 * Age, and what it actually changes.
 *
 * The app used to have a two-position switch labelled "Engineer / Explorer" and
 * a note that Engineer meant 11–18. That is backwards: a child should not have
 * to work out which bucket they belong in, and the buckets were arbitrary
 * anyway — a curious nine-year-old and a bored fifteen-year-old are not well
 * served by a hard line at 11.
 *
 * So: the child types their real age. That does two things.
 *
 *   1. It picks a voice — `explorer` or `engineer` — which selects the `x` or
 *      `e` string throughout the curated content. That part is still binary,
 *      because every piece of written content has exactly two versions.
 *
 *   2. It is passed to Claude as a NUMBER. That part is not binary at all.
 *      "This child is 8" and "this child is 10" produce genuinely different
 *      writing from the model, and that is where the fine-grained calibration
 *      lives. The two buckets are for the pre-written text; the real age is for
 *      everything generated.
 *
 * The threshold is one constant, in one place, and the child can override the
 * voice afterwards without lying about their age — some ten-year-olds want the
 * technical words and should be allowed to have them.
 */

/** At or below this age, curated text uses the Explorer voice by default. */
export const EXPLORER_MAX = 10

/** Ages outside this range are almost certainly a typo or a joke. */
export const MIN_AGE = 4
export const MAX_AGE = 110

export const MODES = ['explorer', 'engineer']

/** The default voice for an age. Nothing else in the app hard-codes 11. */
export function modeForAge(age) {
  if (!Number.isFinite(age)) return 'engineer'
  return age <= EXPLORER_MAX ? 'explorer' : 'engineer'
}

/** Accepts whatever the input field produced; returns a usable age or null. */
export function parseAge(raw) {
  const n = Number.parseInt(String(raw).trim(), 10)
  if (!Number.isFinite(n)) return null
  if (n < MIN_AGE || n > MAX_AGE) return null
  return n
}

/**
 * How to describe a reader to Claude. Deliberately a sentence rather than a
 * label, because the model calibrates far better from "this reader is 8" than
 * from "mode: explorer".
 */
export function readerBrief(age, mode) {
  const known = Number.isFinite(age)
  if (!known) {
    return mode === 'explorer'
      ? 'This reader is a young child. Short sentences, everyday words, explain by comparison to things they already know.'
      : 'This reader is a teenager. Real engineering vocabulary, explained as you go. Treat them as a junior colleague.'
  }

  if (age <= 7) {
    return `This reader is ${age} years old. Use very short sentences and only everyday words. Compare everything to things in a house, a playground or a kitchen. One idea per sentence. Never use a technical word without immediately saying what it means in other words. Be warm and never talk down to them — they are young, not stupid.`
  }
  if (age <= 10) {
    return `This reader is ${age} years old. Short sentences, everyday words, and comparisons to things they know. You may introduce a real technical term if you immediately explain it, because children this age enjoy knowing the proper name for things. Warm, never patronising.`
  }
  if (age <= 13) {
    return `This reader is ${age} years old. Use real engineering vocabulary and explain each term the first time. They can follow a two-step chain of cause and effect. Treat them as someone who could genuinely build this.`
  }
  if (age <= 18) {
    return `This reader is ${age} years old. Use proper engineering vocabulary without apologising for it. They can handle trade-offs, constraints and the idea that there is no single right answer. Treat them as a junior colleague on the team.`
  }
  return `This reader is an adult (${age}). Write as you would for a capable engineer new to spacecraft specifically. Do not simplify the engineering; do skip the space-specific background they would not have.`
}

/** A short human label for the chosen voice, used in the UI. */
export const MODE_LABEL = {
  explorer: { name: 'Explorer', hint: 'Everyday words' },
  engineer: { name: 'Engineer', hint: 'Real engineering words' },
}
