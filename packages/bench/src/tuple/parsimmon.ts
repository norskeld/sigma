import P from 'parsimmon'

import type * as Ast from './ast.ts'

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: string): Ast.NumberNode {
  return {
    type: 'number',
    value: +value,
  }
}

function toList(value: Array<Ast.NumberNode | Ast.ListNode>): Ast.ListNode {
  return {
    type: 'list',
    value,
  }
}

/* Parsers. */

interface TupleLanguage {
  Number: Ast.NumberNode
  List: Ast.ListNode
  Item: Ast.NumberNode | Ast.ListNode
}

const Comma = P.string(',').trim(P.optWhitespace)

const Tuple = P.createLanguage<TupleLanguage>({
  Number: () => P.regexp(/-?\d+/).map(toNumber),
  Item: (r) => P.alt<Ast.NumberNode | Ast.ListNode>(r.Number, r.List),
  List: (r) => r.Item.sepBy(Comma).wrap(P.string('('), P.string(')')).map(toList),
})

/* Wrapper for bench runner. */

export function parse(text: string): Ast.ListNode {
  return Tuple.List.tryParse(text)
}
