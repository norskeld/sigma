import { expect } from 'vitest'

import { run as internal$run } from '#parsers'
import type { Parser, Result } from '#state'

interface ReducedResult<T> {
  isOk: boolean
  value: T
}

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return internal$run(parser).with(text)
}

export function result<T>(isOk: boolean, value: T): ReducedResult<T> {
  return { isOk, value } as const
}

export const should = {
  expose(exposed: Record<string, unknown>, ...exposees: Array<string>): void {
    exposees.forEach((exposee) => expect(exposed[exposee]).toBeTruthy())
  },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    expect(received.isOk).toBe(expected.isOk)

    switch (received.isOk) {
      case true: {
        return expect(received.value).toStrictEqual(expected.value)
      }

      case false: {
        return expect(received.expected).toStrictEqual(expected.value)
      }
    }
  },

  beEqual<T = unknown>(a: T, b: T, message?: string) {
    expect(a, message).toBe(b)
  },

  throw(f: () => void) {
    expect(f).toThrow()
  }
}

export function testFailure<P extends Parser<unknown>>(input: string, parser: P) {
  const actual = run(parser, input)
  const expected = result(false, !actual.isOk ? actual.expected : actual.value)

  should.matchState(actual, expected)
}

export function testSuccess<T, P extends Parser<unknown>>(input: string, value: T, parser: P) {
  const actual = run(parser, input)
  const expected = result(true, value)

  should.matchState(actual, expected)
}

export const expectedCombinators = [
  'chainl',
  'choice',
  'error',
  'many',
  'many1',
  'map',
  'mapTo',
  'optional',
  'sepBy',
  'sepBy1',
  'sequence',
  'takeLeft',
  'takeMid',
  'takeRight',
  'takeSides',
  'when'
] as const

export const expectedParsers = [
  'any',
  'binary',
  'defer',
  'eof',
  'eol',
  'float',
  'hex',
  'integer',
  'letter',
  'letters',
  'noneOf',
  'nothing',
  'octal',
  'oneOf',
  'regexp',
  'rest',
  'run',
  'string',
  'ustring',
  'whitespace',
  'whole'
] as const

export { describe, expect, it } from 'vitest'
