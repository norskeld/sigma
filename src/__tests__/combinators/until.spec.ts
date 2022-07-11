import { map } from '../../combinators/map'
import { takeUntil } from '../../combinators/until'
import { any } from '../../parsers/any'
import { regexp } from '../../parsers/regexp'
import { string } from '../../parsers/string'
import { run, result, should, describe, testFailure } from '../@helpers'

describe('takeUntil', (it) => {
  it('should succeed with a tuple of values if given a correct string', () => {
    const parser = map(takeUntil(any(), string('*/')), (result) => result.flat().join(''))
    const actual = run(parser, '/* Comment */')
    const expected = result(true, '/* Comment */')

    should.matchState(actual, expected)
  })

  it('should fail if source parser fails', () => {
    testFailure('one.', takeUntil(regexp(/\p{Nd}/g, 'decimal digit'), string('.')))
  })
})
