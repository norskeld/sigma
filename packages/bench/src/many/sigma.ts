import { many, run, string } from '@nrsk/sigma'

const Parser = many(string('x!'))

/* Wrapper for bench runner. */

export function parse(text: string): Array<string> {
  const result = run(Parser).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}
