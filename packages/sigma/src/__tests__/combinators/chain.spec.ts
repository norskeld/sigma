import { chainl, chainr, map, takeRight } from '@combinators'
import { regexp, string } from '@parsers'
import { describe, it, result, run, should } from '@testing'

const toSum = (left: number, right: number) => left + right
const toNumber = (value: string) => parseInt(value, 10)

const number = map(regexp(/\d+/g, 'integer'), toNumber)

describe('chainl', () => {
  const parser = chainl(number, takeRight(string(' + '), number), toSum)

  it('should succeed with eliminated left recursion and reduced to a value', () => {
    const actual = run(parser, '2 + 2 + 4')
    const expected = result(true, 8)

    should.matchState(actual, expected)
  })

  it('should fail with expectation of the regexp parser', () => {
    const actual = run(parser, 'x + x + 4')
    const expected = result(false, 'integer')

    should.matchState(actual, expected)
  })
})

describe('chainr', () => {
  const toPower = (left: number, _: string, right: number) => left ** right
  const parser = chainr(number, string(' ^ '), toPower)

  it('should succeed and reduce right-associatively', () => {
    const actual = run(parser, '2 ^ 3 ^ 2')
    const expected = result(true, 512)

    should.matchState(actual, expected)
  })

  it('should succeed with a single operand', () => {
    const actual = run(parser, '2')
    const expected = result(true, 2)

    should.matchState(actual, expected)
  })

  it('should fail with expectation of the regexp parser', () => {
    const actual = run(parser, 'x ^ 2')
    const expected = result(false, 'integer')

    should.matchState(actual, expected)
  })
})
