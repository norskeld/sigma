import { letter, letters } from '@lib/internal/parsers/letter'

import { run, result, should } from '@tests/@helpers'

describe(letter, () => {
  it('should succeed with an ASCII letter', () => {
    const actual = run(letter(), 'A')
    const expected = result('success', 'A')

    should.matchState(actual, expected)
  })

  it('should succeed with a Unicode letter', () => {
    const actual = run(letter(), 'Â')
    const expected = result('success', 'Â')

    should.matchState(actual, expected)
  })

  it('should fail if given something other than a letter', () => {
    ;['1', '+', '~', '`', ':', `'`].forEach((tcase) => {
      const actual = run(letter(), tcase)
      const expected = result('failure', 'letter')

      should.matchState(actual, expected)
    })
  })
})

describe(letters, () => {
  it('should succeed with an ASCII letter if given input with a single ASCII letter', () => {
    const actual = run(letters(), 'A')
    const expected = result('success', 'A')

    should.matchState(actual, expected)
  })

  it('should succeed with a Unicode letter if given input with a single Unicode letter', () => {
    const actual = run(letters(), 'Â')
    const expected = result('success', 'Â')

    should.matchState(actual, expected)
  })

  it('should succeed with letters if given input with letters', () => {
    const actual = run(letters(), 'Âne')
    const expected = result('success', 'Âne')

    should.matchState(actual, expected)
  })

  it('should succeed with letters if given input with letters and other symbols', () => {
    const actual = run(letters(), 'Âne+9000')
    const expected = result('success', 'Âne')

    should.matchState(actual, expected)
  })

  it('should fail if given something other than letters', () => {
    const actual = run(letters(), '9000+Âne')
    const expected = result('failure', 'letters')

    should.matchState(actual, expected)
  })
})
