import { success, State, Parser } from '../state'

export function map<T, R>(parser: Parser<T>, fn: (value: T) => R): Parser<R> {
  return {
    parse(state: State) {
      const result = parser.parse(state)

      switch (result.kind) {
        case 'success': {
          return success(result.state, fn(result.value))
        }

        case 'failure': {
          return result
        }
      }
    }
  }
}

export function mapTo<T, R>(parser: Parser<T>, value: R): Parser<R> {
  return map(parser, () => value)
}
