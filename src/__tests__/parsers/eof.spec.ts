import { suite } from 'uvu'

import { sequence } from '../../combinators/sequence'
import { eof } from '../../parsers/eof'
import { string } from '../../parsers/string'
import { run, result, should } from '../@helpers'

const it = suite('eof')

it('should succeed if reached the end of input', () => {
  const parser = sequence(string('start'), eof())
  const actual = run(parser, 'start')
  const expected = result(true, ['start', null])

  should.matchState(actual, expected)
})

it('should fail if did not reach the end of input', () => {
  const parser = sequence(string('start'), eof())
  const actual = run(parser, 'start end')
  const expected = result(false, 'end of input')

  should.matchState(actual, expected)
})

it.run()
