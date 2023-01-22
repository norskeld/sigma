import { describe, it, expectTypeOf } from '@testing'
import * as t from '@types'

describe('parsers', () => {
  it('`SucceedingParser` should correctly infer right signature', () => {
    type SucceedingNumberParser = t.SucceedingParser<number>

    expectTypeOf<SucceedingNumberParser>().toBeObject()
    expectTypeOf<SucceedingNumberParser>().not.toBeAny()
    expectTypeOf<SucceedingNumberParser>()
      .toHaveProperty('parse')
      .returns.toMatchTypeOf<t.Success<number>>()
  })

  it('`UnsafeParser` should correctly infer right signature', () => {
    type UnsafeNumberParser = t.UnsafeParser<number>

    expectTypeOf<UnsafeNumberParser>().toBeObject()
    expectTypeOf<UnsafeNumberParser>().not.toBeAny()
    expectTypeOf<UnsafeNumberParser>()
      .toHaveProperty('parse')
      .returns.toMatchTypeOf<t.Result<number>>()
  })

  it('`Parser` should correctly infer right signature', () => {
    type NumberParser = t.Parser<number>
    expectTypeOf<NumberParser>().toBeObject()
    expectTypeOf<NumberParser>().not.toBeAny()
    expectTypeOf<NumberParser>()
      .toHaveProperty('parse')
      .toMatchTypeOf<
        | ((input: string, pos: number) => t.Success<number>)
        | ((input: string, pos: number) => t.Result<number>)
        | ((input: string, pos: number) => t.Failure)
      >()
  })
})

describe('state', () => {
  it('`Success` should correctly infer right signature', () => {
    type SuccessWithNumber = t.Success<number>

    expectTypeOf<SuccessWithNumber>().not.toBeAny()
    expectTypeOf<SuccessWithNumber>().toMatchTypeOf<{
      readonly span: t.Span
      readonly pos: number
      readonly value: number
    }>()
  })
})

describe('utils', () => {
  type ParsersTuple = [t.Parser<string>, t.Parser<number>, t.Parser<boolean>]
  type NumberParsersArray = Array<t.Parser<number>>
  type TupleResult = [string, number, boolean]

  it('`ToTuple` should correctly infer right signature', () => {
    expectTypeOf<t.ToTuple<ParsersTuple>>().toMatchTypeOf<TupleResult>()

    expectTypeOf<t.ToTuple<NumberParsersArray>>().toMatchTypeOf<[]>()
  })

  it('`ToTupleOrArray` should correctly infer right signature', () => {
    expectTypeOf<t.ToTupleOrArray<ParsersTuple>>().toMatchTypeOf<TupleResult>()
    expectTypeOf<t.ToTupleOrArray<NumberParsersArray>>().toMatchTypeOf<number[]>()

    expectTypeOf<t.ToTupleOrArray<NumberParsersArray>>().not.toMatchTypeOf<string[]>()
  })

  it('`ToUnion` should correctly infer right signature', () => {
    expectTypeOf<t.ToUnion<ParsersTuple>>().toMatchTypeOf<string | number | boolean>()

    expectTypeOf<t.ToUnion<NumberParsersArray>>().toMatchTypeOf<number>()
    expectTypeOf<t.ToUnion<NumberParsersArray>>().not.toMatchTypeOf<string>()
  })

  it('`UnwrapUnion` should correctly infer right signature', () => {
    type ParsersUnion = t.Parser<string> | t.Parser<number> | t.Parser<boolean>

    expectTypeOf<t.UnwrapUnion<ParsersUnion>>().toMatchTypeOf<
      [boolean] | [number] | [unknown] | [string]
    >()

    expectTypeOf<t.ToUnion<NumberParsersArray>>().toMatchTypeOf<number>()
    expectTypeOf<t.ToUnion<NumberParsersArray>>().not.toMatchTypeOf<string>()
  })
})
