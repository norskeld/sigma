import { Parser, Result } from '@lib/internal/state'
import { run as internal$run } from '@lib/internal/run'

type ResultKind = 'success' | 'failure'

interface ReducedResult<T> {
  kind: ResultKind
  value: T
}

export const should = {
  expose(exposed: Record<string, unknown>, ...exposees: Array<string>): void {
    exposees.forEach((exposee) => expect(exposed).toHaveProperty(exposee))
  },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    expect(received.kind).toEqual(expected.kind)

    switch (received.kind) {
      case 'success': {
        return expect(received.value).toEqual(expected.value)
      }

      case 'failure': {
        return expect(received.expected).toEqual(expected.value)
      }
    }
  }
}

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return internal$run(parser).with(text)
}

export function result<T>(kind: ResultKind, value: T): ReducedResult<T> {
  return { kind, value } as const
}

export function testFailure<P extends () => Parser<unknown>>(input: string, parser: P) {
  const actual = run(parser(), input)
  const expected = result('failure', actual.kind === 'failure' ? actual.expected : actual.value)

  should.matchState(actual, expected)
}

export function testSuccess<T, P extends () => Parser<unknown>>(
  input: string,
  value: T,
  parser: P
) {
  const actual = run(parser(), input)
  const expected = result('success', value)

  should.matchState(actual, expected)
}
