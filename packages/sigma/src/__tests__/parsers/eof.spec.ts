import { sequence } from '@combinators'
import { eof, string } from '@parsers'
import { run, result, should, describe, it } from '@testing'

describe('eof', () => {
  it('should succeed if reached the end of input', () => {
    const parser = sequence(string('start'), eof())
    const actual = run(parser, 'start')
    const expected = result(true, ['start', null])

    should.matchState(actual, expected)
  })

  it('should fail if did not reach the end of input', () => {
    const parser = sequence(string('start'), eof())
    const actual = run(parser, 'start end')
    const expected = result(false, 'end of input')

    should.matchState(actual, expected)
  })
})
