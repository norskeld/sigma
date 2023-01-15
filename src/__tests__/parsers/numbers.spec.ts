import { hex, binary, octal, whole, integer, float } from '@parsers'
import { describe, testFailure, testSuccess, it } from '@testing'

describe('hex', () => {
  it('should succeed if given a hexadecimal number', () => {
    const tCases = [
      ['0x1F', 31],
      ['0X1F', 31],
      ['0x1f', 31],
      ['0X1f', 31]
    ] as const

    tCases.forEach(([tCase, tResult]) => testSuccess(tCase, tResult, hex()))
  })

  it('should fail if given a non-hexadecimal number', () => {
    const tCases = ['', 'zero', '0', '-42', '0o42', '0b10', '0x', '0xXB']
    tCases.forEach((tCase) => testFailure(tCase, hex()))
  })
})

describe('binary', () => {
  it('should succeed if given a binary number', () => {
    const tCases = [
      ['0b10', 2],
      ['0B10', 2]
    ] as const

    tCases.forEach(([tCase, tResult]) => testSuccess(tCase, tResult, binary()))
  })

  it('should fail if given a non-binary number', () => {
    const tCases = ['', 'zero', '0', '-42', '0o42', '0b', '0xXB', '0bff']
    tCases.forEach((tCase) => testFailure(tCase, binary()))
  })
})

describe('octal', () => {
  it('should succeed if given an octal number', () => {
    const tCases = [
      ['0o42', 34],
      ['0O42', 34]
    ] as const

    tCases.forEach(([tCase, tResult]) => testSuccess(tCase, tResult, octal()))
  })

  it('should fail if given a non-octal number', () => {
    const tCases = ['', 'zero', '0', '-42', '0x42', '0b11', '0o', '0off']
    tCases.forEach((tCase) => testFailure(tCase, octal()))
  })
})

describe('whole', () => {
  it('should succeed if given a whole number', () => {
    const tCases = ['0', '1', '42', '1000']
    tCases.forEach((tCase) => testSuccess(tCase, parseInt(tCase, 10), whole()))
  })

  it('should fail if given a non-whole number', () => {
    const tCases = ['', 'zero', '-0', '-42']
    tCases.forEach((tCase) => testFailure(tCase, whole()))
  })
})

describe('integer', () => {
  it('should succeed if given an integer number', () => {
    const tCases = ['0', '1', '-1', '42', '-42']
    tCases.forEach((tCase) => testSuccess(tCase, parseInt(tCase, 10), integer()))
  })

  it('should fail if given a non-integer number', () => {
    const tCases = ['', 'zero']
    tCases.forEach((tCase) => testFailure(tCase, integer()))
  })
})

describe('float', () => {
  it('should succeed if given an float number', () => {
    const tCases = ['0.25', '4.20', '-42.0']
    tCases.forEach((tCase) => testSuccess(tCase, parseFloat(tCase), float()))
  })

  it('should fail if given a non-float number', () => {
    const tCases = ['', 'zero', '0xFF', '0b10', '0o42']
    tCases.forEach((tCase) => testFailure(tCase, float()))
  })
})
