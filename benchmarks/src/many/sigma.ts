import { many } from '@combinators'
import { run, string } from '@parsers'

const Parser = many(string('x!'))

/* Wrapper for bench runner. */

export function parse(text: string): Array<string> {
  const result = run(Parser).with(text)

  switch (result.isOk) {
    case true: {
      return result.value
    }

    case false: {
      return []
    }
  }
}
