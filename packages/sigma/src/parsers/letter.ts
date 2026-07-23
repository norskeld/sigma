import type { Parser } from '@types'

import { regexp } from './regexp'

const LETTER_RE = /\p{Letter}/uy
const LETTERS_RE = /\p{Letter}+/uy

const LETTER_PARSER = regexp(LETTER_RE, 'letter')
const LETTERS_PARSER = regexp(LETTERS_RE, 'letters')

/**
 * Parses a single alphabetical character. Unicode friendly.
 *
 * @returns Matched character.
 */
export function letter(): Parser<string> {
  return LETTER_PARSER
}

/**
 * Parses a sequence of alphabetical characters. Unicode friendly.
 *
 * @returns Matched characters as a string.
 */
export function letters(): Parser<string> {
  return LETTERS_PARSER
}
