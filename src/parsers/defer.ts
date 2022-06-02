import { type Parser } from '../state'

type Deferred<T> = Parser<T> & {
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
        expected: `Deferred parser wasn't initialized.`
      }
    }
  }
}
