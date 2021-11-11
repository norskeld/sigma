import { Parser, Result } from '@lib/internal/state'

type ResultKind = 'success' | 'failure'

interface ReducedResult<T> {
  kind: ResultKind
  value: T
}

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return parser.parse({ text, index: 0 })
}

export function result<T>(kind: ResultKind, value: T): ReducedResult<T> {
  return { kind, value } as const
}

export const should = {
  expose(exposed: Record<string, unknown>, ...exposees: Array<string>): void {
    exposees.forEach((exposee) => expect(exposed).toHaveProperty(exposee))
  },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    expect(received.kind).toEqual(expected.kind)

    // prettier-ignore
    switch (received.kind) {
        case 'success': return expect(received.value).toEqual(expected.value)
        case 'failure': return expect(received.expected).toEqual(expected.value)
      }
  }
}
