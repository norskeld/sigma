import * as p from '@parsers'
import { describe, expectTypeOf, it } from '@testing'
import { Result, Success } from '@types'

describe('run', () => {
  const { run } = p

  it('run should have correct inferred signature', () => {
    expectTypeOf<typeof run>().returns.toMatchTypeOf<{ with: (input: string) => Result<unknown> }>()
    expectTypeOf<typeof run<string>>().returns.toMatchTypeOf<{
      with: (input: string) => Result<string>
    }>()
    expectTypeOf<typeof run<string>>().returns.not.toMatchTypeOf<{
      with: (input: string) => Result<number>
    }>()
  })
})

describe('tryRun', () => {
  const { tryRun } = p

  it('tryRun should have correct inferred signature', () => {
    expectTypeOf<typeof tryRun>().returns.toMatchTypeOf<{
      with: (input: string) => Success<unknown>
    }>()
    expectTypeOf<typeof tryRun<string>>().returns.toMatchTypeOf<{
      with: (input: string) => Success<string>
    }>()
    expectTypeOf<typeof tryRun<string>>().returns.not.toMatchTypeOf<{
      with: (input: string) => Success<number>
    }>()
  })
})
