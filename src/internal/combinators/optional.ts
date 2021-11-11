import { Parser } from '../state'

import { nothing } from './nothing'
import { choice } from './choice'

export function optional<T>(parser: Parser<T>): Parser<T | null> {
  return choice(parser, nothing())
}

export { optional as opt }
