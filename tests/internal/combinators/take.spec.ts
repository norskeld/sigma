import { takeLeft, takeMid, takeRight } from '@lib/internal/combinators/take'
import { string } from '@lib/internal/parsers/string'

import { run, result, should } from '@tests/@helpers'

// TODO: Add failing cases.
describe(takeLeft, () => {
  it('should succeed with the value of the left parser ', () => {
    const parser = takeLeft(string('left'), string('mid'))
    const actual = run(parser, 'leftmid')
    const expected = result('success', 'left')

    should.matchState(actual, expected)
  })
})

// TODO: Add failing cases.
describe(takeMid, () => {
  it('should succeed with the value of the middle parser', () => {
    const parser = takeMid(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result('success', 'mid')

    should.matchState(actual, expected)
  })
})

// TODO: Add failing cases.
describe(takeRight, () => {
  it('should succeed with the value of the middle parser', () => {
    const parser = takeRight(string('mid'), string('right'))
    const actual = run(parser, 'midright')
    const expected = result('success', 'right')

    should.matchState(actual, expected)
  })
})
