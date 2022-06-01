import { suite } from 'uvu'

import { when } from '../../combinators/when'
import { string } from '../../parsers'
import { run, result, should } from '../@helpers'

const parser = when(string('x'), () => string('y'))

const it = suite('when')

it('should succeed with the value of chained parser', () => {
  const actual = run(parser, 'xy')
  const expected = result(true, 'y')

  should.matchState(actual, expected)
})

it('should fail with the expectation of context parser', () => {
  const actual = run(parser, 'ab')
  const expected = result(false, 'x')

  should.matchState(actual, expected)
})

it('should fail with the expectation of chained parser', () => {
  const actual = run(parser, 'xw')
  const expected = result(false, 'y')

  should.matchState(actual, expected)
})

it.run()
