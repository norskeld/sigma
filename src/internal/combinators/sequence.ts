import { success, State, Parser } from '../state'

export function sequence<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<[T1, T2]>

export function sequence<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T2, T3]>

export function sequence<T1, T2, T3, T4>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>
): Parser<[T1, T2, T3, T4]>

export function sequence<T1, T2, T3, T4, T5>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>
): Parser<[T1, T2, T3, T4, T5]>

export function sequence<T1, T2, T3, T4, T5, T6>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>
): Parser<[T1, T2, T3, T4, T5, T6]>

export function sequence<T1, T2, T3, T4, T5, T6, T7>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>
): Parser<[T1, T2, T3, T4, T5, T6, T7]>

export function sequence<T1, T2, T3, T4, T5, T6, T7, T8>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>,
  p8: Parser<T8>
): Parser<[T1, T2, T3, T4, T5, T6, T7, T8]>

export function sequence<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>,
  p4: Parser<T4>,
  p5: Parser<T5>,
  p6: Parser<T6>,
  p7: Parser<T7>,
  p8: Parser<T8>,
  p9: Parser<T9>
): Parser<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>

export function sequence<T>(...parsers: Array<Parser<T>>): Parser<Array<T>> {
  return {
    parse(state: State) {
      let values: Array<T> = []
      let nextState: State = state

      for (const parser of parsers) {
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

export { sequence as seq }
