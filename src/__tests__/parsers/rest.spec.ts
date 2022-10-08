import { sequence } from '@combinators'
import { rest, string } from '@parsers'
import { describe, result, run, should, it } from '@testing'

describe('rest', () => {
  it('should succeed with the rest of input', () => {
    const parser = sequence(string('start'), rest())
    const actual = run(parser, 'startend')
    const expected = result(true, ['start', 'end'])

    should.matchState(actual, expected)
  })

  it('should succeed with empty string if no input left to consume', () => {
    const parser = sequence(string('start'), rest())
    const actual = run(parser, 'start')
    const expected = result(true, ['start', ''])

    should.matchState(actual, expected)
  })
})
