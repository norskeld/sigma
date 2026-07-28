import { anyCharOf, regexp, spaces1, string, whitespace } from 'parjs'
import { many, map, maybe, or, qthen, then, thenq } from 'parjs/combinators'

import type * as Ast from './ast.ts'

/* Tokens. */

const Keywords = {
  Select: 'SELECT',
  From: 'FROM',
  Where: 'WHERE',
} as const

const Terminals = {
  Comma: ',',
  GreaterThan: '>',
  LessThan: '<',
} as const

/* Mapping functions to turn parsed string values into AST nodes. */

function toSelectStatement(
  tuple: [Ast.SelectClause, Ast.FromClause, Ast.WhereClause | null],
): Ast.SelectStatement {
  const [select, from, where] = tuple

  return {
    type: 'statement',
    select,
    from,
    where,
  }
}

function toSelectClause(columns: Array<Ast.Identifier>): Ast.SelectClause {
  return {
    type: 'select',
    columns,
  }
}

function toFromClause(table: Ast.Identifier): Ast.FromClause {
  return {
    type: 'from',
    table,
  }
}

function toWhereClause(condition: Ast.Expression): Ast.WhereClause {
  return {
    type: 'where',
    condition,
  }
}

function toExpression(tuple: [Ast.AtomicExpression, string, Ast.AtomicExpression]): Ast.Expression {
  const [lhs, operator, rhs] = tuple

  return {
    type: 'expression',
    lhs,
    operator: operator === Terminals.GreaterThan ? '>' : '<',
    rhs,
  }
}

function toIdentifier(name: string): Ast.Identifier {
  return {
    type: 'identifier',
    name,
  }
}

function toIntegerLiteral(value: number): Ast.IntegerLiteral {
  return {
    type: 'integer',
    value,
  }
}

/* Parsers. */

// Tokens consume trailing whitespace; keywords require at least one space right after.
const pSpace = whitespace()
const keyword = (word: string) => string(word).pipe(thenq(spaces1()))

// The parjs `regexp` parser yields the whole match array, so we pick the full match.
const pIdentifier = regexp(/[a-zA-Z]\w*/).pipe(
  map((match) => match[0]),
  thenq(pSpace),
  map(toIdentifier),
)

const pIntegerLiteral = regexp(/0|[1-9]\d*/).pipe(
  map((match) => Number(match[0])),
  thenq(pSpace),
  map(toIntegerLiteral),
)

const pComma = string(Terminals.Comma).pipe(thenq(pSpace))

const pOperator = anyCharOf(Terminals.GreaterThan + Terminals.LessThan).pipe(thenq(pSpace))

const pAtomicExpression = pIntegerLiteral.pipe(or(pIdentifier))

const pExpression = pAtomicExpression.pipe(then(pOperator, pAtomicExpression), map(toExpression))

// Composed via `then` + `many`, since `manySepBy` has no at-least-one mode and returns
// an array with a non-standard `separators` property that fails deep equality.
const pColumns = pIdentifier.pipe(
  then(pComma.pipe(qthen(pIdentifier), many())),
  map(([first, rest]) => [first, ...rest]),
)

const pSelectClause = keyword(Keywords.Select).pipe(qthen(pColumns), map(toSelectClause))
const pFromClause = keyword(Keywords.From).pipe(qthen(pIdentifier), map(toFromClause))
const pWhereClause = keyword(Keywords.Where).pipe(qthen(pExpression), map(toWhereClause))

const pSelectStatement = pSelectClause.pipe(
  then(pFromClause, pWhereClause.pipe(maybe(null))),
  map(toSelectStatement),
)

/* Wrapper for bench runner. */

export function parse(text: string): Ast.SelectStatement {
  const result = pSelectStatement.parse(text)

  if (result.kind !== 'OK') {
    throw new Error(`parjs failed: ${result.reason}`)
  }

  return result.value
}
