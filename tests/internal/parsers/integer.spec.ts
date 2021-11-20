import { error } from '@lib/internal/combinators/error'
import { integer } from '@lib/internal/parsers/integer'

import { result, run, should } from '@tests/@helpers'

describe(`integer (sign = ...) (success)`, () => {
  it(`should succeed if given an unsigned integer number`, () => {
    const actual = run(integer(), '42')
    const expected = result('success', 42)

    const actualSingle = run(integer(), '0')
    const expectedSingle = result('success', 0)

    should.matchState(actual, expected)
    should.matchState(actualSingle, expectedSingle)
  })

  it(`should succeed if configured to accept optionally unsigned integers (sign = some)`, () => {
    const cases = [
      [integer({ sign: 'some' }), '+42', result('success', 42)],
      [integer({ sign: 'some' }), '-42', result('success', -42)],
      [integer({ sign: 'some' }), '42', result('success', 42)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  })

  it(`should succeed if configured to accept signed integers (sign = any)`, () => {
    const cases = [
      [integer({ sign: 'any' }), '+42', result('success', 42)],
      [integer({ sign: 'any' }), '-42', result('success', -42)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  })

  it(`should succeed if configured to not accept signed integers (sign = none)`, () => {
    const cases = [
      [integer({ sign: 'none' }), '42', result('success', 42)],
      [integer({ sign: 'none' }), '8912493', result('success', 8912493)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  })

  it(`should succeed if configured to accept positively signed integers (sign = positive)`, () => {
    const cases = [
      [integer({ sign: 'positive' }), '+42', result('success', 42)],
      [integer({ sign: 'positive' }), '+8912493', result('success', 8912493)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  })

  it(`should succeed if configured to accept negatively signed integers (sign = positive)`, () => {
    const cases = [
      [integer({ sign: 'negative' }), '-42', result('success', -42)],
      [integer({ sign: 'negative' }), '-8912493', result('success', -8912493)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  })
})

describe(`integer (radix = ...) (success)`, () => {
  it(`should succeed with hexadecimal value if configured to use radix = 16`, () => {
    const actual = run(integer({ radix: 16 }), '100')
    const expected = result('success', 256)

    should.matchState(actual, expected)
  })

  it(`should succeed with hexadecimal value if configured to use radix = 8`, () => {
    const actual = run(integer({ radix: 8 }), '100')
    const expected = result('success', 64)

    should.matchState(actual, expected)
  })

  it(`should succeed with hexadecimal value if configured to use radix = 2`, () => {
    const actual = run(integer({ radix: 2 }), '100')
    const expected = result('success', 4)

    should.matchState(actual, expected)
  })
})

describe(`integer (failure)`, () => {
  function withTestCases(value: string) {
    const message = 'integer'

    const cases = [
      [error(integer(), message), `${value}`, result('failure', message)],
      [error(integer({ sign: 'some' }), message), `+${value}`, result('failure', message)],
      [error(integer({ sign: 'some' }), message), `-${value}`, result('failure', message)],
      [error(integer({ sign: 'some' }), message), `${value}`, result('failure', message)],
      [error(integer({ sign: 'any' }), message), `-${value}`, result('failure', message)],
      [error(integer({ sign: 'any' }), message), `+${value}`, result('failure', message)],
      [error(integer({ sign: 'none' }), message), `${value}`, result('failure', message)],
      [error(integer({ sign: 'positive' }), message), `+${value}`, result('failure', message)],
      [error(integer({ sign: 'negative' }), message), `-${value}`, result('failure', message)]
    ] as const

    cases.forEach(([parser, input, expected]) => {
      should.matchState(run(parser, input), expected)
    })
  }

  it(`should fail if given a float`, () => {
    withTestCases('42.00')
    withTestCases('0.42')
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
