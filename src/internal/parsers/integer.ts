import { success, Parser, State } from '../state'

import { regexp } from './regexp'

type SignKind = 'always' | 'never' | 'maybe'
type SignMeta = [rexpression: RegExp, expectation: string]

interface IntegerOptions {
  sign?: SignKind
  radix?: number
}

const INT_ALWAYS_RE = /-\d+/g
const INT_NEVER_RE = /\d+/g
const INT_MAYBE_RE = /-?\d+/g

function meta(sign: SignKind): SignMeta {
  // prettier-ignore
  switch (sign) {
    case 'always': return [INT_ALWAYS_RE, 'signed integer']
    case 'never': return [INT_NEVER_RE, 'unsigned integer']
    case 'maybe': return [INT_MAYBE_RE, 'optionally signed integer']
  }
}

export function integer(options: IntegerOptions = {}): Parser<number> {
  const sign = options.sign ?? 'maybe'
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
