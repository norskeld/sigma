import { suite } from 'uvu'

import { nothing } from '../../parsers/nothing'

import { result, run, should } from '../@helpers'

const it = suite('nothing')

it('should succeed with null value', () => {
  const actual = run(nothing(), 'test')
  const expected = result(true, null)

  should.matchState(actual, expected)
})

it.run()
