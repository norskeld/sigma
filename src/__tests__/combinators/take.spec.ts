import { suite } from 'uvu'

import { takeLeft, takeMid, takeRight, takeSides } from '../../combinators/take'
import { string } from '../../parsers/string'

import { result, run, should } from '../@helpers'

// TODO: Add failing cases.
let it = suite('takeLeft')

it('should succeed with the value of the parser on the left-hand side', () => {
  const parser = takeLeft(string('left'), string('mid'))
  const actual = run(parser, 'leftmid')
  const expected = result(true, 'left')

  should.matchState(actual, expected)
})

it.run()

// TODO: Add failing cases.
it = suite('takeMid')

it('should succeed with the value of the parser in the middle', () => {
  const parser = takeMid(string('left'), string('mid'), string('right'))
  const actual = run(parser, 'leftmidright')
  const expected = result(true, 'mid')

  should.matchState(actual, expected)
})

it.run()

// TODO: Add failing cases.
it = suite('takeRight')

it('should succeed with the value of the parser on right-hand side', () => {
  const parser = takeRight(string('mid'), string('right'))
  const actual = run(parser, 'midright')
  const expected = result(true, 'right')

  should.matchState(actual, expected)
})

it.run()

// TODO: Add failing cases.
it = suite('takeSides')

it('should succeed with the tuple of the first and the last values', () => {
  const parser = takeSides(string('left'), string('mid'), string('right'))
  const actual = run(parser, 'leftmidright')
  const expected = result(true, ['left', 'right'])

  should.matchState(actual, expected)
})

it.run()
