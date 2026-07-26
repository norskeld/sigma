import {
  chainl,
  chainr,
  choice,
  commit,
  count,
  error,
  filter,
  first,
  inner,
  last,
  lookahead,
  many,
  many1,
  map,
  mapTo,
  not,
  optional,
  outer,
  recover,
  sepBy,
  sepBy1,
  sequence,
  skipUntil,
  syncPast,
  takeUntil,
  when,
} from '@combinators'
import { any, rest, string } from '@parsers'
import { describe, it, run, should } from '@testing'
import type { Parser } from '@types'
import { ParseContext } from '@types'

/** Fails while committed at position 1, so every wrapper has already consumed something. */
const committed = commit(string('b'), 'committed')

/** Each wrapper embeds `committed` so that a committed failure must escape it. */
const wrappers: Array<[string, Parser<unknown>, string]> = [
  ['choice', choice(sequence(string('a'), committed), string('az')), 'az'],
  ['many', many(sequence(string('a'), committed)), 'az'],
  ['many1', many1(sequence(string('a'), committed)), 'az'],
  ['sepBy', sepBy(sequence(string('a'), committed), string(',')), 'az'],
  ['sepBy1', sepBy1(sequence(string('a'), committed), string(',')), 'az'],
  ['chainl', chainl(sequence(string('a'), committed), string(','), (l) => l), 'az'],
  ['chainr', chainr(sequence(string('a'), committed), string(','), (l) => l), 'az'],
  ['optional', optional(sequence(string('a'), committed)), 'az'],
  ['not', not(sequence(string('a'), committed)), 'az'],
  ['lookahead', lookahead(sequence(string('a'), committed)), 'az'],
  ['takeUntil', takeUntil(sequence(string('a'), committed), string('!')), 'az'],
  ['skipUntil', skipUntil(sequence(string('a'), committed), string('!')), 'az'],
  ['count', count(sequence(string('a'), committed), 2), 'az'],
  ['sequence', sequence(string('a'), committed), 'az'],
  ['first', first(string('a'), committed), 'az'],
  ['last', last(string('a'), committed), 'az'],
  ['inner', inner(string('a'), committed, string('!')), 'az'],
  ['outer', outer(string('a'), committed, string('!')), 'az'],
  ['when', when(string('a'), () => committed), 'az'],
  ['filter', filter(sequence(string('a'), committed), () => true, 'anything'), 'az'],
  ['map', map(sequence(string('a'), committed), (value) => value), 'az'],
  ['mapTo', mapTo(sequence(string('a'), committed), 'mapped'), 'az'],
  ['error', error(sequence(string('a'), committed), 'relabelled'), 'az'],
]

describe('committed failures are never swallowed', () => {
  for (const [name, parser, input] of wrappers) {
    it(`${name} should propagate a committed failure`, () => {
      const actual = run(parser, input)

      should.beEqual(actual.isOk, false, `${name} swallowed the commit`)
      should.beEqual(!actual.isOk ? actual.expected : null, 'b')
      should.beEqual(!actual.isOk ? actual.label : null, 'committed')

      // The span must still describe the commit, not the wrapper that let it through.
      should.beStrictEqual(
        actual.isOk ? null : { start: actual.start, end: actual.end, pos: actual.pos },
        { start: 1, end: 2, pos: 1 },
        `${name} corrupted the span`,
      )
    })
  }
})

describe('uncommitted failures keep their existing behaviour', () => {
  const plain = sequence(string('a'), string('b'))

  it('many should stop cleanly', () => {
    should.matchResult(run(many(plain), 'abaz'), {
      isOk: true,
      start: 0,
      end: 2,
      pos: 2,
      value: [['a', 'b']],
    })
  })

  it('optional should fall back to null', () => {
    should.matchResult(run(optional(plain), 'az'), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('choice should keep trying alternatives', () => {
    should.matchResult(run(choice(plain, string('az')), 'az'), {
      isOk: true,
      start: 0,
      end: 2,
      pos: 2,
      value: 'az',
    })
  })

  it('not should succeed when the inner parser fails', () => {
    should.matchResult(run(not(plain), 'az'), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: null,
    })
  })

  it('sepBy should return an empty list', () => {
    should.matchResult(run(sepBy(plain, string(',')), 'zz'), {
      isOk: true,
      start: 0,
      end: 0,
      pos: 0,
      value: [],
    })
  })
})

describe('committed failures from the driving parser', () => {
  // Committing inside the separator, operator or terminator takes a different path out of the loop.
  const cases: Array<[string, Parser<unknown>, string]> = [
    ['sepBy separator', sepBy(string('a'), commit(string(','), 'committed')), 'a;'],
    ['sepBy1 separator', sepBy1(string('a'), commit(string(','), 'committed')), 'a;'],
    ['chainl operator', chainl(string('a'), commit(string('+'), 'committed'), (l) => l), 'a-'],
    ['chainr operator', chainr(string('a'), commit(string('+'), 'committed'), (l) => l), 'a-'],
    ['takeUntil terminator', takeUntil(any(), commit(string('!'), 'committed')), 'ab'],
    ['skipUntil terminator', skipUntil(any(), commit(string('!'), 'committed')), 'ab'],
  ]

  for (const [name, parser, input] of cases) {
    it(`${name} should propagate a committed failure`, () => {
      const actual = run(parser, input)

      should.beEqual(actual.isOk, false, `${name} swallowed the commit`)
      should.beEqual(!actual.isOk ? actual.label : null, 'committed')
    })
  }

  it('many1 should propagate a commit from a later iteration', () => {
    const actual = run(many1(sequence(string('a'), committed)), 'abaz')

    should.beEqual(actual.isOk, false)
    should.beEqual(!actual.isOk ? actual.label : null, 'committed')
  })

  it('many should propagate a commit from a later iteration', () => {
    const actual = run(many(sequence(string('a'), committed)), 'abaz')

    should.beEqual(actual.isOk, false)
    should.beEqual(!actual.isOk ? actual.label : null, 'committed')
  })

  it('choice should propagate a commit from a later alternative', () => {
    // The third alternative would match, so it must never be reached.
    const parser = choice(string('zz'), sequence(string('a'), committed), string('az'))
    const actual = run(parser, 'az')

    should.beEqual(actual.isOk, false)
    should.beEqual(!actual.isOk ? actual.label : null, 'committed')
  })

  it('count should propagate a commit from a later iteration', () => {
    const actual = run(count(sequence(string('a'), string('b')), 2), 'abac')

    should.beEqual(actual.isOk, false)

    const parser = count(choice(sequence(string('a'), committed), string('ab')), 2)
    const committedActual = run(parser, 'abac')

    should.beEqual(committedActual.isOk, false)
    should.beEqual(!committedActual.isOk ? committedActual.label : null, 'committed')
  })
})

describe('discarded regions take their recoveries with them', () => {
  /** Recovers part-way in and then fails, so the recovery must go with the rejected attempt. */
  const attempted = sequence(
    string('x'),
    recover(commit(string('y'), 'why'), syncPast(string(';'))),
    string('!'),
  )

  /** Succeeds by recovering, so a rejection downstream has something to discard. */
  const recovered = recover(commit(string('y'), 'why'), syncPast(string(';')), () => 'stand-in')

  const cases: Array<[string, Parser<unknown>, string]> = [
    ['choice', choice(attempted, rest()), 'xz;q'],
    ['many', many(attempted), 'xy!xz;q'],
    ['many1', many1(attempted), 'xy!xz;q'],
    ['sepBy value', sepBy(attempted, string(',')), 'xy!,xz;q'],
    ['sepBy1 value', sepBy1(attempted, string(',')), 'xy!,xz;q'],
    ['sepBy first value', sepBy(attempted, string(',')), 'xz;q'],
    ['sepBy separator', sepBy(string('a'), attempted), 'axz;q'],
    ['chainl value', chainl(attempted, string(','), (l) => l), 'xy!,xz;q'],
    ['chainr value', chainr(attempted, string(','), (l) => l), 'xy!,xz;q'],
    ['chainl operator', chainl(string('a'), attempted, (l) => l), 'axz;q'],
    ['optional', optional(attempted), 'xz;q'],
    ['not', not(attempted), 'xz;q'],
    ['takeUntil terminator', takeUntil(string('a'), attempted), 'axz;q'],
    ['skipUntil terminator', skipUntil(string('a'), attempted), 'axz;q'],
    ['filter', filter(recovered, () => false, 'nope'), 'z;q'],
  ]

  for (const [name, parser, input] of cases) {
    it(`${name} should discard what the rejected attempt recovered`, () => {
      should.matchErrors(run(parser, input), [])
    })
  }
})

describe('position invariant', () => {
  /** Position the parser left behind, so the "FAIL restores pos" invariant can be asserted. */
  function positionAfter(parser: Parser<unknown>, input: string, from = 0): number {
    const ctx = new ParseContext(input)
    ctx.pos = from
    parser.parse(ctx)

    return ctx.pos
  }

  const loops: Array<[string, Parser<unknown>, string]> = [
    ['many', many(sequence(string('a'), committed)), 'aab'],
    ['many1', many1(sequence(string('a'), committed)), 'aab'],
    ['sepBy', sepBy(sequence(string('a'), committed), string(',')), 'ab,ab,az'],
    ['sepBy1', sepBy1(sequence(string('a'), committed), string(',')), 'ab,ab,az'],
    ['chainl', chainl(sequence(string('a'), committed), string(','), (l) => l), 'ab,az'],
    ['chainr', chainr(sequence(string('a'), committed), string(','), (l) => l), 'ab,az'],
    ['count', count(sequence(string('a'), committed), 2), 'abaz'],
    ['takeUntil', takeUntil(sequence(string('a'), committed), string('!')), 'abaz'],
    ['skipUntil', skipUntil(sequence(string('a'), committed), string('!')), 'abaz'],
  ]

  for (const [name, parser, input] of loops) {
    it(`${name} should restore pos when a committed failure propagates`, () => {
      should.beEqual(positionAfter(parser, input, 0), 0, `${name} left pos advanced`)
    })
  }

  it('any-based loops still terminate at end of input', () => {
    should.matchResult(run(many(any()), 'ab'), {
      isOk: true,
      start: 0,
      end: 2,
      pos: 2,
      value: ['a', 'b'],
    })
  })
})
