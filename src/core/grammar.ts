import { Parser } from '@lib/types'

type Grammar<T> = {
  [P in keyof T]: T[P] extends () => unknown ? ReturnType<T[P]> : never
}

type GrammarInit<T> = T & ThisType<Grammar<T>>

type GrammarType = {
  [name: string]: () => Parser<unknown>
}

export function grammar<T extends GrammarType>(init: GrammarInit<T>): Grammar<T> {
  const grammar = {} as { [key: string]: Parser<unknown> }

  const initialized = {} as { [key: string]: true }

  for (const key in init) {
    grammar[key] = {
      parse(input, pos) {
        if (!initialized[key]) {
          initialized[key] = true

          grammar[key].parse = init[key].apply(grammar).parse
        }

        return grammar[key].parse(input, pos)
      }
    } as Parser<unknown>
  }

  return grammar as Grammar<T>
}
