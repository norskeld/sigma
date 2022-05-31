import { suite } from 'uvu'

import { optional } from '../../combinators/optional'
import { sequence } from '../../combinators/sequence'
import { string } from '../../parsers/string'
import { run, result, should } from '../@helpers'

const it = suite('optional')

it('should succeed with the where optional non-matched value replaced with null', () => {
  // TODO: This seems to be broken somehow? Because `optional` eats everything after 'Hello'...
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

it.run()
