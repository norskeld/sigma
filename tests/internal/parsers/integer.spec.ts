import { integer, integerUnsigned } from '@lib/internal/parsers/integer'

import { testSuccess, testFailure } from '@tests/@helpers'

describe(integer, () => {
  it('should succeed if given a signed integer', () => {
    const tcases = [
      ['0', 0],
      ['2', 2],
      ['20', 20],
      ['-2', -2],
      ['-20', -20]
    ] as const

    tcases.forEach(([input, value]) => {
      testSuccess(input, value, integer)
    })
  })

  it('should succeed with hexadecimal value if radix = 16', () => {
    testSuccess('100', 256, () => integer(16))
  })

  it('should succeed with octal value if radix = 8', () => {
    testSuccess('100', 64, () => integer(8))
  })

  it('should fail if given something else', () => {
    ;['string', '-+', ' '].forEach((tcase) => {
      testFailure(tcase, integer)
    })
  })
})

describe(integerUnsigned, () => {
  it('should succeed if given an unsigned integer', () => {
    const tcases = [
      ['0', 0],
      ['2', 2],
      ['20', 20]
    ] as const

    tcases.forEach(([input, value]) => {
      testSuccess(input, value, integerUnsigned)
    })
  })

  it('should succeed with hexadecimal value if radix = 16', () => {
    testSuccess('100', 256, () => integerUnsigned(16))
  })

  it('should succeed with octal value if radix = 8', () => {
    testSuccess('100', 64, () => integerUnsigned(8))
  })

  it('should fail if given a signed integer', () => {
    ;['-20', '-2'].forEach((tcase) => {
      testFailure(tcase, integerUnsigned)
    })
  })

  it('should fail if given something else', () => {
    ;['string', '-+', ' '].forEach((tcase) => {
      testFailure(tcase, integerUnsigned)
    })
  })
})
