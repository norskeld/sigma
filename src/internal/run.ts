import { Parser, Result } from './state'

interface Runnable<T> {
  with(input: string): Result<T>
}

export function run<T>(parser: Parser<T>): Runnable<T> {
  return {
    with(text: string) {
      return parser.parse({ text, index: 0 })
    }
  }
}
