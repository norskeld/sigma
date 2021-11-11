import { State, Parser, Result } from '../state'

export function choice<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1 | T2>

export function choice<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<T1 | T2 | T3>

export function choice<T1, T2, T3, T4>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>
): Parser<T1 | T2 | T3 | T4>

export function choice<T1, T2, T3, T4, T5>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>
): Parser<T1 | T2 | T3 | T4 | T5>

export function choice<T1, T2, T3, T4, T5, T6>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>
): Parser<T1 | T2 | T3 | T4 | T5 | T6>

export function choice<T1, T2, T3, T4, T5, T6, T7>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>
): Parser<T1 | T2 | T3 | T4 | T5 | T6 | T7>

export function choice<T1, T2, T3, T4, T5, T6, T7, T8>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>,
  p8: Parser<T8>
): Parser<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>

export function choice<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>,
  p8: Parser<T8>,
  p9: Parser<T9>
): Parser<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>

export function choice<T>(...parsers: Array<Parser<T>>): Parser<T> {
  return {
    parse(state: State) {
      let nextResult: Result<T> | null = null

      for (const parser of parsers) {
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

export { choice as alt }
