import { choice } from '@combinators/choice'
import { string } from '@parsers/string'
import { run, result, should, describe, it } from '@test'

describe('choice', () => {
  it('should succeed with the value of the first successful parser in sequence', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'mid')
    const expected = result(true, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail with the expectation of the last parser in sequence', () => {
    const parser = choice(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'between')
    const expected = result(false, 'right')

    should.matchState(actual, expected)
  })
})
