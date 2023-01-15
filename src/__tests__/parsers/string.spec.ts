import { string, ustring } from '@parsers'
import { run, result, should, describe, it } from '@testing'

describe('ustring', () => {
  it('should succeed if given an ASCII string', () => {
    const tCase = 'test'

    const actual = run(ustring(tCase), tCase)
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a Unicode string', () => {
    ;['语言处理', 'Hëllø!', 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦'].forEach((tCase) => {
      const actual = run(ustring(tCase), tCase)
      const expected = result(true, tCase)

      should.matchState(actual, expected)
    })
  })

  it('should succeed if given a repetitive input', () => {
    const tCase = 'test'

    const actual = run(ustring(tCase), tCase.repeat(2))
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tCase = 'test'

    const actual = run(ustring(tCase), 'wrong')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tCase = 'test'

    const actual = run(ustring(tCase), '')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })
})

describe('string', () => {
  it('should succeed if given an ASCII string', () => {
    const tCase = 'test'

    const actual = run(string(tCase), tCase)
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a repetitive input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), tCase.repeat(2))
    const expected = result(true, tCase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), 'wrong')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tCase = 'test'

    const actual = run(string(tCase), '')
    const expected = result(false, tCase)

    should.matchState(actual, expected)
  })
})
