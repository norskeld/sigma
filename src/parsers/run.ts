import type { Parser, Result } from '../state'

interface Runnable<T> {
  with(input: string): Result<T>
}

export function run<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(input) {
      return parser.parse(input, 0)
    }
  }
}
