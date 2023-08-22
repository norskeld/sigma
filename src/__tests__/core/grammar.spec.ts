import { grammar } from '@core'
import { choice, map, optional, sequence, string } from '@lib'
import { describe, should, it, run, result } from '@testing'

describe('grammar', () => {
  it('should create self-contained grammar', () => {
    const ab = grammar({
      a() {
        return map(sequence(string('a'), optional(this.b)), ([a, b]) => a + (b ?? ''))
      },
      b() {
        return map(sequence(string('b'), choice(this.a, this.b)), ([b, a]) => b + a)
      }
    })

    const value = 'abba'

    const actual = run(ab.a, value)
    const expected = result(true, value)

    should.matchState(actual, expected)
  })
})
