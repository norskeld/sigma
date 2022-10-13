import { choice, map, optional, sepBy, sequence, takeMid } from '@nrsk/sigma/combinators'
import { defer, regexp, run, string, whitespace } from '@nrsk/sigma/parsers'

import * as Ast from './ast'

/* Tokens. */

const Terminals = {
  OpenParen: '(',
  CloseParen: ')',
  Comma: ','
} as const

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: string): Ast.NumberNode {
  return {
    type: 'number',
    value: +value
  }
}

function toList(value: Array<Ast.NumberNode | Ast.ListNode>): Ast.ListNode {
  return {
    type: 'list',
    value
  }
}

/* Parsers. */

const OpenParen = string(Terminals.OpenParen)
const CloseParen = string(Terminals.CloseParen)
const Space = optional(whitespace())
const Comma = sequence(Space, string(Terminals.Comma), Space)
const Integer = regexp(/-?\d+/g, 'signed integer')

const TupleNumber = defer<Ast.NumberNode>()
const TupleList = defer<Ast.ListNode>()

TupleNumber.with(map(Integer, toNumber))

TupleList.with(
  map(takeMid(OpenParen, sepBy(choice(TupleList, TupleNumber), Comma), CloseParen), toList)
)

/* Wrapper for bench runner. */

export function parse(text: string): Ast.ListNode {
  const result = run(TupleList).with(text)

  switch (result.isOk) {
    case true: {
      return result.value
    }

    case false: {
      return {
        type: 'list',
        value: []
      }
    }
  }
}
