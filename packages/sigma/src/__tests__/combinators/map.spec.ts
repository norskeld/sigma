import { map, mapTo } from '@combinators'
import { string } from '@parsers'
import { describe, result, run, should, it } from '@testing'

describe('map', () => {
  it('should succeed if a single given parser succeeds', () => {
    const parser = map(string('9000'), (value) => parseInt(value, 10))
    const actual = run(parser, '9000')
    const expected = result(true, 9000)

    should.matchState(actual, expected)
  })

  it('should fail if a single given parser fails', () => {
    const parser = map(string('9000'), (value) => parseInt(value, 10))
    const actual = run(parser, 'xxxx')
    const expected = result(false, '9000')

    should.matchState(actual, expected)
  })
})

describe('mapTo', () => {
  it('should succeed if a single given parser succeeds', () => {
    const parser = mapTo(string('9000'), 'constant')
    const actual = run(parser, '9000')
    const expected = result(true, 'constant')

    should.matchState(actual, expected)
  })
})
