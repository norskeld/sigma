import { hex, binary, octal, whole, integer, float } from '../../parsers/numbers'
import { describe, testFailure, testSuccess } from '../@helpers'

describe('hex', (it) => {
  it('should succeed if given a hexadecimal number', () => {
    const tcases = [
      ['0x1F', 31],
      ['0X1F', 31],
      ['0x1f', 31],
      ['0X1f', 31]
    ] as const

    tcases.forEach(([tcase, tresult]) => testSuccess(tcase, tresult, hex()))
  })

  it('should fail if given a non-hexadecimal number', () => {
    const tcases = ['', 'zero', '0', '-42', '0o42', '0b10', '0x', '0xXB']
    tcases.forEach((tcase) => testFailure(tcase, hex()))
  })
})

describe('binary', (it) => {
  it('should succeed if given a binary number', () => {
    const tcases = [
      ['0b10', 2],
      ['0B10', 2]
    ] as const

    tcases.forEach(([tcase, tresult]) => testSuccess(tcase, tresult, binary()))
  })

  it('should fail if given a non-binary number', () => {
    const tcases = ['', 'zero', '0', '-42', '0o42', '0b', '0xXB', '0bff']
    tcases.forEach((tcase) => testFailure(tcase, binary()))
  })
})

describe('octal', (it) => {
  it('should succeed if given an octal number', () => {
    const tcases = [
      ['0o42', 34],
      ['0O42', 34]
    ] as const

    tcases.forEach(([tcase, tresult]) => testSuccess(tcase, tresult, octal()))
  })

  it('should fail if given a non-octal number', () => {
    const tcases = ['', 'zero', '0', '-42', '0x42', '0b11', '0o', '0off']
    tcases.forEach((tcase) => testFailure(tcase, octal()))
  })
})

describe('whole', (it) => {
  it('should succeed if given a whole number', () => {
    const tcases = ['0', '1', '42', '1000']
    tcases.forEach((tcase) => testSuccess(tcase, parseInt(tcase, 10), whole()))
  })

  it('should fail if given a non-whole number', () => {
    const tcases = ['', 'zero', '-0', '-42']
    tcases.forEach((tcase) => testFailure(tcase, whole()))
  })
})

describe('integer', (it) => {
  it('should succeed if given an integer number', () => {
    const tcases = ['0', '1', '-1', '42', '-42']
    tcases.forEach((tcase) => testSuccess(tcase, parseInt(tcase, 10), integer()))
  })

  it('should fail if given a non-integer number', () => {
    const tcases = ['', 'zero']
    tcases.forEach((tcase) => testFailure(tcase, integer()))
  })
})

describe('float', (it) => {
  it('should succeed if given an float number', () => {
    const tcases = ['0.25', '4.20', '-42.0']
    tcases.forEach((tcase) => testSuccess(tcase, parseFloat(tcase), float()))
  })

  it('should fail if given a non-float number', () => {
    const tcases = ['', 'zero', '0xFF', '0b10', '0o42']
    tcases.forEach((tcase) => testFailure(tcase, float()))
  })
})
