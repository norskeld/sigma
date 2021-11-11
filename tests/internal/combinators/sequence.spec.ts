import { sequence, string } from '@lib/combinators'
import * as exposed from '@lib/combinators'

import { run, result, shouldExpose, shouldMatchState } from '@tests/@setup/jest.helpers'

describe('internal/combinators/sequence', () => {
  it(`exposes 'sequence' w/ 'seq' alias`, () => {
    shouldExpose(exposed, 'sequence', 'seq')
  })

  describe(sequence, () => {
    it(`should result in success if a sequence of parsers succeeds`, () => {
      const parser = sequence(string('hello'), string(' '), string('world'))
      const actual = run(parser, 'hello world')
      const expected = result('success', ['hello', ' ', 'world'])

      shouldMatchState(actual, expected)
    })

    it(`should result in failure if a sequence of parsers fails somewhere`, () => {
      const parser = sequence(string('hello'), string(' '), string('world'))
      const actual = run(parser, 'bye friend')
      const expected = result('failure', 'hello')

      shouldMatchState(actual, expected)
    })
  })
})
