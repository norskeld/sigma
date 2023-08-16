import { grammar, run } from '@core'
import { Parser, Success, choice, map, optional, sequence, string } from '@lib'
import { describe, should, it } from '@testing'

describe(`grammar`, () => {
  it('should create self-contained grammar', () => {
    const ab = grammar({
      a(): Parser<string> {
        return map(sequence(string('a'), optional(this.b)), ([a, b]) => a + (b || ''))
      },
      b(): Parser<string> {
        return map(sequence(string('b'), choice(this.a, this.b)), ([b, a]) => b + a)
      }
    })

    const value = 'abba'

    const actual = run(ab.a).with(value)

    const expected: Success<string> = { isOk: true, value, span: [0, 4], pos: 4 }

    should.beStrictEqual(actual, expected)
  })
})
