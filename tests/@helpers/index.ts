import { run as internal$run } from '@lib/parsers/run'
import type { Parser, Result } from '@lib/state'

interface ReducedResult<T> {
  isOk: boolean
  value: T
}

export const should = {
  expose(exposed: Record<string, unknown>, ...exposees: Array<string>): void {
    exposees.forEach((exposee) => expect(exposed).toHaveProperty(exposee))
  },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    expect(received.isOk).toEqual(expected.isOk)

    switch (received.isOk) {
      case true: {
        return expect(received.value).toEqual(expected.value)
      }

      case false: {
        return expect(received.expected).toEqual(expected.value)
      }
    }
  }
}

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return internal$run(parser).with(text)
}

export function result<T>(isOk: boolean, value: T): ReducedResult<T> {
  return { isOk, value } as const
}

export function testFailure<P extends () => Parser<unknown>>(input: string, parser: P) {
  const actual = run(parser(), input)
  const expected = result(false, !actual.isOk ? actual.expected : actual.value)

  should.matchState(actual, expected)
}

export function testSuccess<T, P extends () => Parser<unknown>>(
  input: string,
  value: T,
  parser: P
) {
  const actual = run(parser(), input)
  const expected = result(true, value)

  should.matchState(actual, expected)
}
