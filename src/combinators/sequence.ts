import { success, type Parser, type ToTuple } from '../state'

export function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
export function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>> {
  return {
    parse(state) {
      let values: Array<T> = []
      let nextState = state

      for (const parser of ps) {
        const result = parser.parse(nextState)

        switch (result.kind) {
          case 'success': {
            values = [...values, result.value]
            nextState = result.state
            break
          }

          case 'failure': {
            return result
          }
        }
      }

      return success(nextState, values)
    }
  }
}
