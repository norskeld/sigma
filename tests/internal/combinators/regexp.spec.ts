import * as exposed from '@lib/combinators'
import { regexp } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/regexp', () => {
  it(`should expose 'regexp' w/ 're' alias`, () => {
    should.expose(exposed, 'regexp', 're')
  })

  describe(regexp, () => {
    it(`should succeed if matches the input`, () => {
      const actualDigit = run(regexp(/\d/g, 'digit'), '0')
      const expectedDigit = result('success', '0')

      const actualDigits = run(regexp(/\d+/g, 'digits'), '9000')
      const expectedDigits = result('success', '9000')

      const actualMatchGroups = run(regexp(/\((\s)+\)/g, 'match-groups'), '( )')
      const expectedMatchGroups = result('success', '( )')

      should.matchState(actualDigit, expectedDigit)
      should.matchState(actualDigits, expectedDigits)
      should.matchState(actualMatchGroups, expectedMatchGroups)
    })

    it(`should succeeed if matches the beginning of the input`, () => {
      const actualDigits = run(regexp(/\d{2,3}/g, 'first-digits'), '90000')
      const expectedDigits = result('success', '900')

      should.matchState(actualDigits, expectedDigits)
    })

    it(`should fail if doesn't match the input`, () => {
      const actualDigitFailure = run(regexp(/\d/g, 'digit'), 'hello')
      const expectedDigitFailure = result('failure', 'digit')

      const actualEitherFailure = run(regexp(/(spec|test)/g, 'either'), 'spock')
      const expectedEitherFailure = result('failure', 'either')

      should.matchState(actualDigitFailure, expectedDigitFailure)
      should.matchState(actualEitherFailure, expectedEitherFailure)
    })

    it(`should fail if given zero input and regexp with 'one or more' quantifier`, () => {
      const actualZeroFailure = run(regexp(/\d+/g, 'digits+'), '')
      const expectedZeroFailure = result('failure', 'digits+')

      should.matchState(actualZeroFailure, expectedZeroFailure)
    })

    // TODO: Though this is kinda contrintuitive, so maybe should throw/fail?
    it(`should succeed if given zero input and regexp with 'zero or more' quantifier`, () => {
      const actualZeroSuccess = run(regexp(/\d*/g, 'digits*'), '')
      const expectedZeroSuccess = result('success', '')

      should.matchState(actualZeroSuccess, expectedZeroSuccess)
    })
  })
})
