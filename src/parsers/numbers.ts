import { regexp } from './regexp'

import type { Parser } from '@types'

const HEXADECIMAL_RE = /0[xX][0-9a-fA-F]+/g
const BINARY_RE = /0[bB][01]+/g
const OCTAL_RE = /0[oO][0-8]+/g
const WHOLE_RE = /(0|[1-9][0-9]*)/g
const INTEGER_RE = /-?(0|[1-9][0-9]*)/g
const FLOAT_RE = /-?[0-9]+\.[0-9]+/g

/**
 * Parses a hexadecimal number prefixed with `0x` or `0X`, e.g. `0xFF`, `0XFF`, `0xff`.
 *
 * @returns Parsed hexadecimal number as a decimal one
 */
export function hex(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(HEXADECIMAL_RE, 'hexadecimal number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseInt(result.value.slice(2), 16)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}

/**
 * Parses a binary number prefixed with `0b` or `0B`, e.g. `0b101`, `0B101`.
 *
 * @returns Parsed binary number as a decimal one
 */
export function binary(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(BINARY_RE, 'binary number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseInt(result.value.slice(2), 2)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}

/**
 * Parses an octal number prefixed with `0o` or `0O`, e.g. `0o420`, `0O420`.
 *
 * @returns Parsed octal number as a decimal one
 */
export function octal(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(OCTAL_RE, 'octal number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseInt(result.value.slice(2), 8)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}

/**
 * Parses a positive whole number without leading zeros, e.g. `0`, `7`, `420`.
 *
 * @returns Parsed whole number
 */
export function whole(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(WHOLE_RE, 'whole number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseInt(result.value, 10)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}

/**
 * Parses an integer number with an optional minus sign, e.g. `0`, `-7`, `420`.
 *
 * @returns Parsed integer number
 */
export function integer(): Parser<number> {
  return {
    parse(input, pos) {
      const result = regexp(INTEGER_RE, 'integer number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseInt(result.value, 10)
          }
        }

        case false: {
          return result
        }
      }
    }
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
    parse(input, pos) {
      const result = regexp(FLOAT_RE, 'float number').parse(input, pos)

      switch (result.isOk) {
        case true: {
          return {
            isOk: true,
            span: [pos, result.pos],
            pos: result.pos,
            value: parseFloat(result.value)
          }
        }

        case false: {
          return result
        }
      }
    }
  }
}
