import { error } from '@lib/internal/combinators/error'
import { integer } from '@lib/internal/parsers/integer'

import { result, run, should } from '@tests/@helpers'

describe(integer, () => {
  describe('sign = ... (success)', () => {
    it('should succeed if given an unsigned integer number', () => {
      const actual = run(integer(), '42')
      const expected = result('success', 42)

      const actualSingle = run(integer(), '0')
      const expectedSingle = result('success', 0)

      should.matchState(actual, expected)
      should.matchState(actualSingle, expectedSingle)
    })

    it('should succeed if configured to accept optionally unsigned integers (sign = maybe)', () => {
      const cases = [
        [integer({ sign: 'maybe' }), '-42', result('success', -42)],
        [integer({ sign: 'maybe' }), '42', result('success', 42)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept signed integers (sign = always)', () => {
      const cases = [
        [integer({ sign: 'always' }), '-8', result('success', -8)],
        [integer({ sign: 'always' }), '-42', result('success', -42)],
        [integer({ sign: 'always' }), '-9000', result('success', -9000)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to not accept signed integers (sign = never)', () => {
      const cases = [
        [integer({ sign: 'never' }), '42', result('success', 42)],
        [integer({ sign: 'never' }), '8912493', result('success', 8912493)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })
  })

  describe('radix = ... (success)', () => {
    it('should succeed with hexadecimal value if configured to use radix = 16', () => {
      const actual = run(integer({ radix: 16 }), '100')
      const expected = result('success', 256)

      should.matchState(actual, expected)
    })

    it('should succeed with hexadecimal value if configured to use radix = 8', () => {
      const actual = run(integer({ radix: 8 }), '100')
      const expected = result('success', 64)

      should.matchState(actual, expected)
    })

    it('should succeed with hexadecimal value if configured to use radix = 2', () => {
      const actual = run(integer({ radix: 2 }), '100')
      const expected = result('success', 4)

      should.matchState(actual, expected)
    })
  })

  describe('failed cases', () => {
    it('should fail if configured to accept only signed integers and given an unsigned integer', () => {
      const message = 'signed integer'

      const actual = run(error(integer({ sign: 'always' }), message), '420')
      const expected = result('failure', message)

      should.matchState(actual, expected)
    })

    it('should fail if configured to accept only unsigned integers and given a signed integer', () => {
      const message = 'unsigned integer'

      const actual = run(error(integer({ sign: 'never' }), message), '-420')
      const expected = result('failure', message)

      should.matchState(actual, expected)
    })
  })
})
