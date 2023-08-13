import * as p from '@parsers'
import { describe, expectTypeOf, it } from '@testing'
import { Parser, SucceedingParser } from '@types'

type UnknownParser = Parser<unknown>
type NullParser = Parser<null>

type StringParser = Parser<string>
type NumberParser = Parser<number>

describe('any', () => {
  const { any } = p

  it('any should have correct inferred signature', () => {
    expectTypeOf<typeof any>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof any>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof any>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('defer', () => {
  const { defer } = p

  it('defer should have correct inferred signature', () => {
    expectTypeOf<typeof defer>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof defer<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof defer<number>>().returns.toMatchTypeOf<NumberParser>()
  })
})

describe('eof', () => {
  const { eof } = p

  it('eof should have correct inferred signature', () => {
    expectTypeOf<typeof eof>().returns.toMatchTypeOf<NullParser>()
    expectTypeOf<typeof eof>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof eof>().returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('eol', () => {
  const { eol } = p

  it('eol should have correct inferred signature', () => {
    expectTypeOf<typeof eol>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof eol>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof eol>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('letter', () => {
  const { letter, letters } = p

  it('letter should have correct inferred signature', () => {
    expectTypeOf<typeof letter>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof letter>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof letter>().returns.not.toMatchTypeOf<NumberParser>()
  })

  it('letters should have correct inferred signature', () => {
    expectTypeOf<typeof letters>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof letters>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof letters>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('noneOf', () => {
  const { noneOf } = p

  it('noneOf should have correct inferred signature', () => {
    expectTypeOf<typeof noneOf>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof noneOf>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof noneOf>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('nothing', () => {
  const { nothing } = p

  it('nothing should have correct inferred signature', () => {
    expectTypeOf<typeof nothing>().returns.toMatchTypeOf<NullParser>()
    expectTypeOf<typeof nothing>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof nothing>().returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('numbers', () => {
  const { binary, float, hex, integer, octal, whole } = p

  it('binary should have correct inferred signature', () => {
    expectTypeOf<typeof binary>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof binary>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof binary>().returns.not.toMatchTypeOf<StringParser>()
  })

  it('float should have correct inferred signature', () => {
    expectTypeOf<typeof float>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof float>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof float>().returns.not.toMatchTypeOf<StringParser>()
  })

  it('hex should have correct inferred signature', () => {
    expectTypeOf<typeof hex>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof hex>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof hex>().returns.not.toMatchTypeOf<StringParser>()
  })

  it('integer should have correct inferred signature', () => {
    expectTypeOf<typeof integer>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof integer>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof integer>().returns.not.toMatchTypeOf<StringParser>()
  })

  it('octal should have correct inferred signature', () => {
    expectTypeOf<typeof octal>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof octal>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof octal>().returns.not.toMatchTypeOf<StringParser>()
  })

  it('whole should have correct inferred signature', () => {
    expectTypeOf<typeof whole>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof whole>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof whole>().returns.not.toMatchTypeOf<StringParser>()
  })
})

describe('oneOf', () => {
  const { oneOf } = p

  it('oneOf should have correct inferred signature', () => {
    expectTypeOf<typeof oneOf>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof oneOf>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof oneOf>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('regexp', () => {
  const { regexp } = p

  it('regexp should have correct inferred signature', () => {
    expectTypeOf<typeof regexp>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof regexp>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof regexp>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('rest', () => {
  const { rest } = p

  it('rest should have correct inferred signature', () => {
    expectTypeOf<typeof rest>().returns.toMatchTypeOf<SucceedingParser<string>>()
    expectTypeOf<typeof rest>().returns.toMatchTypeOf<SucceedingParser<unknown>>()
    expectTypeOf<typeof rest>().returns.not.toMatchTypeOf<SucceedingParser<number>>()
  })
})

describe('string', () => {
  const { string, ustring } = p

  it('string should have correct inferred signature', () => {
    expectTypeOf<typeof string>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof string>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof string>().returns.not.toMatchTypeOf<NumberParser>()
  })

  it('ustring should have correct inferred signature', () => {
    expectTypeOf<typeof ustring>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof ustring>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof ustring>().returns.not.toMatchTypeOf<NumberParser>()
  })
})

describe('whitespace', () => {
  const { whitespace } = p

  it('whitespace should have correct inferred signature', () => {
    expectTypeOf<typeof whitespace>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof whitespace>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof whitespace>().returns.not.toMatchTypeOf<NumberParser>()
  })
})
