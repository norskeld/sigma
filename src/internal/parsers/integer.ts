import { success, Parser, State } from '../state'

import { regexp } from './regexp'

const INT_SIGNED_RE = /-?\d+/g
const INT_UNSIGNED_RE = /\d+/g

function createIntegerParser(re: RegExp, expectation: string, radix: number) {
  return {
    parse(state: State) {
      const result = regexp(re, expectation).parse(state)

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

export function integer(radix = 10): Parser<number> {
  return createIntegerParser(INT_SIGNED_RE, 'signed integer', radix)
}

export function integerUnsigned(radix = 10): Parser<number> {
  return createIntegerParser(INT_UNSIGNED_RE, 'unsigned integer', radix)
}

export { integer as int, integerUnsigned as uint }
