import { int, uint } from '@lib/parsers/integer'

import { testSuccess, testFailure } from '@tests/@helpers'

describe(int, () => {
  it('should succeed if given a signed integer', () => {
    const tcases = [
      ['0', 0],
      ['2', 2],
      ['20', 20],
      ['-2', -2],
      ['-20', -20]
    ] as const

    tcases.forEach(([input, value]) => {
      testSuccess(input, value, int)
    })
  })

  it('should succeed with hexadecimal value if radix = 16', () => {
    testSuccess('100', 256, () => int(16))
  })

  it('should succeed with octal value if radix = 8', () => {
    testSuccess('100', 64, () => int(8))
  })

  it('should fail if given something else', () => {
    ;['string', '-+', ' '].forEach((tcase) => {
      testFailure(tcase, int)
    })
  })
})

describe(uint, () => {
  it('should succeed if given an unsigned integer', () => {
    const tcases = [
      ['0', 0],
      ['2', 2],
      ['20', 20]
    ] as const

    tcases.forEach(([input, value]) => {
      testSuccess(input, value, uint)
    })
  })

  it('should succeed with hexadecimal value if radix = 16', () => {
    testSuccess('100', 256, () => uint(16))
  })

  it('should succeed with octal value if radix = 8', () => {
    testSuccess('100', 64, () => uint(8))
  })

  it('should fail if given a signed integer', () => {
    ;['-20', '-2'].forEach((tcase) => {
      testFailure(tcase, uint)
    })
  })

  it('should fail if given something else', () => {
    ;['string', '-+', ' '].forEach((tcase) => {
      testFailure(tcase, uint)
    })
  })
})
