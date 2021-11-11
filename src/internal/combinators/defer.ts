import { failure, State, Parser, Result } from '../state'

interface Deferred<T> extends Parser<T> {
  with(parser: Parser<T>): void
}

export function defer<T>(): Deferred<T> {
  let deferred: Parser<T> | null = null

  return {
    with(parser: Parser<T>): void {
      deferred = parser
    },

    parse(state: State): Result<T> {
      if (deferred) {
        return deferred.parse(state)
      }

      return failure(state, `Deferred parser wasn't initialized.`)
    }
  }
}
