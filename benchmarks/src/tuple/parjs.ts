import { int, string, whitespace } from 'parjs'
import { between, later, manySepBy, map, or } from 'parjs/combinators'

import * as Ast from './ast'

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: number): Ast.NumberNode {
  return {
    type: 'number',
    value
  }
}

function toList(value: Array<Ast.NumberNode | Ast.ListNode>): Ast.ListNode {
  return {
    type: 'list',
    value
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
  TupleNumber.pipe(or(TupleList), manySepBy(Comma), between(OpenParen, CloseParen), map(toList))
)

/* Wrapper for bench runner. */

export function parse(text: string): Ast.ListNode {
  const result = TupleList.parse(text)

  if (result.kind === 'OK') {
    return result.value
  }

  return {
    type: 'list',
    value: []
  }
}
