import * as exposed from '@lib/combinators'
import { takeLeft, takeMid, takeRight, string } from '@lib/combinators'

import { run, result, should } from '@tests/@setup/jest.helpers'

describe('internal/combinators/sequence', () => {
  it(`should expose 'takeLeft' ('tleft'), 'takeMid' ('tmid') and 'takeRight' ('tright)`, () => {
    should.expose(exposed, 'takeLeft', 'tleft', 'takeMid', 'tmid', 'takeRight', 'tright')
  })

  // TODO: Add failing cases.
  describe(takeLeft, () => {
    it(`should succeed with the value of the left parser `, () => {
      const parser = takeLeft(string('left'), string('mid'))
      const actual = run(parser, 'leftmid')
      const expected = result('success', 'left')

      should.matchState(actual, expected)
    })
  })

  // TODO: Add failing cases.
  describe(takeMid, () => {
    it(`should succeed with the value of the middle parser`, () => {
      const parser = takeMid(string('left'), string('mid'), string('right'))
      const actual = run(parser, 'leftmidright')
      const expected = result('success', 'mid')

      should.matchState(actual, expected)
    })
  })

  // TODO: Add failing cases.
  describe(takeRight, () => {
    it(`should succeed with the value of the middle parser`, () => {
      const parser = takeRight(string('mid'), string('right'))
      const actual = run(parser, 'midright')
      const expected = result('success', 'right')

      should.matchState(actual, expected)
    })
  })
})
