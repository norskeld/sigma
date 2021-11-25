import { sequence } from '@lib/internal/combinators/sequence'
import { string } from '@lib/internal/parsers/string'
import { rest } from '@lib/internal/parsers/rest'

import { result, run, should } from '@tests/@helpers'

describe(rest, () => {
  it('should succeed with the rest of input', () => {
    const parser = sequence(string('start'), rest())
    const actual = run(parser, 'startend')
    const expected = result('success', ['start', 'end'])

    should.matchState(actual, expected)
  })

  it('should succeed with empty string if no input left to consume', () => {
    const parser = sequence(string('start'), rest())
    const actual = run(parser, 'start')
    const expected = result('success', ['start', ''])

    should.matchState(actual, expected)
  })
})
