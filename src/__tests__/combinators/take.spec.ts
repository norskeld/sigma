import { takeLeft, takeMid, takeRight, takeSides } from '../../combinators/take'
import { string } from '../../parsers/string'
import { describe, result, run, should } from '../@helpers'

describe('takeLeft', (it) => {
  it('should succeed with the value of the parser on the left-hand side', () => {
    const parser = takeLeft(string('left'), string('mid'))
    const actual = run(parser, 'leftmid')
    const expected = result(true, 'left')

    should.matchState(actual, expected)
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = takeLeft(string('left'), string('mid'))
    const actual = run(parser, 'left mid')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })
})

describe('takeMid', (it) => {
  it('should succeed with the value of the parser in the middle', () => {
    const parser = takeMid(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, 'mid')

    should.matchState(actual, expected)
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = takeMid(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'left midright')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })
})

describe('takeRight', (it) => {
  it('should succeed with the value of the parser on right-hand side', () => {
    const parser = takeRight(string('mid'), string('right'))
    const actual = run(parser, 'midright')
    const expected = result(true, 'right')

    should.matchState(actual, expected)
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = takeRight(string('mid'), string('right'))
    const actual = run(parser, 'mid right')
    const expected = result(false, 'right')

    should.matchState(actual, expected)
  })
})

describe('takeSides', (it) => {
  it('should succeed with the tuple of the first and the last values', () => {
    const parser = takeSides(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'leftmidright')
    const expected = result(true, ['left', 'right'])

    should.matchState(actual, expected)
  })

  it('should fail completely when one of the parsers fail', () => {
    const parser = takeSides(string('left'), string('mid'), string('right'))
    const actual = run(parser, 'left midright')
    const expected = result(false, 'mid')

    should.matchState(actual, expected)
  })
})
