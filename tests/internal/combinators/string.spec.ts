import * as exposed from '@lib/combinators'
import { string, uniString } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/string', () => {
  it(`should expose 'string' ('str') and 'uniString' ('ustr')`, () => {
    should.expose(exposed, 'string', 'str', 'uniString', 'ustr')
  })

  describe(uniString, () => {
    it(`should succeed if matches the input`, () => {
      const actualAscii = run(uniString('test'), 'test')
      const expectedAscii = result('success', 'test')

      const actualUniChinese = run(uniString('语言处理'), '语言处理')
      const expectedUniChinese = result('success', '语言处理')

      const actualUniUmlauts = run(uniString('Hëllø!'), 'Hëllø!')
      const expectedUniUmlauts = result('success', 'Hëllø!')

      const actualUniEmojis = run(uniString('Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦'), 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦')
      const expectedUniEmojis = result('success', 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦')

      should.matchState(actualAscii, expectedAscii)
      should.matchState(actualUniChinese, expectedUniChinese)
      should.matchState(actualUniUmlauts, expectedUniUmlauts)
      should.matchState(actualUniEmojis, expectedUniEmojis)
    })
  })

  describe(string, () => {
    it(`should succeed if matches the input`, () => {
      const actual = run(string('test'), 'test')
      const expected = result('success', 'test')

      should.matchState(actual, expected)
    })

    it(`should succeed if given repetitive input`, () => {
      const actual = run(string('test'), 'testtest')
      const expected = result('success', 'test')

      should.matchState(actual, expected)
    })

    it(`should fail if doesn't match the input`, () => {
      const actual = run(string('test'), 'wrong')
      const expected = result('failure', 'test')

      should.matchState(actual, expected)
    })

    it(`should fail if given zero input`, () => {
      const actual = run(string('test'), '')
      const expected = result('failure', 'test')

      should.matchState(actual, expected)
    })
  })
})
