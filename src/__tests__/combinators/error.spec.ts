import { error } from '#combinators'
import { string } from '#parsers'
import { run, result, should, describe, it } from '#testing'

describe('error', () => {
  it('should successfully replace error message (expectation)', () => {
    const parser = error(string('9000'), 'replaced-error-message')
    const actual = run(parser, 'xxxx')
    const expected = result(false, 'replaced-error-message')

    should.matchState(actual, expected)
  })

  it('should not do anything if a parser succeeds', () => {
    const parser = error(string('9000'), 'replaced-error-message')
    const actual = run(parser, '9000')
    const expected = result(true, '9000')

    should.matchState(actual, expected)
  })
})
