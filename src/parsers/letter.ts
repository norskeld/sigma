import { type Parser } from '../state'

import { regexp } from './regexp'

const LETTER_RE = /\p{Letter}/gu
const LETTERS_RE = /\p{Letter}+/gu

export function letter(): Parser<string> {
  return regexp(LETTER_RE, 'letter')
}

export function letters(): Parser<string> {
  return regexp(LETTERS_RE, 'letters')
}
