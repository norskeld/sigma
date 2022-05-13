import { type Parser } from '../state'

import { nothing } from '../parsers/nothing'
import { choice } from './choice'

export function optional<T>(parser: Parser<T>): Parser<T | null> {
  return choice(parser, nothing())
}
