import { suite } from 'uvu'

import { sequence } from '../../combinators/sequence'
import { string } from '../../parsers/string'
import { run, result, should } from '../@helpers'

const it = suite('sequence')

it('should succeed if a sequence of parsers succeeds', () => {
  const parser = sequence(string('hello'), string(' '), string('world'))
  const actual = run(parser, 'hello world')
  const expected = result(true, ['hello', ' ', 'world'])

  should.matchState(actual, expected)
})

it('should fail if a sequence of parsers fails somewhere', () => {
  const parser = sequence(string('hello'), string(' '), string('world'))
  const actual = run(parser, 'bye friend')
  const expected = result(false, 'hello')

  should.matchState(actual, expected)
})

it.run()
