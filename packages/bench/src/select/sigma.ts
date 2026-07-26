import type { Parser } from '@nrsk/sigma'
import {
  choice,
  defer,
  first,
  last,
  map,
  optional,
  regexp,
  run,
  sepBy1,
  sequence,
  string,
  whitespace,
  whole,
} from '@nrsk/sigma'

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

// Non-Terminals.
const Space = optional(whitespace())
const IdentifierName = regexp(/[a-zA-Z]\w*/g, 'identifier')

// Utility. Tokens consume trailing whitespace; keywords require whitespace right after.
const token = <T>(parser: Parser<T>) => first(parser, Space)
const keyword = (word: string) => first(string(word), whitespace())

// Composites.
const SelectStatement = defer<Ast.SelectStatement>()
const SelectClause = defer<Ast.SelectClause>()
const FromClause = defer<Ast.FromClause>()
const WhereClause = defer<Ast.WhereClause>()
const Expression = defer<Ast.Expression>()
const AtomicExpression = defer<Ast.AtomicExpression>()
const Identifier = defer<Ast.Identifier>()
const IntegerLiteral = defer<Ast.IntegerLiteral>()

SelectStatement.with(
  map(sequence(SelectClause, FromClause, optional(WhereClause)), toSelectStatement),
)

SelectClause.with(
  map(
    last(keyword(Keywords.Select), sepBy1(Identifier, token(string(Terminals.Comma)))),
    toSelectClause,
  ),
)

FromClause.with(map(last(keyword(Keywords.From), Identifier), toFromClause))
WhereClause.with(map(last(keyword(Keywords.Where), Expression), toWhereClause))

Expression.with(
  map(
    sequence(
      AtomicExpression,
      token(choice(string(Terminals.GreaterThan), string(Terminals.LessThan))),
      AtomicExpression,
    ),
    toExpression,
  ),
)

AtomicExpression.with(choice(IntegerLiteral, Identifier))
Identifier.with(map(token(IdentifierName), toIdentifier))
IntegerLiteral.with(map(token(whole()), toIntegerLiteral))

/* Wrapper for bench runner. */

export function parse(text: string): Ast.SelectStatement {
  const result = run(SelectStatement).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}
