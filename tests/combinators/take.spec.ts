import { takeLeft, takeMid, takeRight, takeSides } from '@lib/combinators/take'
import { string } from '@lib/parsers/string'

import { run, result, should } from '@tests/@helpers'

// TODO: Add failing cases.
describe(takeLeft, () => {
  it('should succeed with the value of the parser on the left-hand side', () => {
    const parser = takeLeft(string('left'), string('mid'))
    const actual = run(parser, 'leftmid')
    const expected = result(true, 'left')

    should.matchState(actual, expected)
  })
})

// TODO: Add failing cases.
describe(takeMid, () => {
  it('should succeed with the value of the parser in the middle', () => {
    const parser = takeMid(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, 'mid')

    should.matchState(actual, expected)
  })
})

// TODO: Add failing cases.
describe(takeRight, () => {
  it('should succeed with the value of the parser on right-hand side', () => {
    const parser = takeRight(string('mid'), string('right'))
    const actual = run(parser, 'midright')
    const expected = result(true, 'right')

    should.matchState(actual, expected)
  })
})

// TODO: Add failing cases.
describe(takeSides, () => {
  it('should succeed with the tuple of the first and the last values', () => {
    const parser = takeSides(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, ['left', 'right'])

    should.matchState(actual, expected)
  })
})
