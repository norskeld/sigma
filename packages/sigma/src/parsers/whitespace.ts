import type { Parser } from '@types'

import { regexp } from './regexp'

const WHITESPACE_REQUIRED_RE = /\s+/y

/**
 * Parses whitespace, either a single character or consecutive ones.
 *
 * @returns Matched whitespace character(s)
 */
export function whitespace(): Parser<string> {
  return regexp(WHITESPACE_REQUIRED_RE, 'whitespace')
}
