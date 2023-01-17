import type { Parser } from '@types'

/**
 * Applies source `parser`, collects its output, and stops after `terminator` parser succeeds.
 *
 * @param parser - Parser to apply
 * @param terminator - Terminating parser to stop after
 *
 * @returns Tuple of values collected by `parser` and `terminator`
 */
export function takeUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<[Array<T>, S]> {
  return {
    parse(input, pos) {
      const values: Array<T> = []
      let nextPos = pos

      while (true) {
        const resultT = terminator.parse(input, nextPos)

        switch (resultT.isOk) {
          // If ok, then we stumbled upon a terminating parser, so push final matches, and then
          // return accumulated values.
          case true: {
            return {
              isOk: true,
              span: [pos, resultT.pos],
              pos: resultT.pos,
              value: [values, resultT.value]
            }
          }

          // Otherwise try to run source parser and push results into `values`.
          // If it fails, then return early and stop parsing.
          case false: {
            const resultP = parser.parse(input, nextPos)

            if (resultP.isOk) {
              values.push(resultP.value)
              nextPos = resultP.pos
              continue
            }

            return resultP
          }
        }
      }
    }
  }
}

/**
 * Applies source `parser`, ignores its output, and stops after `terminator` parser succeeds.
 *
 * @param parser - Parser to apply
 * @param terminator - Terminating parser to stop after
 *
 * @returns Value of `terminator` parser
 */
export function skipUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<S> {
  return {
    parse(input, pos) {
      let nextPos = pos

      while (true) {
        const resultT = terminator.parse(input, nextPos)

        switch (resultT.isOk) {
          // If ok, then we stumbled upon a terminating parser, so return its value.
          case true: {
            return {
              isOk: true,
              span: [pos, resultT.pos],
              pos: resultT.pos,
              value: resultT.value
            }
          }

          // Otherwise try to run source parser *ignoring* its results.
          // If it fails, then return early and stop parsing.
          case false: {
            const resultP = parser.parse(input, nextPos)

            if (resultP.isOk) {
              nextPos = resultP.pos
              continue
            }

            return resultP
          }
        }
      }
    }
  }
}
