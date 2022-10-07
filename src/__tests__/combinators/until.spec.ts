import { map, takeUntil, skipUntil } from '#combinators'
import { any, regexp, string } from '#parsers'
import { run, result, should, describe, testFailure, it } from '#testing'

describe('takeUntil', () => {
  it('should succeed with a tuple of values if given a correct string', () => {
    const parser = map(takeUntil(any(), string('*/')), (result) => result.flat().join(''))
    const actual = run(parser, '/* Comment */')
    const expected = result(true, '/* Comment */')

    should.matchState(actual, expected)
  })

  it('should fail if source parser fails', () => {
    testFailure('one.', takeUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.')))
  })
})

describe('skipUntil', () => {
  it('should succeed with a result of terminating parser if given a correct string', () => {
    const parser = skipUntil(any(), string('*/'))
    const actual = run(parser, '/* Comment */')
    const expected = result(true, '*/')

    should.matchState(actual, expected)
  })

  it('should fail if source parser fails', () => {
    testFailure('one.', skipUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.')))
  })
})
