import { int, string, whitespace } from 'parjs'
import { between, later, manySepBy, map, or } from 'parjs/combinators'

import type * as Ast from './ast.ts'

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: number): Ast.NumberNode {
  return {
    type: 'number',
    value,
  }
}

function toList(value: Array<Ast.NumberNode | Ast.ListNode>): Ast.ListNode {
  return {
    type: 'list',
    // Copy, since parjs attaches a non-standard `separators` property to `manySepBy` results.
    value: value.slice(),
  }
}

/* Parsers. */

const OpenParen = string('(')
const CloseParen = string(')')
const Comma = string(',').pipe(between(whitespace()))

const TupleNumber = later<Ast.NumberNode>()
const TupleList = later<Ast.ListNode>()

TupleNumber.init(int().pipe(map(toNumber)))

TupleList.init(
  TupleNumber.pipe(or(TupleList), manySepBy(Comma), between(OpenParen, CloseParen), map(toList)),
)

/* Wrapper for bench runner. */

export function parse(text: string): Ast.ListNode {
  const result = TupleList.parse(text)

  if (result.kind !== 'OK') {
    throw new Error(`parjs failed: ${result.reason}`)
  }

  return result.value
}
