export interface SelectStatement {
  type: 'statement'
  select: SelectClause
  from: FromClause
  where: WhereClause | null
}

export interface SelectClause {
  type: 'select'
  columns: Array<Identifier>
}

export interface FromClause {
  type: 'from'
  table: Identifier
}

export interface WhereClause {
  type: 'where'
  condition: Expression
}

export interface Expression {
  type: 'expression'
  lhs: AtomicExpression
  operator: RelationalOperator
  rhs: AtomicExpression
}

export interface Identifier {
  type: 'identifier'
  name: string
}

export interface IntegerLiteral {
  type: 'integer'
  value: number
}

export type AtomicExpression = Identifier | IntegerLiteral

export type RelationalOperator = '>' | '<'
