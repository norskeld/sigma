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

    it('should succeed if configured to accept optionally unsigned floats (sign = some)', () => {
      const cases = [
        [float({ sign: 'some' }), '+420.55', result('success', 420.55)],
        [float({ sign: 'some' }), '-420.55', result('success', -420.55)],
        [float({ sign: 'some' }), '420.55', result('success', 420.55)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept signed integers (sign = any)', () => {
      const cases = [
        [float({ sign: 'any' }), '+420.55', result('success', 420.55)],
        [float({ sign: 'any' }), '-420.55', result('success', -420.55)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to not accept signed integers (sign = none)', () => {
      const cases = [
        [float({ sign: 'none' }), '420.55', result('success', 420.55)],
        [float({ sign: 'none' }), '0.42', result('success', 0.42)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept positively signed integers (sign = positive)', () => {
      const cases = [
        [float({ sign: 'positive' }), '+420.55', result('success', 420.55)],
        [float({ sign: 'positive' }), '+0.42', result('success', 0.42)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })

    it('should succeed if configured to accept negatively signed integers (sign = positive)', () => {
      const cases = [
        [float({ sign: 'negative' }), '-420.55', result('success', -420.55)],
        [float({ sign: 'negative' }), '-0.42', result('success', -0.42)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    })
  })

  describe(`failed cases`, () => {
    function withTestCases(value: string) {
      const message = 'float'

      const cases = [
        [error(float(), message), `${value}`, result('failure', message)],
        [error(float({ sign: 'some' }), message), `+${value}`, result('failure', message)],
        [error(float({ sign: 'some' }), message), `-${value}`, result('failure', message)],
        [error(float({ sign: 'some' }), message), `${value}`, result('failure', message)],
        [error(float({ sign: 'any' }), message), `-${value}`, result('failure', message)],
        [error(float({ sign: 'any' }), message), `+${value}`, result('failure', message)],
        [error(float({ sign: 'none' }), message), `${value}`, result('failure', message)],
        [error(float({ sign: 'positive' }), message), `+${value}`, result('failure', message)],
        [error(float({ sign: 'negative' }), message), `-${value}`, result('failure', message)]
      ] as const

      cases.forEach(([parser, input, expected]) => {
        should.matchState(run(parser, input), expected)
      })
    }

    it(`should fail if given an integer`, () => {
      withTestCases('0')
      withTestCases('42')
    })

    it(`should fail if given an exponential`, () => {
      withTestCases('0e-5')
      withTestCases('2e+3')
      withTestCases('1e3')
    })

    it(`should fail if given a binary`, () => {
      withTestCases('0b100')
    })

    it(`should fail if given an octal`, () => {
      withTestCases('0o644')
    })

    it(`should fail if given a hexadecimal`, () => {
      withTestCases('0xd3ad')
      withTestCases('0xf00d')
    })
  })
})
