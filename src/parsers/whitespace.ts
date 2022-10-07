import { regexp } from './regexp'

import type { Parser } from '#state'

const WHITESPACE_REQUIRED_RE = /\s+/g

/**
 * Parses whitespace, either a single character or consecutive ones.
 *
 * @returns Matched whitespace character(s)
 */
export function whitespace(): Parser<string> {
  return regexp(WHITESPACE_REQUIRED_RE, 'whitespace')
}
