import type { Parser, Result, ToUnion } from '../state'

export function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
export function choice<T>(...ps: Array<Parser<T>>): Parser<T> {
  return {
    parse(state) {
      let nextResult: Result<T> | null = null

      for (const parser of ps) {
        const result = parser.parse(state)

        switch (result.kind) {
          case 'success': {
            return result
          }

          case 'failure': {
            if (!nextResult || nextResult.state.index < result.state.index) {
              nextResult = result
            }
          }
        }
      }

      // TODO: Get rid of this non-null assertion.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return nextResult!
    }
  }
}
