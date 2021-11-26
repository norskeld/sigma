import { sequence } from '@lib/internal/combinators/sequence'
import { newline } from '@lib/internal/parsers/newline'
import { letters } from '@lib/internal/parsers/letter'

import { run, result, should } from '@tests/@helpers'

const tcase = `Hello\nWorld\n`
const tcaseLit = `Hello
World
`

describe(newline, () => {
  it('should succeed if given a newline (Unix)', () => {
    const actual = run(newline(), '\n')
    const expected = result('success', '\n')

    should.matchState(actual, expected)
  })

  it('should succeed if given a newline sequence (non-Unix)', () => {
    const actual = run(newline(), '\r\n')
    const expected = result('success', '\r\n')

    should.matchState(actual, expected)
  })

  it('should succeed if given a string with a newline at the end', () => {
    const parser = sequence(letters(), newline(), letters(), newline())

    const actualExplicit = run(parser, tcase)
    const actualImplicit = run(parser, tcaseLit)

    const expected = result('success', ['Hello', '\n', 'World', '\n'])

    should.matchState(actualExplicit, expected)
    should.matchState(actualImplicit, expected)
  })

  it('should fail if given a string without a newline', () => {
    const actual = run(sequence(letters(), newline()), 'Hello')
    const expected = result('failure', 'newline')

    should.matchState(actual, expected)
  })
})
