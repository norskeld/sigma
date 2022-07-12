import { nothing } from '../parsers/nothing'
import { type Parser } from '../state'

import { choice } from './choice'

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
