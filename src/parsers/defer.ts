import type { Parser } from '@types'

/**
 * Intersection type to add a method for deferred parser definition.
 *
 * @internal
 */
type Deferred<T> = Parser<T> & {
  with(parser: Parser<T>): void
}

/**
 * This is a special parser that has an additional `with` method, which should be used to define the
 * parser. This parser is tailored for creating mutually recursive parsers.
 *
 * @example
 *
 * ```typescript
 * interface NumberNode {
 *   type: 'number'
 *   value: number
 * }
 *
 * interface ListNode {
 *   type: 'list'
 *   value: Array<NumberNode | ListNode>
 * }
 *
 * // Here we create 'dummies'
 *
 * const TupleList = defer<ListNode>()
 * const TupleNumber = defer<NumberNode>()
 *
 * // And below we actually define parsers
 *
 * TupleNumber.with(
 *   map(
 *     int(),
 *     (value) => ({ type: 'number', value })
 *   )
 * )
 *
 * TupleList.with(
 *   map(
 *     takeMid(
 *       string('('),
 *       sepBy(choice(TupleList, TupleNumber), string(',')),
 *       string(')')
 *     ),
 *     (value) => ({ type: 'list', value })
 *   )
 * )
 *
 * console.log(
 *   run(TupleList).with('(1,2,(3,(4,5)))')
 * )
 * ```
 */
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

      throw new Error('Deferred parser was not initialized')
    }
  }
}
