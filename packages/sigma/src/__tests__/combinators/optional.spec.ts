import { optional, sequence } from '@combinators'
import { string } from '@parsers'
import { run, result, should, describe, it } from '@testing'

describe('optional', () => {
  it('should succeed with the where optional non-matched value replaced with null', () => {
    const parser = sequence(string('Hello'), optional(string('...')))
    const actual = run(parser, 'Hello')
    const expected = result(true, ['Hello', null])

    should.matchState(actual, expected)
  })

  it('should succeed with null anyway', () => {
    const parser = optional(string('left'))
    const actual = run(parser, 'between')
    const expected = result(true, null)

    should.matchState(actual, expected)
  })
})
