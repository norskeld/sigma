import { choice, sequence } from '@combinators'
import { string } from '@parsers'
import { describe, it, parseAt, result, run, should } from '@testing'

describe('choice', () => {
  it('should succeed with the value of the first successful parser in sequence', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'mid')
    const expected = result(true, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of the first parser if all fail equally', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'between')
    const expected = result(false, 'left')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of the parser that progressed furthest', () => {
    const parser = choice(sequence(string('be'), string('xx')), string('mid'))
    const actual = run(parser, 'between')
    const expected = result(false, 'xx')

    should.matchState(actual, expected)
  })

  it('should keep the full failure of the alternative that progressed furthest', () => {
    const parser = choice(sequence(string('a'), string('b')), string('c'))
    const actual = parseAt(parser, 'ax', 0)
    should.beStrictEqual(actual, { isOk: false, start: 1, end: 2, pos: 1, expected: 'b' })
  })
})
