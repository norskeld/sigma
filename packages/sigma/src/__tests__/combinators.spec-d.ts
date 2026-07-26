import * as c from '@combinators'
import { describe, expectTypeOf, it } from '@testing'
import type { Parser, SucceedingParser } from '@types'

type UnknownParser = Parser<unknown>

type StringParser = Parser<string>
type NumberParser = Parser<number>
type StringOrNumberParser = Parser<string | number>

type StringParsers = Parser<string[]>
type NumberParsers = Parser<number[]>

declare const p: StringParser

describe('chain', () => {
  const { chainl, chainr } = c

  it('chainl should have correct inferred signature', () => {
    expectTypeOf<typeof chainl>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof chainl<string, string, string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof chainl<number, number, string>>().returns.toMatchTypeOf<NumberParser>()
  })

  it('chainr should have correct inferred signature', () => {
    expectTypeOf<typeof chainr>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof chainr<string, string, string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof chainr<number, number, string>>().returns.toMatchTypeOf<NumberParser>()
  })
})

describe('choice', () => {
  const { choice } = c

  it('choice should have correct inferred signature', () => {
    expectTypeOf<typeof choice<[]>>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof choice<[StringParser, NumberParser]>>().returns.toMatchTypeOf<
      Parser<string | number>
    >()
    expectTypeOf<typeof choice<[StringParser, StringParser]>>().returns.toMatchTypeOf<
      Parser<string>
    >()
  })
})

describe('count', () => {
  const { count } = c

  it('count should have correct inferred signature', () => {
    expectTypeOf<typeof count>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof count<string>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof count<number>>().returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('error', () => {
  const { error } = c

  it('error should have correct inferred signature', () => {
    expectTypeOf<typeof error>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof error<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof error<number>>().returns.toMatchTypeOf<NumberParser>()

    expectTypeOf<typeof error<number | string>>().returns.toMatchTypeOf<StringOrNumberParser>()
  })
})

describe('filter', () => {
  const { filter } = c

  it('filter should have correct inferred signature', () => {
    expectTypeOf<typeof filter>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof filter<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof filter<number>>().returns.toMatchTypeOf<NumberParser>()
  })
})

describe('lookahead', () => {
  const { lookahead } = c

  it('lookahead should have correct inferred signature', () => {
    expectTypeOf<typeof lookahead>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof lookahead<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof lookahead<number>>().returns.toMatchTypeOf<NumberParser>()

    expectTypeOf<typeof lookahead<number | string>>().returns.toMatchTypeOf<StringOrNumberParser>()
  })
})

describe('many', () => {
  const { many, many1 } = c

  it('many should have correct inferred signature', () => {
    expectTypeOf<typeof many>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof many<string>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof many<number>>().returns.toMatchTypeOf<NumberParsers>()
  })

  it('many1 should have correct inferred signature', () => {
    expectTypeOf<typeof many1>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof many1<string>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof many1<number>>().returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('map', () => {
  const { map } = c

  it('map should have correct inferred signature', () => {
    expectTypeOf<typeof map>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof map<string, number>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof map<string, string>>().returns.toMatchTypeOf<StringParser>()
  })
})

describe('not', () => {
  const { not } = c

  it('not should have correct inferred signature', () => {
    expectTypeOf<typeof not>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof not>().returns.toMatchTypeOf<Parser<null>>()
  })
})

describe('optional', () => {
  const { optional } = c

  it('optional should have correct inferred signature', () => {
    expectTypeOf<typeof optional>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof optional<string>>().returns.toMatchTypeOf<Parser<string | null>>()
    expectTypeOf<typeof optional<number>>().returns.toMatchTypeOf<Parser<number | null>>()
  })
})

describe('sepBy', () => {
  const { sepBy, sepBy1 } = c

  it('sepBy should have correct inferred signature', () => {
    expectTypeOf<typeof sepBy>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof sepBy<string, number>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof sepBy<number, string>>().returns.toMatchTypeOf<NumberParsers>()
  })

  it('sepBy1 should have correct inferred signature', () => {
    expectTypeOf<typeof sepBy1>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof sepBy1<string, number>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof sepBy1<number, string>>().returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('sequence', () => {
  const { sequence } = c

  it('sequence should have correct inferred signature (from tuple)', () => {
    expectTypeOf<typeof sequence<[StringParser, StringParser]>>().returns.toMatchTypeOf<
      Parser<[string, string]>
    >()

    expectTypeOf<typeof sequence<[StringParser, NumberParser]>>().returns.toMatchTypeOf<
      Parser<[string, number]>
    >()

    // Fix this ?
    expectTypeOf<typeof sequence<(NumberParser | StringParser)[]>>().returns.toMatchTypeOf<
      Parser<string[] | number[]>
    >()
  })

  it('should have correct inferred signature (from array)', () => {
    expectTypeOf<typeof sequence<Array<StringParser>>>().returns.toMatchTypeOf<StringParsers>()
    expectTypeOf<typeof sequence<Array<NumberParser>>>().returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('selector', () => {
  const { first, inner, last, outer } = c

  it('first should have correct inferred signature', () => {
    expectTypeOf<typeof first>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof first<[StringParser, NumberParser]>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof first<[NumberParser, StringParser]>>().returns.toMatchTypeOf<NumberParser>()

    expectTypeOf<
      typeof first<[StringParser, NumberParser, NumberParser]>
    >().returns.toMatchTypeOf<StringParser>()
  })

  it('last should have correct inferred signature', () => {
    expectTypeOf<typeof last>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof last<[StringParser, NumberParser]>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof last<[NumberParser, StringParser]>>().returns.toMatchTypeOf<StringParser>()

    expectTypeOf<
      typeof last<[NumberParser, NumberParser, StringParser]>
    >().returns.toMatchTypeOf<StringParser>()
  })

  it('inner should have correct inferred signature', () => {
    expectTypeOf<typeof inner<string, number, string>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof inner<number, string, number>>().returns.toMatchTypeOf<StringParser>()

    expectTypeOf<
      typeof inner<[StringParser, NumberParser, StringParser, StringParser]>
    >().returns.toMatchTypeOf<Parser<[number, string]>>()
  })

  it('outer should have correct inferred signature', () => {
    expectTypeOf<typeof outer>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof outer<[StringParser, NumberParser, StringParser]>>().returns.toMatchTypeOf<
      Parser<[string, string]>
    >()

    expectTypeOf<
      typeof outer<[NumberParser, StringParser, StringParser, NumberParser]>
    >().returns.toMatchTypeOf<Parser<[number, number]>>()
  })

  it('should reject calls below the minimum arity', () => {
    // @ts-expect-error `first` requires at least two parsers.
    first(p)

    // @ts-expect-error `last` requires at least two parsers.
    last(p)

    // @ts-expect-error `inner` requires at least three parsers.
    inner(p, p)

    // @ts-expect-error `outer` requires at least three parsers.
    outer(p, p)
  })
})

describe('until', () => {
  const { takeUntil, skipUntil } = c

  it('takeUntil should have correct inferred signature', () => {
    expectTypeOf<typeof takeUntil>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof takeUntil<string, number>>().returns.toMatchTypeOf<
      Parser<[string[], number]>
    >()
    expectTypeOf<typeof takeUntil<number, string>>().returns.toMatchTypeOf<
      Parser<[number[], string]>
    >()
  })

  it('skipUntil should have correct inferred signature', () => {
    expectTypeOf<typeof skipUntil>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof skipUntil<string, number>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof skipUntil<number, string>>().returns.toMatchTypeOf<StringParser>()
  })
})

describe('when', () => {
  const { when } = c

  it('when should have correct inferred signature', () => {
    expectTypeOf<typeof when>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof when<number, StringParser>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof when<number, NumberParser>>().returns.toMatchTypeOf<NumberParser>()
  })
})

describe('commit', () => {
  const { backtrack, commit } = c

  it('commit should have correct inferred signature', () => {
    expectTypeOf<typeof commit>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof commit<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof commit<number>>().returns.toMatchTypeOf<NumberParser>()
  })

  it('backtrack should have correct inferred signature', () => {
    expectTypeOf<typeof backtrack>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof backtrack<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof backtrack<number>>().returns.toMatchTypeOf<NumberParser>()
  })
})

describe('recover', () => {
  const { recover } = c

  it('recover should widen to the fallback type', () => {
    expectTypeOf<typeof recover<string, number>>().returns.toMatchTypeOf<StringOrNumberParser>()
  })

  it('recover should resolve to null without a fallback', () => {
    expectTypeOf<typeof recover<string>>().returns.toMatchTypeOf<Parser<string | null>>()
  })
})

describe('sync', () => {
  const { syncNested, syncPast, syncTo } = c

  it('syncTo and syncPast should never fail', () => {
    expectTypeOf<typeof syncTo>().returns.toMatchTypeOf<SucceedingParser<null>>()
    expectTypeOf<typeof syncPast>().returns.toMatchTypeOf<SucceedingParser<null>>()
  })

  it('syncNested should be fallible', () => {
    expectTypeOf<typeof syncNested>().returns.toMatchTypeOf<Parser<null>>()
  })
})
