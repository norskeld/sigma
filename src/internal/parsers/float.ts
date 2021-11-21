import { success, Parser, State } from '../state'

import { regexp } from './regexp'

type SignKind = 'always' | 'never' | 'maybe'
type SignMeta = [rexpression: RegExp, expectation: string]

interface FloatOptions {
  sign?: SignKind
}

const FLOAT_ALWAYS_RE = /-\d+\.\d+/g
const FLOAT_NEVER_RE = /\d+\.\d+/g
const FLOAT_MAYBE_RE = /-?\d+\.\d+/g

function meta(sign: SignKind): SignMeta {
  // prettier-ignore
  switch (sign) {
    case 'always': return [FLOAT_ALWAYS_RE, 'signed float']
    case 'never': return [FLOAT_NEVER_RE, 'unsigned float']
    case 'maybe': return [FLOAT_MAYBE_RE, 'optionally signed float']
  }
}

export function float(options: FloatOptions = {}): Parser<number> {
  const sign = options.sign ?? 'maybe'

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
