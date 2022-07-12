import { type Parser } from '../state'

import { regexp } from './regexp'

const LETTER_RE = /\p{Letter}/gu
const LETTERS_RE = /\p{Letter}+/gu

/**
 * Parses a single alphabetical character. Unicode friendly.
 *
 * @returns Matched character.
 */
export function letter(): Parser<string> {
  return regexp(LETTER_RE, 'letter')
}

/**
 * Parses a sequence of alphabetical characters. Unicode friendly.
 *
 * @returns Matched characters as a string.
 */
export function letters(): Parser<string> {
  return regexp(LETTERS_RE, 'letters')
}
