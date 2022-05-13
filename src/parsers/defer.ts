import { type Parser } from '../state'

interface Deferred<T> extends Parser<T> {
  with(parser: Parser<T>): void
}

export function defer<T>(): Deferred<T> {
  let deferred: Parser<T> | null = null

  return {
    with(parser): void {
      deferred = parser
    },

    parse(input, pos) {
      if (deferred) {
        return deferred.parse(input, pos)
      }

      return {
        isOk: false,
        pos,
        error: `Deferred parser wasn't initialized.`
      }
    }
  }
}
