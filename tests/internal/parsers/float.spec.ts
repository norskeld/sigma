import { error } from '@lib/internal/combinators/error'
import { float } from '@lib/internal/parsers/float'

import { result, run, should } from '@tests/@helpers'

describe(float, () => {
  describe('successful cases', () => {
    it('should succeed if given a float', () => {
      const actual = run(float(), '420.55')
      const expected = result('success', 420.55)

      should.matchState(actual, expected)
    })

    it('should succeed if configured to accept optionally signed floats (sign = maybe)', () => {
      const cases = [
        [float({ sign: 'maybe' }), '-420.55', result('success', -420.55)],
        [float({ sign: 'maybe' }), '420.55', result('success', 420.55)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept only signed floats (sign = always)', () => {
      const cases = [
        [float({ sign: 'always' }), '-0.55', result('success', -0.55)],
        [float({ sign: 'always' }), '-420.55', result('success', -420.55)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept only unsigned floats (sign = never)', () => {
      const cases = [
        [float({ sign: 'never' }), '420.55', result('success', 420.55)],
        [float({ sign: 'never' }), '0.55', result('success', 0.55)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })
  })

  describe('failed cases', () => {
    function withTestCases(value: string) {
      const message = 'float'

      const cases = [
        [error(float(), message), `${value}`, result('failure', message)],

        [error(float({ sign: 'maybe' }), message), `-${value}`, result('failure', message)],
        [error(float({ sign: 'maybe' }), message), `${value}`, result('failure', message)],

        [error(float({ sign: 'always' }), message), `-${value}`, result('failure', message)],
        [error(float({ sign: 'always' }), message), `-${value}`, result('failure', message)],

        [error(float({ sign: 'never' }), message), `${value}`, result('failure', message)],
        [error(float({ sign: 'never' }), message), `${value}`, result('failure', message)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    }

    it('should fail if configured to accept only signed floats and given an unsigned float', () => {
      const message = 'signed float'

      const actual = run(error(float({ sign: 'always' }), message), '420.55')
      const expected = result('failure', message)

      should.matchState(actual, expected)
    })

    it('should fail if configured to accept only unsigned floats and given a signed float', () => {
      const message = 'unsigned float'

      const actual = run(error(float({ sign: 'never' }), message), '-420.55')
      const expected = result('failure', message)

      should.matchState(actual, expected)
    })

    it('should fail if given an integer', () => {
      withTestCases('0')
      withTestCases('42')
    })

    it('should fail if given an exponential', () => {
      withTestCases('0e-5')
      withTestCases('2e+3')
      withTestCases('1e3')
    })

    it('should fail if given a binary', () => {
      withTestCases('0b100')
    })

    it('should fail if given an octal', () => {
      withTestCases('0o644')
    })

    it('should fail if given a hexadecimal', () => {
      withTestCases('0xd3ad')
      withTestCases('0xf00d')
    })
  })
})
