import { sequence } from '@lib/internal/combinators/sequence'
import { string } from '@lib/internal/parsers/string'
import { eof } from '@lib/internal/parsers/eof'

import { result, run, should } from '@tests/@helpers'

describe(eof, () => {
  it('should succeed if reached the end of input', () => {
    const parser = sequence(string('start'), eof())
    const actual = run(parser, 'start')
    const expected = result('success', ['start', null])

    should.matchState(actual, expected)
  })

  it('should fail if did not reach the end of input', () => {
    const parser = sequence(string('start'), eof())
    const actual = run(parser, 'start end')
    const expected = result('failure', 'end of input')

    should.matchState(actual, expected)
  })
})
