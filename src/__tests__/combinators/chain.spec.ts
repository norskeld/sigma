import { suite } from 'uvu'

import { takeRight } from '../../combinators/take'
import { chainl } from '../../combinators/chain'
import { regexp } from '../../parsers/regexp'
import { string } from '../../parsers/string'
import { map } from '../../combinators/map'

import { run, result, should } from '../@helpers'

const toSum = (left: number, right: number) => left + right
const toNumber = (value: string) => parseInt(value, 10)

const number = map(regexp(/\d+/g, 'integer'), toNumber)
const parser = chainl(number, takeRight(string(' + '), number), toSum)

const it = suite('chain')

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

it.run()
