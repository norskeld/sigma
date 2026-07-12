import type { Parser } from '@nrsk/sigma'
import {
  choice,
  grammar,
  map,
  optional,
  regexp,
  run,
  sepBy1,
  sequence,
  string,
  takeLeft,
  takeRight,
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
const token = <T>(parser: Parser<T>) => takeLeft(parser, Space)
const keyword = (word: string) => takeLeft(string(word), whitespace())

// Grammar.
const Select = grammar({
  Statement(): Parser<Ast.SelectStatement> {
    return map(
      sequence(this.SelectClause, this.FromClause, optional(this.WhereClause)),
      toSelectStatement,
    )
  },

  SelectClause(): Parser<Ast.SelectClause> {
    return map(
      takeRight(keyword(Keywords.Select), sepBy1(this.Identifier, token(string(Terminals.Comma)))),
      toSelectClause,
    )
  },

  FromClause(): Parser<Ast.FromClause> {
    return map(takeRight(keyword(Keywords.From), this.Identifier), toFromClause)
  },

  WhereClause(): Parser<Ast.WhereClause> {
    return map(takeRight(keyword(Keywords.Where), this.Expression), toWhereClause)
  },

  Expression(): Parser<Ast.Expression> {
    return map(
      sequence(
        this.AtomicExpression,
        token(choice(string(Terminals.GreaterThan), string(Terminals.LessThan))),
        this.AtomicExpression,
      ),
      toExpression,
    )
  },

  AtomicExpression(): Parser<Ast.AtomicExpression> {
    return choice(this.IntegerLiteral, this.Identifier)
  },

  Identifier(): Parser<Ast.Identifier> {
    return map(token(IdentifierName), toIdentifier)
  },

  IntegerLiteral(): Parser<Ast.IntegerLiteral> {
    return map(token(whole()), toIntegerLiteral)
  },
})

/* Wrapper for bench runner. */

export function parse(text: string): Ast.SelectStatement {
  const result = run(Select.Statement).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}
