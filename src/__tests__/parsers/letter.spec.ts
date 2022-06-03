import { letter, letters } from '../../parsers/letter'
import { describe, result, run, should } from '../@helpers'

describe('letter', (it) => {
  it('should succeed with an ASCII letter', () => {
    const actual = run(letter(), 'A')
    const expected = result(true, 'A')

    should.matchState(actual, expected)
  })

  it('should succeed with a Unicode letter', () => {
    const actual = run(letter(), 'Â')
    const expected = result(true, 'Â')

    should.matchState(actual, expected)
  })

  it('should succeed with a single letter if given multiple letters', () => {
    const actual = run(letter(), 'ab')
    const expected = result(true, 'a')

    should.matchState(actual, expected)
  })

  it('should fail if given something other than a letter', () => {
    ;['1', '+', '~', '`', ':', `'`].forEach((tcase) => {
      const actual = run(letter(), tcase)
      const expected = result(false, 'letter')

      should.matchState(actual, expected)
    })
  })
})

describe('letters', (it) => {
  it('should succeed with an ASCII letter if given input with a single ASCII letter', () => {
    const actual = run(letters(), 'A')
    const expected = result(true, 'A')

    should.matchState(actual, expected)
  })

  it('should succeed with a Unicode letter if given input with a single Unicode letter', () => {
    const actual = run(letters(), 'Â')
    const expected = result(true, 'Â')

    should.matchState(actual, expected)
  })

  it('should succeed with letters if given input with letters', () => {
    const actual = run(letters(), 'Âne')
    const expected = result(true, 'Âne')

    should.matchState(actual, expected)
  })

  it('should succeed with letters if given input with letters and other symbols', () => {
    const actual = run(letters(), 'Âne+9000')
    const expected = result(true, 'Âne')

    should.matchState(actual, expected)
  })

  it('should fail if given something other than letters', () => {
    const actual = run(letters(), '9000+Âne')
    const expected = result(false, 'letters')

    should.matchState(actual, expected)
  })
})
