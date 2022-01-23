import { failure, type Parser } from '../state'

interface Deferred<T> extends Parser<T> {
  with(parser: Parser<T>): void
}

export function defer<T>(): Deferred<T> {
  let deferred: Parser<T> | null = null

  return {
    with(parser): void {
      deferred = parser
    },

    parse(state) {
      if (deferred) {
        return deferred.parse(state)
      }

      return failure(state, `Deferred parser wasn't initialized.`)
    }
  }
}
