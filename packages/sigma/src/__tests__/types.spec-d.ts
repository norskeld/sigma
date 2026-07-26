import { describe, expectTypeOf, it } from '@testing'
import type * as t from '@types'

describe('library', () => {
  it('`Parser` should correctly infer right signature', () => {
    type NumberParser = t.Parser<number>
    expectTypeOf<NumberParser>().toBeObject()
    expectTypeOf<NumberParser>().not.toBeAny()
    expectTypeOf<NumberParser>()
      .toHaveProperty('parse')
      .toMatchTypeOf<(ctx: t.ParseContext) => number | t.Fail>()
  })

  it('`SucceedingParser` should correctly infer right signature', () => {
    type SucceedingNumberParser = t.SucceedingParser<number>

    expectTypeOf<SucceedingNumberParser>().toBeObject()
    expectTypeOf<SucceedingNumberParser>().not.toBeAny()
    expectTypeOf<SucceedingNumberParser>().toHaveProperty('parse').returns.toMatchTypeOf<number>()
  })

  it('`UnsafeParser` should correctly infer right signature', () => {
    type UnsafeNumberParser = t.UnsafeParser<number>

    expectTypeOf<UnsafeNumberParser>().toBeObject()
    expectTypeOf<UnsafeNumberParser>().not.toBeAny()
    expectTypeOf<UnsafeNumberParser>()
      .toHaveProperty('parse')
      .returns.toMatchTypeOf<number | t.Fail>()
  })

  it('`Result` should correctly infer right signature', () => {
    expectTypeOf<t.Result<number>>().toMatchTypeOf<
      | {
          readonly isOk: true
          readonly start: number
          readonly end: number
          readonly pos: number
          readonly value: number
        }
      | t.Failure
    >()
  })

  it('`Success` should correctly infer right signature', () => {
    type SuccessWithNumber = t.Success<number>

    expectTypeOf<SuccessWithNumber>().not.toBeAny()
    expectTypeOf<SuccessWithNumber>().toMatchTypeOf<{
      readonly start: number
      readonly end: number
      readonly pos: number
      readonly value: number
    }>()
  })
})

describe('internal utilities', () => {
  type NumberAndString = number | string
  type ParserNumberAndString = t.Parser<number> | t.Parser<string>
  type ParsersTuple = [t.Parser<string>, t.Parser<number>]

  it('`UnionToIntersection` should correctly infer right signature', () => {
    expectTypeOf<t.UnionToIntersection<NumberAndString>>().toBeNever()

    expectTypeOf<t.UnionToIntersection<number | number>>().toBeNumber()
    expectTypeOf<t.UnionToIntersection<number | number>>().not.toBeAny()
    expectTypeOf<t.UnionToIntersection<number | number>>().not.toBeUnknown()

    expectTypeOf<t.UnionToIntersection<ParserNumberAndString>>().toMatchTypeOf<
      t.Parser<number> & t.Parser<string>
    >()
  })

  it('`UnionToTuplePreserving` should correctly infer right signature', () => {
    expectTypeOf<t.UnionToTuplePreserving<number>>().toMatchTypeOf<[number]>()
    expectTypeOf<t.UnionToTuplePreserving<NumberAndString>>().toMatchTypeOf<[number, string]>()
  })

  it('`UnwrapParserTuple` should correctly infer right signature', () => {
    expectTypeOf<t.UnwrapParserTuple<[t.Parser<string>]>>().toMatchTypeOf<[string]>()

    expectTypeOf<t.UnwrapParserTuple<ParsersTuple>>().toMatchTypeOf<[string, number]>()
    expectTypeOf<t.UnwrapParserTuple<[t.Parser<string>, t.Parser<string>]>>().toMatchTypeOf<
      [string, string]
    >()
  })

  it('`TupleToUnion` should correctly infer right signature', () => {
    expectTypeOf<t.TupleToUnion<[string, string]>>().toMatchTypeOf<string>()
    expectTypeOf<t.TupleToUnion<[string, string]>>().not.toBeAny()
    expectTypeOf<t.TupleToUnion<[string, string]>>().not.toBeUnknown()

    expectTypeOf<t.TupleToUnion<[string, number]>>().toMatchTypeOf<string | number>()
    expectTypeOf<t.TupleToUnion<[string, number]>>().not.toBeAny()
    expectTypeOf<t.TupleToUnion<[string, number]>>().not.toBeUnknown()
  })
})

describe('utilities', () => {
  type ParsersTuple = [t.Parser<string>, t.Parser<number>, t.Parser<boolean>]
  type NumberParsersArray = Array<t.Parser<number>>
  type TupleResult = [string, number, boolean]
  type ParsersUnion = t.Parser<string> | t.Parser<number> | t.Parser<boolean>

  it('`ToTuple` should correctly infer right signature', () => {
    expectTypeOf<t.ToTuple<ParsersTuple>>().toMatchTypeOf<TupleResult>()

    expectTypeOf<t.ToTuple<NumberParsersArray>>().toMatchTypeOf<[]>()
  })

  it('`ToTupleOrArray` should correctly infer right signature', () => {
    expectTypeOf<t.ToTupleOrArray<ParsersTuple>>().toMatchTypeOf<TupleResult>()
    expectTypeOf<t.ToTupleOrArray<NumberParsersArray>>().toMatchTypeOf<number[]>()

    expectTypeOf<t.ToTupleOrArray<NumberParsersArray>>().not.toMatchTypeOf<string[]>()
  })

  it('`ToFirst` should correctly infer right signature', () => {
    expectTypeOf<t.ToFirst<ParsersTuple>>().toMatchTypeOf<string>()
    expectTypeOf<t.ToFirst<NumberParsersArray>>().toMatchTypeOf<number>()

    expectTypeOf<t.ToFirst<ParsersTuple>>().not.toMatchTypeOf<boolean>()
  })

  it('`ToLast` should correctly infer right signature', () => {
    expectTypeOf<t.ToLast<ParsersTuple>>().toMatchTypeOf<boolean>()
    expectTypeOf<t.ToLast<NumberParsersArray>>().toMatchTypeOf<number>()

    expectTypeOf<t.ToLast<ParsersTuple>>().not.toMatchTypeOf<string>()
  })

  it('`ToInner` should correctly infer right signature', () => {
    expectTypeOf<t.ToInner<ParsersTuple>>().toMatchTypeOf<[number]>()
    expectTypeOf<t.ToInner<NumberParsersArray>>().toMatchTypeOf<number[]>()

    expectTypeOf<t.ToInner<[...ParsersTuple, t.Parser<string>]>>().toMatchTypeOf<
      [number, boolean]
    >()
  })

  it('`ToUnion` should correctly infer right signature', () => {
    expectTypeOf<t.ToUnion<ParsersTuple>>().toMatchTypeOf<string | number | boolean>()

    expectTypeOf<t.ToUnion<NumberParsersArray>>().toMatchTypeOf<number>()
    expectTypeOf<t.ToUnion<NumberParsersArray>>().not.toMatchTypeOf<string>()
  })

  it('`UnwrapUnion` should correctly infer right signature', () => {
    expectTypeOf<t.UnwrapUnion<ParsersUnion>>().toMatchTypeOf<
      [number, string, boolean] | [string, number, boolean]
    >()
    expectTypeOf<t.UnwrapUnion<t.Parser<string> | t.Parser<string>>>().toMatchTypeOf<[string]>()
  })

  it('`ToParser` should correctly infer right signature', () => {
    expectTypeOf<t.ToParser<t.Parser<number>>>().toMatchTypeOf<t.Parser<number>>()
    expectTypeOf<t.ToParser<ParsersUnion>>().toMatchTypeOf<t.Parser<string | number | boolean>>()
  })
})
