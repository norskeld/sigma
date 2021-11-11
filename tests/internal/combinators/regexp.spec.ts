import * as exposed from '@lib/internal/combinators/regexp'
import { regexp } from '@lib/internal/combinators/regexp'
import { run, result } from '@tests/@setup/jest.helpers'

describe('internal/combinators/regexp', () => {
  it(`exposes 'regexp' w/ 're' alias`, () => {
    expect(exposed).toHaveProperty('regexp')
    expect(exposed).toHaveProperty('re')
  })

  describe(exposed.regexp, () => {
    it(`should result in success if matches the input`, () => {
      expect(run(regexp(/\d/g, 'digit'), '9')).toHaveState(result('success', '9'))
      expect(run(regexp(/\d+/g, 'digits'), '9000')).toHaveState(result('success', '9000'))
      expect(run(regexp(/\((\s)+\)/g, 'whitespaces between parens'), '( )')).toHaveState(
        result('success', '( )')
      )
    })

    it(`should result in success if matches the beginning of the input`, () => {
      expect(run(regexp(/\d{2,3}/g, 'digits'), '90000')).toHaveState(result('success', '900'))
      expect(run(regexp(/\w+/g, 'word'), 'hello')).toHaveState(result('success', 'hello'))
    })

    it(`should result in failure if doesn't match the input`, () => {
      expect(run(regexp(/\d/g, 'digit'), 'hello')).toHaveState(result('failure', 'digit'))
      expect(run(regexp(/(spec|test)/g, 'either'), 'spock')).toHaveState(
        result('failure', 'either')
      )
    })

    it(`should result in failure if given zero input and regexp with 'one or more' quantifier`, () => {
      expect(run(regexp(/\d+/g, 'digits+'), '')).toHaveState(result('failure', 'digits+'))
    })

    // TODO: Though this is kinda contrintuitive, so maybe should throw/fail?
    it(`should result in success if given zero input and regexp with 'zero or more' quantifier`, () => {
      expect(run(regexp(/\d*/g, 'digits*'), '')).toHaveState(result('success', ''))
    })
  })
})
