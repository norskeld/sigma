import { success, Parser, State } from '../state'

import { regexp } from '../combinators/regexp'

type SignKind = 'any' | 'some' | 'positive' | 'negative' | 'none'
type SignMeta = [rexpression: RegExp, expectation: string]

interface IntegerOptions {
  sign?: SignKind
  radix?: number
}

const INT_SOME_RE = /^[+-]?\d+$/g
const INT_ANY_RE = /^[+-]\d+$/g
const INT_NONE_RE = /^[^+-]\d+$/g
const INT_POSITIVE_RE = /^[+]\d+$/g
const INT_NEGATIVE_RE = /^[-]\d+$/g

function meta(sign: SignKind): SignMeta {
  // prettier-ignore
  switch (sign) {
    case 'some': return [INT_SOME_RE, `optionally signed integer`]
    case 'any': return [INT_ANY_RE, `signed integer`]
    case 'none': return [INT_NONE_RE, `unsigned integer`]
    case 'positive': return [INT_POSITIVE_RE, `positively signed integer`]
    case 'negative': return [INT_NEGATIVE_RE, `negatively signed integer`]
  }
}

export function integer(options: IntegerOptions = {}): Parser<number> {
  const sign = options.sign ?? 'none'
  const radix = options.radix ?? 10

  return {
    parse(state: State) {
      const [rexpression, expectation] = meta(sign)
      const result = regexp(rexpression, expectation).parse(state)

      switch (result.kind) {
        case 'success': {
          return success(result.state, parseInt(result.value, radix))
        }

        case 'failure': {
          return result
        }
      }
    }
  }
}

export { integer as int }
