import { success, type Parser } from '../state'

export function many<T>(parser: Parser<T>): Parser<Array<T>> {
  return {
    parse(state) {
      let values: Array<T> = []
      let nextState = state

      while (true) {
        const result = parser.parse(nextState)

        switch (result.kind) {
          case 'success': {
            values = [...values, result.value]
            nextState = result.state
            break
          }

          case 'failure': {
            return success(nextState, values)
          }
        }
      }
    }
  }
}
