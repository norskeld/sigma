import type { Parser } from '@types'
import { FAIL } from '@types'

import { regexp } from './regexp'

const HEXADECIMAL_RE = /0[xX][0-9a-fA-F]+/y
const BINARY_RE = /0[bB][01]+/y
const OCTAL_RE = /0[oO][0-7]+/y
const WHOLE_RE = /(?:0|[1-9][0-9]*)/y
const INTEGER_RE = /-?(?:0|[1-9][0-9]*)/y
const FLOAT_RE = /-?[0-9]+\.[0-9]+/y

const HEXADECIMAL_PARSER = regexp(HEXADECIMAL_RE, 'hexadecimal number')
const BINARY_PARSER = regexp(BINARY_RE, 'binary number')
const OCTAL_PARSER = regexp(OCTAL_RE, 'octal number')
const WHOLE_PARSER = regexp(WHOLE_RE, 'whole number')
const INTEGER_PARSER = regexp(INTEGER_RE, 'integer number')
const FLOAT_PARSER = regexp(FLOAT_RE, 'float number')

/**
 * Parses a hexadecimal number prefixed with `0x` or `0X`, e.g. `0xFF`, `0XFF`, `0xff`.
 *
 * @returns Parsed hexadecimal number as a decimal one
 */
export function hex(): Parser<number> {
  return {
    parse(ctx) {
      const result = HEXADECIMAL_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseInt(result.slice(2), 16)
    },
  }
}

/**
 * Parses a binary number prefixed with `0b` or `0B`, e.g. `0b101`, `0B101`.
 *
 * @returns Parsed binary number as a decimal one
 */
export function binary(): Parser<number> {
  return {
    parse(ctx) {
      const result = BINARY_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseInt(result.slice(2), 2)
    },
  }
}

/**
 * Parses an octal number prefixed with `0o` or `0O`, e.g. `0o420`, `0O420`.
 *
 * @returns Parsed octal number as a decimal one
 */
export function octal(): Parser<number> {
  return {
    parse(ctx) {
      const result = OCTAL_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseInt(result.slice(2), 8)
    },
  }
}

/**
 * Parses a positive whole number without leading zeros, e.g. `0`, `7`, `420`.
 *
 * @returns Parsed whole number
 */
export function whole(): Parser<number> {
  return {
    parse(ctx) {
      const result = WHOLE_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseInt(result, 10)
    },
  }
}

/**
 * Parses an integer number with an optional minus sign, e.g. `0`, `-7`, `420`.
 *
 * @returns Parsed integer number
 */
export function integer(): Parser<number> {
  return {
    parse(ctx) {
      const result = INTEGER_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseInt(result, 10)
    },
  }
}

/**
 * Parses a float number with an optional minus sign, e.g. `0.25`, `-7.90`, `4.20`.
 *
 * Note: It doesn't handle floats with exponent parts.
 *
 * @returns Parsed float number
 */
export function float(): Parser<number> {
  return {
    parse(ctx) {
      const result = FLOAT_PARSER.parse(ctx)
      if (result === FAIL) return FAIL

      return parseFloat(result)
    },
  }
}
