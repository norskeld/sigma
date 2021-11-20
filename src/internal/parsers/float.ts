import { success, Parser, State } from '../state'

import { regexp } from './regexp'

type SignKind = 'any' | 'some' | 'positive' | 'negative' | 'none'
type SignMeta = [rexpression: RegExp, expectation: string]

interface FloatOptions {
  sign?: SignKind
}

const FLOAT_SOME_RE = /^[+-]?\d+[.]\d+$/g
const FLOAT_ANY_RE = /^[+-]\d+[.]\d+$/g
const FLOAT_NONE_RE = /^\d+[.]\d+$/g
const FLOAT_POSITIVE_RE = /^[+]\d+[.]\d+$/g
const FLOAT_NEGATIVE_RE = /^[-]\d+[.]\d+$/g

function meta(sign: SignKind): SignMeta {
  // prettier-ignore
  switch (sign) {
    case 'some': return [FLOAT_SOME_RE, `optionally signed float`]
    case 'any': return [FLOAT_ANY_RE, `signed float`]
    case 'none': return [FLOAT_NONE_RE, `unsigned float`]
    case 'positive': return [FLOAT_POSITIVE_RE, `positively signed float`]
    case 'negative': return [FLOAT_NEGATIVE_RE, `negatively signed float`]
  }
}

export function float(options: FloatOptions = {}): Parser<number> {
  const sign = options.sign ?? 'none'

  return {
    parse(state: State) {
      const [rexpression, expectation] = meta(sign)
      const result = regexp(rexpression, expectation).parse(state)

      switch (result.kind) {
        case 'success': {
          return success(result.state, parseFloat(result.value))
        }

        case 'failure': {
          return result
        }
      }
    }
  }
}
