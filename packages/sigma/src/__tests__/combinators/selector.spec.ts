import { first, inner, last, outer } from '@combinators'
import { string } from '@parsers'
import { describe, it, parseAt, result, run, should } from '@testing'

describe('first', () => {
  it('should succeed with the value of the first parser', () => {
    const parser = first(string('left'), string('mid'))
    const actual = run(parser, 'leftmid')
    const expected = result(true, 'left')

    should.matchState(actual, expected)
  })

  it('should succeed with the value of the first parser given more than two parsers', () => {
    const parser = first(string('l'), string('m'), string('r'))
    const actual = run(parser, 'lmr')
    const expected = result(true, 'l')

    should.matchState(actual, expected)
  })

  it('should succeed with the span covering the whole sequence', () => {
    const actual = parseAt(first(string('l'), string('m'), string('r')), 'lmr', 0)
    should.matchResult(actual, { isOk: true, start: 0, end: 3, pos: 3, value: 'l' })
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = first(string('left'), string('mid'))
    const actual = run(parser, 'left mid')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail when the first parser fails', () => {
    const parser = first(string('left'), string('mid'))
    should.matchState(run(parser, 'xleftmid'), result(false, 'left'))
  })

  it('should fail and roll back when the last parser fails given more than two parsers', () => {
    const parser = first(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'lmx'), result(false, 'r'))
  })
})

describe('inner', () => {
  it('should succeed with the value of the parser in the middle', () => {
    const parser = inner(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, 'mid')

    should.matchState(actual, expected)
  })

  it('should succeed with a tuple of values in between given more than three parsers', () => {
    const parser = inner(string('l'), string('m1'), string('m2'), string('r'))
    const actual = run(parser, 'lm1m2r')
    const expected = result(true, ['m1', 'm2'])

    should.matchState(actual, expected)
  })

  it('should succeed with the span covering the whole sequence', () => {
    const actual = parseAt(inner(string('l'), string('m'), string('r')), 'lmr', 0)
    should.matchResult(actual, { isOk: true, start: 0, end: 3, pos: 3, value: 'm' })
  })

  it('should fail at the position of the failed parser', () => {
    const actual = parseAt(inner(string('l'), string('m'), string('r')), 'l-r', 0)
    should.matchResult(actual, { isOk: false, start: 1, end: 2, pos: 1, expected: 'm' })
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = inner(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'left midright')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail and roll back when the third parser fails', () => {
    const parser = inner(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'lmx'), result(false, 'r'))
  })

  it('should fail and roll back when the last parser fails given more than three parsers', () => {
    const parser = inner(string('l'), string('m1'), string('m2'), string('r'))
    should.matchState(run(parser, 'lm1m2x'), result(false, 'r'))
  })

  it('should fail when the first parser fails', () => {
    const parser = inner(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'xmr'), result(false, 'l'))
  })
})

describe('last', () => {
  it('should succeed with the value of the last parser', () => {
    const parser = last(string('mid'), string('right'))
    const actual = run(parser, 'midright')
    const expected = result(true, 'right')

    should.matchState(actual, expected)
  })

  it('should succeed with the value of the last parser given more than two parsers', () => {
    const parser = last(string('l'), string('m'), string('r'))
    const actual = run(parser, 'lmr')
    const expected = result(true, 'r')

    should.matchState(actual, expected)
  })

  it('should succeed with the span covering the whole sequence', () => {
    const actual = parseAt(last(string('l'), string('m'), string('r')), 'lmr', 0)
    should.matchResult(actual, { isOk: true, start: 0, end: 3, pos: 3, value: 'r' })
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = last(string('mid'), string('right'))
    const actual = run(parser, 'mid right')
    const expected = result(false, 'right')

    should.matchState(actual, expected)
  })

  it('should fail when the first parser fails', () => {
    const parser = last(string('mid'), string('right'))
    should.matchState(run(parser, 'xmidright'), result(false, 'mid'))
  })

  it('should fail and roll back when the last parser fails given more than two parsers', () => {
    const parser = last(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'lmx'), result(false, 'r'))
  })
})

describe('outer', () => {
  it('should succeed with the tuple of the first and the last values', () => {
    const parser = outer(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, ['left', 'right'])

    should.matchState(actual, expected)
  })

  it('should succeed with the first and the last values given more than three parsers', () => {
    const parser = outer(string('l'), string('m1'), string('m2'), string('r'))
    const actual = run(parser, 'lm1m2r')
    const expected = result(true, ['l', 'r'])

    should.matchState(actual, expected)
  })

  it('should succeed with the span covering the whole sequence', () => {
    const actual = parseAt(outer(string('l'), string('m'), string('r')), 'lmr', 0)
    should.matchResult(actual, { isOk: true, start: 0, end: 3, pos: 3, value: ['l', 'r'] })
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = outer(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'left midright')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail and roll back when the third parser fails', () => {
    const parser = outer(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'lmx'), result(false, 'r'))
  })

  it('should fail and roll back when the last parser fails given more than three parsers', () => {
    const parser = outer(string('l'), string('m1'), string('m2'), string('r'))
    should.matchState(run(parser, 'lm1m2x'), result(false, 'r'))
  })

  it('should fail when the first parser fails', () => {
    const parser = outer(string('l'), string('m'), string('r'))
    should.matchState(run(parser, 'xmr'), result(false, 'l'))
  })
})
