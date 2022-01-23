import { Parser } from '../state'

import { regexp } from './regexp'

const WHITESPACE_REQUIRED_RE = /\s+/g

export function whitespace(): Parser<string> {
  return regexp(WHITESPACE_REQUIRED_RE, 'whitespace')
}
