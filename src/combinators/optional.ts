import { choice } from './choice'

import { nothing } from '@parsers'
import type { Parser } from '@types'

/**
 * Applies `parser`. Only fails if `parser` fails.
 *
 * @param parser - Parser to apply
 *
 * @returns Result of `parser` or `null`
 */
export function optional<T>(parser: Parser<T>): Parser<T | null> {
  return choice(parser, nothing())
}
