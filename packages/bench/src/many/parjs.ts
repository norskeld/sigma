import { string } from 'parjs'
import { many } from 'parjs/combinators'

const Parser = string('x!').pipe(many())

/* Wrapper for bench runner. */

export function parse(text: string): Array<string> {
  const result = Parser.parse(text)

  if (result.kind !== 'OK') {
    throw new Error(`parjs failed: ${result.reason}`)
  }

  return result.value
}
