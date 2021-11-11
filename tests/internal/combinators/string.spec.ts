import * as exposed from '@lib/internal/combinators/string'
import { run, result } from '@tests/@setup/jest.helpers'

describe('internal/combinators/string', () => {
  it(`exposes 'string' w/ 'str' alias`, () => {
    expect(exposed).toHaveProperty('string')
    expect(exposed).toHaveProperty('str')
  })

  describe(exposed.string, () => {
    const ok = 'test'
    const err = 'text'
    const repetitive = 'testtest'
    const zero = ''

    const parser = exposed.string(ok)

    it(`should result in success if matches the input`, () => {
      const actual = run(parser, ok)
      const expected = result('success', ok)

      expect(actual).toHaveState(expected)
    })

    it(`should result in success if given repetitive input`, () => {
      const actual = run(parser, repetitive)
      const expected = result('success', ok)

      expect(actual).toHaveState(expected)
    })

    it(`should result in failure if doesn't match the input`, () => {
      const actual = run(parser, err)
      const expected = result('failure', ok)

      expect(actual).toHaveState(expected)
    })

    it(`should result in failure if given zero input`, () => {
      const actual = run(parser, zero)
      const expected = result('failure', ok)

      expect(actual).toHaveState(expected)
    })
  })
})
