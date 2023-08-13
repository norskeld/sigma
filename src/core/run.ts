import type { Parser, Result } from '@types'

/** @internal */
interface Runnable<T> {
  with(input: string): Result<T>
}

/**
 * Runs a parser with provided input.
 *
 * @param parser - Parser to run
 *
 * @returns Parser result
 */
export function run<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(input) {
      return parser.parse(input, 0)
    }
  }
}
