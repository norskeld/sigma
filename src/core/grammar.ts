import { Parser } from '@lib/types'

/**
 * This type extracts the return-types from the parser initializers.
 */
export type Grammar<T> = {
  [P in keyof T]: T[P] extends () => unknown ? ReturnType<T[P]> : never
}

/**
 * This type injects the initialized parser types into `this`, allowing for
 * type-safe self-contained and mutually recursive grammars.
 */
export type GrammarInit<T> = T & ThisType<Grammar<T>>

/**
 * This defines the input to the `grammar` function - the parser initializers.
 */
export type GrammarType = {
  [name: string]: () => Parser<unknown>
}

/**
 * This is a utility function to simplify the creation of a self-contained grammar.
 *
 * Similarly to `defer`, this allows for the creation of mutually recursive parsers,
 * but lets you define all of the component parsers within a single call.
 *
 * The function takes an object with parser initializers, and returns an object with
 * all of those parsers initialized. Within the parser initializers, use `this` to
 * reference other initialized parsers, as in the example below.
 *
 * The properties of the resulting object are just regular parsers - you can freely
 * destructure these, pass them around individually, or compose them with other
 * grammars, parsers or combinators as needed.
 *
 * @example
 *
 * ```typescript
 * const tupleGrammar = grammar({
 *   tupleNumber(): Parser<NumberNode> {
 *     return map(integer(), (value, span) => ({ type: 'number', span, value }))
 *   },
 *   tupleList(): Parser<ListNode> {
 *     return map(
 *       takeMid(
 *         string('('),
 *         sepBy(choice(this.tupleList, this.tupleNumber), string(',')),
 *         string(')')
 *       ),
 *       (value, span) => ({ type: 'list', span, value })
 *     )
 *   }
 * })
 *
 * const result = run(tupleGrammar.tupleList).with('(1,2,(3,4))')
 * ```
 *
 * @param init
 * @returns
 */
export function grammar<T extends GrammarType>(init: GrammarInit<T>): Grammar<T> {
  const grammar = {} as { [key: string]: Parser<unknown> }

  for (const key in init) {
    grammar[key] = {
      parse() {
        throw new Error()
      }
    }
  }

  for (const key in init) {
    grammar[key].parse = init[key].apply(grammar).parse
  }

  return grammar as Grammar<T>
}
