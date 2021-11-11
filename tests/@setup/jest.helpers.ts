import { Parser, Result } from '@lib/internal/state'

export function run<T>(parser: Parser<T>, input: string): Result<T> {
  return parser.parse({ text: input, index: 0 })
}

export function result<T>(kind: 'success' | 'failure', value: T) {
  return { kind, value } as const
}
