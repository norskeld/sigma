import { grammar } from '@core'
import { choice, commit, map, optional, recover, sequence, string, syncPast } from '@lib'
import { describe, it, result, run, should } from '@testing'

describe('grammar', () => {
  it('should create self-contained grammar', () => {
    const ab = grammar({
      a() {
        return map(sequence(string('a'), optional(this.b)), ([a, b]) => a + (b ?? ''))
      },
      b() {
        return map(sequence(string('b'), choice(this.a, this.b)), ([b, a]) => b + a)
      },
    })

    const value = 'abba'

    const actual = run(ab.a, value)
    const expected = result(true, value)

    should.matchState(actual, expected)
  })

  it('should support commit and recover through `this`', () => {
    // Only `parse` is copied onto the grammar object, so these must be plain closures.
    const lang = grammar({
      item() {
        return recover(this.pair, syncPast(string(';')), () => 'bad')
      },
      pair() {
        return map(sequence(string('a'), commit(string('b'), 'pair')), ([a, b]) => a + b)
      },
    })

    should.matchState(run(lang.item, 'ab'), result(true, 'ab'))
    should.matchState(run(lang.item, 'az;'), result(true, 'bad'))
  })
})
