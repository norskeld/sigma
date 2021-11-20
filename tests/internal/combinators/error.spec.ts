import { error } from '@lib/internal/combinators/error'
import { string } from '@lib/internal/parsers/string'

import { run, result, should } from '@tests/@helpers'

describe(error, () => {
  it('should successfully replace error message (expectation)', () => {
    const parser = error(string('9000'), 'replaced-error-message')
    const actual = run(parser, 'xxxx')
    const expected = result('failure', 'replaced-error-message')

    should.matchState(actual, expected)
  })

  it('should not do anything if a parser succeeds', () => {
    const parser = error(string('9000'), 'replaced-error-message')
    const actual = run(parser, '9000')
    const expected = result('success', '9000')

    should.matchState(actual, expected)
  })
})
