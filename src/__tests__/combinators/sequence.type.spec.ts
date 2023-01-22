import { sequence } from '@combinators'
import { describe, it, expectTypeOf } from '@testing'
import { Parser } from '@types'

describe('sequence', () => {
  type StringParser = Parser<string>
  type NumberParser = Parser<number>

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
