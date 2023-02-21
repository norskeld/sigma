import * as c from '@combinators'
import { describe, expectTypeOf, it } from '@testing'
import { Parser, SucceedingParser } from '@types'

type UnknownParser = Parser<unknown>

type StringParser = Parser<string>
type NumberParser = Parser<number>
type StringOrNumberParser = Parser<string | number>

type StringParsers = Parser<string[]>
type NumberParsers = Parser<number[]>

describe('attempt', () => {
  const { attempt } = c

  it('attempt should have correct inferred signature', () => {
    expectTypeOf<typeof attempt>().returns.toMatchTypeOf<UnknownParser>()
    expectTypeOf<typeof attempt<string>>().returns.toMatchTypeOf<StringParser>()
  })
})

describe('chain', () => {
  const { chainl } = c

  it('chainl should have correct inferred signature', () => {
    expectTypeOf<typeof chainl>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof chainl<string, string, string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof chainl<number, number, string>>().returns.toMatchTypeOf<NumberParser>()
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

describe('error', () => {
  const { error } = c

  it('error should have correct inferred signature', () => {
    expectTypeOf<typeof error>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof error<string>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof error<number>>().returns.toMatchTypeOf<NumberParser>()

    expectTypeOf<typeof error<number | string>>().returns.toMatchTypeOf<StringOrNumberParser>()
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

    expectTypeOf<typeof many<string>>().returns.toMatchTypeOf<SucceedingParser<string[]>>()
    expectTypeOf<typeof many<number>>().returns.toMatchTypeOf<SucceedingParser<number[]>>()
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

describe('take', () => {
  const { takeLeft, takeMid, takeRight, takeSides } = c

  it('takeLeft should have correct inferred signature', () => {
    expectTypeOf<typeof takeLeft>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof takeLeft<string, number>>().returns.toMatchTypeOf<StringParser>()
    expectTypeOf<typeof takeLeft<number, string>>().returns.toMatchTypeOf<NumberParser>()
  })

  it('takeRight should have correct inferred signature', () => {
    expectTypeOf<typeof takeRight>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof takeRight<string, number>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof takeRight<number, string>>().returns.toMatchTypeOf<StringParser>()
  })

  it('takeMid should have correct inferred signature', () => {
    expectTypeOf<typeof takeMid>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof takeMid<string, number, string>>().returns.toMatchTypeOf<NumberParser>()
    expectTypeOf<typeof takeMid<number, string, number>>().returns.toMatchTypeOf<StringParser>()
  })

  it('takeSides should have correct inferred signature', () => {
    expectTypeOf<typeof takeSides>().returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf<typeof takeSides<string, number, string>>().returns.toMatchTypeOf<
      Parser<[string, string]>
    >()
    expectTypeOf<typeof takeSides<number, string, number>>().returns.toMatchTypeOf<
      Parser<[number, number]>
    >()
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
