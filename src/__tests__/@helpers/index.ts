import * as assert from 'uvu/assert'
import type { Parser, Result } from '../../state'
import { run as internal$run } from '../../parsers/run'

interface ReducedResult<T> {
  isOk: boolean
  value: T
}

export function run<T>(parser: Parser<T>, text: string): Result<T> {
  return internal$run(parser).with(text)
}

export function result<T>(isOk: boolean, value: T): ReducedResult<T> {
  return { isOk, value } as const
}

export const should = {
  // expose(exposed: Record<string, unknown>, ...exposees: Array<string>): void {
  //   exposees.forEach((exposee) => assert.equal(exposed).toHaveProperty(exposee))
  // },

  matchState<T, R>(received: Result<T>, expected: ReducedResult<R>): void {
    assert.equal(received.isOk, expected.isOk)

    switch (received.isOk) {
      case true: {
        return assert.equal(received.value, expected.value)
      }

      case false: {
        return assert.equal(received.expected, expected.value)
      }
    }
  }
}
