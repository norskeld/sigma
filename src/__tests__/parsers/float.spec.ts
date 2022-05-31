import { suite } from 'uvu'

import { float } from '../../parsers/float'

import { testFailure, testSuccess } from '../@helpers'

const it = suite('float')

it('should succeed if given a float', () => {
  const tcases = [
    ['20.99', 20.99],
    ['-20.99', -20.99]
  ] as const

  tcases.forEach(([input, value]) => {
    testSuccess(input, value, float())
  })
})

it('should fail if given an integer', () => {
  ;['20', '2', '-20', '-2'].forEach((tcase) => {
    testFailure(tcase, float())
  })
})

it('should fail if given a float without a leading zero', () => {
  testFailure('.99', float())
})

it('should fail if given an octal', () => {
  testFailure('0o644', float())
})

it('should fail if given a binary', () => {
  testFailure('0b100', float())
})

it('should fail if given a hexadecimal', () => {
  testFailure('0xf00d', float())
})

it('should fail if given an exponential', () => {
  ;['0e-5', '2e+3', '1e3'].forEach((tcase) => {
    testFailure(tcase, float())
  })
})

it.run()
