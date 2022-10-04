import type { Parser } from '../state'

import { regexp } from './regexp'

const WHITESPACE_REQUIRED_RE = /\s+/g

/**
 * Parses whitespace, either a single character or consecutive ones.
 *
 * @returns Matched whitespace character(s)
 */
export function whitespace(): Parser<string> {
  return regexp(WHITESPACE_REQUIRED_RE, 'whitespace')
}
