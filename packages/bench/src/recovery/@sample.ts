export const COUNT = 5_000
export const BROKEN_EVERY = 20
export const BROKEN_COUNT = Math.floor((COUNT - 1) / BROKEN_EVERY) + 1
export const NAMES: Array<string> = Array.from({ length: COUNT }, (_, index) => name(index))
export const CLEAN: string = NAMES.map((id) => `let ${id};`).join('')

/** Same shape, but every `BROKEN_EVERY`th statement is missing its identifier. */
export const BROKEN: string = NAMES.map((id, index) =>
  index % BROKEN_EVERY === 0 ? 'let ;' : `let ${id};`,
).join('')

/** Nothing but malformed statements, so the recovery path is never off. */
export const BROKEN_ALL: string = NAMES.map(() => 'let ;').join('')

/** Only the last statement is malformed, so a hard failure costs a full parse first. */
export const BROKEN_LAST: string = NAMES.map((id, index) =>
  index === COUNT - 1 ? 'let ;' : `let ${id};`,
).join('')

export const GROUP_COUNT = 1_000
export const GROUP_BROKEN_EVERY = 20
export const GROUP_BROKEN_COUNT: number = Math.floor((GROUP_COUNT - 1) / GROUP_BROKEN_EVERY) + 1

export const GROUP_NAMES: Array<[string, string, string, string]> = Array.from(
  { length: GROUP_COUNT },
  (_, index) => names(index),
)

export const GROUPS_CLEAN: string = GROUP_NAMES.map(
  ([a, b, c, d]) => `(${a},(${b},${c}),${d})`,
).join('')

/**
 * The malformed element sits before the inner group, so resynchronising on the first `)` ends up
 * inside it. Only a nesting-aware strategy skips out to the right place.
 */
export const GROUPS_BROKEN: string = GROUP_NAMES.map(([a, b, c, d], index) =>
  index % GROUP_BROKEN_EVERY === 0 ? `(${a},?,(${b},${c}),${d})` : `(${a},(${b},${c}),${d})`,
).join('')

/** Encodes `n` as letters, so identifiers vary instead of repeating one literal. */
function name(n: number): string {
  let out = ''
  let rest = n

  do {
    out += String.fromCharCode(97 + (rest % 26))
    rest = Math.floor(rest / 26)
  } while (rest > 0)

  return out
}

/** Four names per group, so identifiers keep varying across the sample. */
function names(index: number): [string, string, string, string] {
  const base = index * 4
  return [name(base), name(base + 1), name(base + 2), name(base + 3)]
}
