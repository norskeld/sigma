import { run as internal$run } from '@parsers'
import type { Failure, Parser, Result, Success } from '@types'
import { EMPTY_ERRORS, FAIL, ParseContext } from '@types'
import { expect } from 'vitest'

interface ReducedResult<T> {
  isOk: boolean
  value: T
}

/** A whole {@link Result}, with the recovery fields defaulting to "nothing was recovered". */
type ExpectedResult<T> =
  | (Omit<Success<T>, 'errors'> & Partial<Pick<Success<T>, 'errors'>>)
  | (Omit<Failure, 'errors' | 'label'> & Partial<Pick<Failure, 'errors' | 'label'>>)

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return internal$run(parser).with(text)
}

export function parseAt<T>(parser: Parser<T>, input: string, pos: number): Result<T> {
  const ctx = new ParseContext(input)
  ctx.pos = pos

  const value = parser.parse(ctx)
  const errors = ctx.errors.length === 0 ? EMPTY_ERRORS : ctx.errors

  if (value === FAIL || ctx.fatal) {
    return {
      isOk: false,
      start: ctx.errorStart,
      end: ctx.errorEnd,
      pos: ctx.errorPos,
      expected: ctx.expected,
      label: ctx.label,
      errors,
    }
  }

  return {
    isOk: true,
    start: pos,
    end: ctx.pos,
    pos: ctx.pos,
    value: value as T,
    errors,
  }
}

export function result<T>(isOk: boolean, value: T): ReducedResult<T> {
  return { isOk, value } as const
}

export const should = {
  expose(exposed: Record<string, unknown>, ...exposes: Array<string>): void {
    exposes.forEach((expose) => expect(exposed[expose]).toBeTruthy())
  },

  notExpose(exposed: Record<string, unknown>, ...exposes: Array<string>): void {
    exposes.forEach((expose) => expect(exposed).not.toHaveProperty(expose))
  },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    expect(received.isOk).toBe(expected.isOk)

    switch (received.isOk) {
      case true: {
        expect(received.value).toStrictEqual(expected.value)
        break
      }

      case false: {
        expect(received.expected).toStrictEqual(expected.value)
        break
      }
    }
  },

  matchResult<T>(received: Result<T>, expected: ExpectedResult<T>): void {
    const defaults = expected.isOk
      ? { errors: EMPTY_ERRORS }
      : { label: null, errors: EMPTY_ERRORS }

    expect(received).toStrictEqual({ ...defaults, ...expected })
  },

  matchErrors<T>(received: Result<T>, expected: Array<string>): void {
    expect(received.errors.map((error) => error.expected)).toStrictEqual(expected)
  },

  matchLabels<T>(received: Result<T>, expected: Array<string | null>): void {
    expect(received.errors.map((error) => error.label)).toStrictEqual(expected)
  },

  beEqual<T = unknown>(a: T, b: T, message?: string) {
    expect(a, message).toBe(b)
  },

  beStrictEqual<T = unknown>(a: T, b: T, message?: string) {
    expect(a, message).toStrictEqual(b)
  },

  throw(f: () => void) {
    expect(f).toThrow()
  },

  throwError<T extends Error>(f: () => void, error: T) {
    expect(f).toThrowError(error.message)
  },
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

export const expectedCore = ['run', 'tryRun'] as const

export const expectedCombinators = [
  'backtrack',
  'chainl',
  'chainr',
  'choice',
  'commit',
  'count',
  'error',
  'filter',
  'first',
  'inner',
  'last',
  'lookahead',
  'many',
  'many1',
  'map',
  'mapTo',
  'not',
  'optional',
  'outer',
  'recover',
  'sepBy',
  'sepBy1',
  'sequence',
  'skipUntil',
  'syncNested',
  'syncPast',
  'syncTo',
  'takeUntil',
  'when',
] as const

export const expectedParsers = [
  'any',
  'binary',
  'defer',
  'eof',
  'eol',
  'fail',
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
  'string',
  'whitespace',
  'whole',
] as const

export { assertType, describe, expect, expectTypeOf, it } from 'vitest'
