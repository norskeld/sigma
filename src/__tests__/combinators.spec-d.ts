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
    expectTypeOf(attempt<string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(attempt).returns.toMatchTypeOf<UnknownParser>()
  })
})

describe('chain', () => {
  const { chainl } = c

  it('chainl should have correct inferred signature', () => {
    expectTypeOf(chainl).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(chainl<string, string, string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(chainl<number, number, string>).returns.toMatchTypeOf<NumberParser>()
  })
})

describe.todo('choice', () => {
  const { choice } = c

  it('choice should have correct inferred signature', () => {
    // expectTypeOf(choice<string[]>).returns.toMatchTypeOf<
    //  StringParser
    // >()
    // expectTypeOf(choice<number, number, string>).returns.toMatchTypeOf<
    //   NumberParser
    // >()
  })
})

describe('error', () => {
  const { error } = c

  it('error should have correct inferred signature', () => {
    expectTypeOf(error).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(error<string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(error<number>).returns.toMatchTypeOf<NumberParser>()

    expectTypeOf(error<number | string>).returns.toMatchTypeOf<StringOrNumberParser>()
  })
})

describe('lookahead', () => {
  const { lookahead } = c

  it('lookahead should have correct inferred signature', () => {
    expectTypeOf(lookahead).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(lookahead<string>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(lookahead<number>).returns.toMatchTypeOf<NumberParser>()

    expectTypeOf(lookahead<number | string>).returns.toMatchTypeOf<StringOrNumberParser>()
  })
})

describe('many', () => {
  const { many, many1 } = c

  it('many should have correct inferred signature', () => {
    expectTypeOf(many).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(many<string>).returns.toMatchTypeOf<SucceedingParser<string[]>>()
    expectTypeOf(many<number>).returns.toMatchTypeOf<SucceedingParser<number[]>>()
  })

  it('many1 should have correct inferred signature', () => {
    expectTypeOf(many1).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(many1<string>).returns.toMatchTypeOf<StringParsers>()
    expectTypeOf(many1<number>).returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('map', () => {
  const { map } = c

  it('map should have correct inferred signature', () => {
    expectTypeOf(map).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(map<string, number>).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(map<string, string>).returns.toMatchTypeOf<StringParser>()
  })
})

describe('optional', () => {
  const { optional } = c

  it('optional should have correct inferred signature', () => {
    expectTypeOf(optional).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(optional<string>).returns.toMatchTypeOf<Parser<string | null>>()
    expectTypeOf(optional<number>).returns.toMatchTypeOf<Parser<number | null>>()
  })
})

describe('sepBy', () => {
  const { sepBy, sepBy1 } = c

  it('sepBy should have correct inferred signature', () => {
    expectTypeOf(sepBy).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(sepBy<string, number>).returns.toMatchTypeOf<StringParsers>()
    expectTypeOf(sepBy<number, string>).returns.toMatchTypeOf<NumberParsers>()
  })

  it('sepBy1 should have correct inferred signature', () => {
    expectTypeOf(sepBy1).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(sepBy1<string, number>).returns.toMatchTypeOf<StringParsers>()
    expectTypeOf(sepBy1<number, string>).returns.toMatchTypeOf<NumberParsers>()
  })
})

describe('sequence', () => {
  const { sequence } = c

  it('sequence should have correct inferred signature', () => {
    expectTypeOf(sequence<[StringParser, StringParser]>).returns.toMatchTypeOf<
      Parser<[string, string]>
    >()
    expectTypeOf(sequence<[StringParser, NumberParser]>).returns.toMatchTypeOf<
      Parser<[string, number]>
    >()
    expectTypeOf(sequence<StringParser[]>).returns.toMatchTypeOf<StringParsers>()
    expectTypeOf(sequence<NumberParser[]>).returns.toMatchTypeOf<NumberParsers>()

    // Fix this ?
    expectTypeOf(sequence<(NumberParser | StringParser)[]>).returns.toMatchTypeOf<
      Parser<string[] | number[]>
    >()
  })
})

describe('take', () => {
  const { takeLeft, takeMid, takeRight, takeSides } = c

  it('takeLeft should have correct inferred signature', () => {
    expectTypeOf(takeLeft).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(takeLeft<string, number>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(takeLeft<number, string>).returns.toMatchTypeOf<NumberParser>()
  })

  it('takeRight should have correct inferred signature', () => {
    expectTypeOf(takeRight).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(takeRight<string, number>).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(takeRight<number, string>).returns.toMatchTypeOf<StringParser>()
  })

  it('takeMid should have correct inferred signature', () => {
    expectTypeOf(takeMid).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(takeMid<string, number, string>).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(takeMid<number, string, number>).returns.toMatchTypeOf<StringParser>()
  })

  it('takeSides should have correct inferred signature', () => {
    expectTypeOf(takeSides).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(takeSides<string, number, string>).returns.toMatchTypeOf<
      Parser<[string, string]>
    >()
    expectTypeOf(takeSides<number, string, number>).returns.toMatchTypeOf<
      Parser<[number, number]>
    >()
  })
})

describe('until', () => {
  const { takeUntil, skipUntil } = c

  it('takeUntil should have correct inferred signature', () => {
    expectTypeOf(takeUntil).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(takeUntil<string, number>).returns.toMatchTypeOf<Parser<[string[], number]>>()
    expectTypeOf(takeUntil<number, string>).returns.toMatchTypeOf<Parser<[number[], string]>>()
  })

  it('skipUntil should have correct inferred signature', () => {
    expectTypeOf(skipUntil).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(skipUntil<string, number>).returns.toMatchTypeOf<NumberParser>()
    expectTypeOf(skipUntil<number, string>).returns.toMatchTypeOf<StringParser>()
  })
})

describe('when', () => {
  const { when } = c

  it('when should have correct inferred signature', () => {
    expectTypeOf(when).returns.toMatchTypeOf<UnknownParser>()

    expectTypeOf(when<number, StringParser>).returns.toMatchTypeOf<StringParser>()
    expectTypeOf(when<number, NumberParser>).returns.toMatchTypeOf<NumberParser>()
  })
})
