import { string, ustring } from '@parsers/string'
import { run, result, should, describe, it } from '@test'

describe('ustring', () => {
  it('should succeed if given an ASCII string', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), tcase)
    const expected = result(true, tcase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a Unicode string', () => {
    ;['语言处理', 'Hëllø!', 'Family :: 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦 👨‍👩‍👧‍👦'].forEach((tcase) => {
      const actual = run(ustring(tcase), tcase)
      const expected = result(true, tcase)

      should.matchState(actual, expected)
    })
  })

  it('should succeed if given a repetitive input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), tcase.repeat(2))
    const expected = result(true, tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), 'wrong')
    const expected = result(false, tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tcase = 'test'

    const actual = run(ustring(tcase), '')
    const expected = result(false, tcase)

    should.matchState(actual, expected)
  })
})

describe('string', () => {
  it('should succeed if given an ASCII string', () => {
    const tcase = 'test'

    const actual = run(string(tcase), tcase)
    const expected = result(true, tcase)

    should.matchState(actual, expected)
  })

  it('should succeed if given a repetitive input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), tcase.repeat(2))
    const expected = result(true, tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a non-matching input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), 'wrong')
    const expected = result(false, tcase)

    should.matchState(actual, expected)
  })

  it('should fail if given a zero-length input', () => {
    const tcase = 'test'

    const actual = run(string(tcase), '')
    const expected = result(false, tcase)

    should.matchState(actual, expected)
  })
})
