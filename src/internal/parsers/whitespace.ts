import { Parser } from '../state'

import { regexp } from './regexp'

const WHITESPACE_REQUIRED_RE = /\s+/g
const WHITESPACE_OPTIONAL_RE = /\s*/g

export function whitespace(): Parser<string> {
  return regexp(WHITESPACE_REQUIRED_RE, 'whitespace')
}

export function whitespaceOptional(): Parser<string> {
  return regexp(WHITESPACE_OPTIONAL_RE, 'optional whitespace')
}

export { whitespace as ws, whitespaceOptional as wsOpt }
