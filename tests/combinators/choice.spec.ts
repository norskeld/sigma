import { choice } from '@lib/combinators/choice'
import { string } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(choice, () => {
  it('should succeed with the value of the first successful parser in sequence', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'mid')
    const expected = result('success', 'mid')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of the first parser in sequence', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'between')
    const expected = result('failure', 'left')

    should.matchState(actual, expected)
  })
})
