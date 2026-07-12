import P from 'parsimmon'

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

interface SelectLanguage {
  Statement: Ast.SelectStatement
  SelectClause: Ast.SelectClause
  FromClause: Ast.FromClause
  WhereClause: Ast.WhereClause
  Expression: Ast.Expression
  AtomicExpression: Ast.AtomicExpression
  Identifier: Ast.Identifier
  IntegerLiteral: Ast.IntegerLiteral
}

function token<T>(parser: P.Parser<T>): P.Parser<T> {
  return parser.skip(P.optWhitespace)
}

function keyword(word: string): P.Parser<string> {
  return P.string(word).skip(P.whitespace)
}

const Select = P.createLanguage<SelectLanguage>({
  Statement: (r) => {
    return P.seq(r.SelectClause, r.FromClause, r.WhereClause.fallback(null)).map(toSelectStatement)
  },

  SelectClause: (r) => {
    return keyword(Keywords.Select)
      .then(r.Identifier.sepBy1(token(P.string(Terminals.Comma))))
      .map(toSelectClause)
  },

  FromClause: (r) => {
    return keyword(Keywords.From).then(r.Identifier).map(toFromClause)
  },

  WhereClause: (r) => {
    return keyword(Keywords.Where).then(r.Expression).map(toWhereClause)
  },

  Expression: (r) => {
    return P.seq(
      r.AtomicExpression,
      token(P.alt(P.string(Terminals.GreaterThan), P.string(Terminals.LessThan))),
      r.AtomicExpression,
    ).map(toExpression)
  },

  AtomicExpression: (r) => {
    return P.alt<Ast.AtomicExpression>(r.IntegerLiteral, r.Identifier)
  },

  Identifier: () => {
    return token(P.regexp(/[a-zA-Z]\w*/)).map(toIdentifier)
  },

  IntegerLiteral: () => {
    return token(P.regexp(/0|[1-9]\d*/)).map((value) => toIntegerLiteral(Number(value)))
  },
})

/* Wrapper for bench runner. */

export function parse(text: string): Ast.SelectStatement {
  return Select.Statement.tryParse(text)
}
