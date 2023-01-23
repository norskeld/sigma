import * as p from '@parsers'
import { describe, expectTypeOf, it } from '@testing'
import { Parser, SucceedingParser, Result, Success } from '@types'

type UnknownParser = Parser<unknown>
type NullParser = Parser<null>

type StringParser = Parser<string>
type NumberParser = Parser<number>

describe('any', () => {
  const { any } = p

  it('any should have correct inferred signature', () => {
    expectTypeOf(any).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(any).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(any).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('defer', () => {
  const { defer } = p

  it('defer should have correct inferred signature', () => {
    expectTypeOf(defer).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(defer<string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(defer<number>).returns.toMatchTypeOf<NumberParser>()
  })
})

describe('eof', () => {
  const { eof } = p

  it('eof should have correct inferred signature', () => {
    expectTypeOf(eof).returns.toMatchTypeOf<NullParser>()
    expectTypeOf(eof).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(eof).returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('eol', () => {
  const { eol } = p

  it('eol should have correct inferred signature', () => {
    expectTypeOf(eol).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(eol).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(eol).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('letter', () => {
  const { letter, letters } = p

  it('letter should have correct inferred signature', () => {
    expectTypeOf(letter).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(letter).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(letter).returns.not.toMatchTypeOf<NumberParser>()
  })

  it('letters should have correct inferred signature', () => {
    expectTypeOf(letters).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(letters).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(letters).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('noneOf', () => {
  const { noneOf } = p

  it('noneOf should have correct inferred signature', () => {
    expectTypeOf(noneOf).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(noneOf).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(noneOf).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('nothing', () => {
  const { nothing } = p

  it('nothing should have correct inferred signature', () => {
    expectTypeOf(nothing).returns.toMatchTypeOf<NullParser>()
    expectTypeOf(nothing).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(nothing).returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('numbers', () => {
  const { binary, float, hex, integer, octal, whole } = p

  it('binary should have correct inferred signature', () => {
    expectTypeOf(binary).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(binary).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(binary).returns.not.toMatchTypeOf<StringParser>()
  })

  it('float should have correct inferred signature', () => {
    expectTypeOf(float).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(float).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(float).returns.not.toMatchTypeOf<StringParser>()
  })

  it('hex should have correct inferred signature', () => {
    expectTypeOf(hex).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(hex).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(hex).returns.not.toMatchTypeOf<StringParser>()
  })

  it('integer should have correct inferred signature', () => {
    expectTypeOf(integer).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(integer).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(integer).returns.not.toMatchTypeOf<StringParser>()
  })

  it('octal should have correct inferred signature', () => {
    expectTypeOf(octal).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(octal).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(octal).returns.not.toMatchTypeOf<StringParser>()
  })

  it('whole should have correct inferred signature', () => {
    expectTypeOf(whole).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(whole).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(whole).returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('oneOf', () => {
  const { oneOf } = p

  it('oneOf should have correct inferred signature', () => {
    expectTypeOf(oneOf).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(oneOf).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(oneOf).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('regexp', () => {
  const { regexp } = p

  it('regexp should have correct inferred signature', () => {
    expectTypeOf(regexp).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(regexp).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(regexp).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('rest', () => {
  const { rest } = p

  it('rest should have correct inferred signature', () => {
    expectTypeOf(rest).returns.toMatchTypeOf<SucceedingParser<string>>()
    expectTypeOf(rest).returns.toMatchTypeOf<SucceedingParser<unknown>>()
    expectTypeOf(rest).returns.not.toMatchTypeOf<SucceedingParser<number>>()
  })
})

describe('run', () => {
  const { run } = p

  it('run should have correct inferred signature', () => {
    expectTypeOf(run).returns.toMatchTypeOf<{ with: (input: string) => Result<unknown> }>()
    expectTypeOf(run<string>).returns.toMatchTypeOf<{ with: (input: string) => Result<string> }>()
    expectTypeOf(run<string>).returns.not.toMatchTypeOf<{
      with: (input: string) => Result<number>
    }>()
  })
})

describe('string', () => {
  const { string, ustring } = p

  it('string should have correct inferred signature', () => {
    expectTypeOf(string).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(string).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(string).returns.not.toMatchTypeOf<NumberParser>()
  })

  it('ustring should have correct inferred signature', () => {
    expectTypeOf(ustring).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(ustring).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(ustring).returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('tryRun', () => {
  const { tryRun } = p

  it('tryRun should have correct inferred signature', () => {
    expectTypeOf(tryRun).returns.toMatchTypeOf<{ with: (input: string) => Success<unknown> }>()
    expectTypeOf(tryRun<string>).returns.toMatchTypeOf<{
      with: (input: string) => Success<string>
    }>()
    expectTypeOf(tryRun<string>).returns.not.toMatchTypeOf<{
      with: (input: string) => Success<number>
    }>()
  })
})

describe('whitespace', () => {
  const { whitespace } = p

  it('whitespace should have correct inferred signature', () => {
    expectTypeOf(whitespace).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(whitespace).returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf(whitespace).returns.not.toMatchTypeOf<NumberParser>()
  })
})
