import { State, Parser } from '../state'

export function lazy<T>(thunk: () => Parser<T>): Parser<T> {
  return {
    parse(state: State) {
      return thunk().parse(state)
    }
  }
}
