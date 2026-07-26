import { commit, first, lookahead, recover, sequence, syncPast } from '@combinators'
import { string, whitespace } from '@parsers'
import { describe, it, run, should } from '@testing'

describe('lookahead', () => {
  const parser = sequence(
    first(string('hello'), whitespace()),
    lookahead(string('let')),
    string('lettuce'),
  )

  it('should successfully lookahead and return pos untouched', () => {
    const actual = run(parser, 'hello lettuce')

    should.matchResult(actual, {
      isOk: true,
      start: 0,
      end: 13,
      pos: 13,
      value: ['hello', 'let', 'lettuce'],
    })
  })

  it('should correctly fail if placed before a failing parser (OOB check)', () => {
    const actual = run(parser, 'hello let')

    should.matchResult(actual, {
      isOk: false,
      start: 6,
      end: 9,
      pos: 6,
      expected: 'lettuce',
    })
  })

  it('should correctly fail if given a failing parser (non-consuming check)', () => {
    const actual = run(parser, 'hello const')

    should.matchResult(actual, {
      isOk: false,
      start: 6,
      end: 9,
      pos: 6,
      expected: 'let',
    })
  })

  it('should return failure as is with the deepest pos', () => {
    const actual = run(lookahead(sequence(string('hello'), string(' world'))), 'hello there')

    should.matchResult(actual, {
      isOk: false,
      start: 5,
      end: 11,
      pos: 5,
      expected: ' world',
    })
  })

  it('should not report a recovery made inside it twice', () => {
    // The region is parsed for real right after, so only the second pass may record anything.
    const region = recover(commit(string('a'), 'x'), syncPast(string(';')), () => 'bad')
    const actual = run(sequence(lookahead(region), region), 'z;')

    should.matchErrors(actual, ['a'])
  })
})
