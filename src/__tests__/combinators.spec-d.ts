import * as c from '@combinators'
import { describe, expectTypeOf, it } from '@testing'
import { Parser } from '@types'

type StringParser = Parser<string>
type NumberParser = Parser<number>
type UnknownParser = Parser<unknown>

describe('attempt', () => {
  const { attempt } = c

  it('should have correct inferred signature', () => {
    expectTypeOf(attempt<string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(attempt).returns.toMatchTypeOf<UnknownParser>()
  })
})

describe('chain', () => {
  const { chainl } = c

  it('should have correct inferred signature', () => {
    expectTypeOf(chainl<string, string, string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(chainl<number, number, string>).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(chainl).returns.toMatchTypeOf<UnknownParser>()
  })
})

describe.todo('choice', () => {
  const { choice } = c

  it('should have correct inferred signature', () => {
    // expectTypeOf(choice<Array<string>>).returns.toMatchTypeOf<
    //  StringParser
    // >()
    // expectTypeOf(choice<number, number, string>).returns.toMatchTypeOf<
    //   NumberParser
    // >()
  })
})

describe('sequence', () => {
  const { sequence } = c

  it('should have correct inferred signature', () => {
    expectTypeOf(sequence<[StringParser, StringParser]>).returns.toMatchTypeOf<
      Parser<[string, string]>
    >()
    expectTypeOf(sequence<[StringParser, NumberParser]>).returns.toMatchTypeOf<
      Parser<[string, number]>
    >()
    expectTypeOf(sequence<StringParser[]>).returns.toMatchTypeOf<Parser<string[]>>()
    expectTypeOf(sequence<NumberParser[]>).returns.toMatchTypeOf<Parser<number[]>>()

    // Fix this ?
    expectTypeOf(sequence<(NumberParser | StringParser)[]>).returns.toMatchTypeOf<
      Parser<string[] | number[]>
    >()
  })
})
