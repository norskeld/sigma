import type { IOrAlt } from 'chevrotain'
import { EmbeddedActionsParser, Lexer, createToken } from 'chevrotain'

import type * as Ast from './ast.ts'

/* Tokens, following the official chevrotain tutorial grammar. */

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
  line_breaks: true,
})

const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ })
const Select = createToken({ name: 'Select', pattern: /SELECT/, longer_alt: Identifier })
const From = createToken({ name: 'From', pattern: /FROM/, longer_alt: Identifier })
const Where = createToken({ name: 'Where', pattern: /WHERE/, longer_alt: Identifier })
const Comma = createToken({ name: 'Comma', pattern: ',' })
const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ })
const GreaterThan = createToken({ name: 'GreaterThan', pattern: '>' })
const LessThan = createToken({ name: 'LessThan', pattern: '<' })

const tokens = [WhiteSpace, Select, From, Where, Comma, Identifier, Integer, GreaterThan, LessThan]

const lexer = new Lexer(tokens, { positionTracking: 'onlyOffset' })

/* Parser. */

class SelectParser extends EmbeddedActionsParser {
  // Cached OR alternatives, as recommended by the chevrotain performance guide.
  private c0?: Array<IOrAlt<Ast.RelationalOperator>>
  private c1?: Array<IOrAlt<Ast.AtomicExpression>>

  constructor() {
    super(tokens)
    this.performSelfAnalysis()
  }

  public statement = this.RULE('statement', (): Ast.SelectStatement => {
    const select = this.SUBRULE(this.selectClause)
    const from = this.SUBRULE(this.fromClause)
    const where = this.OPTION(() => this.SUBRULE(this.whereClause)) ?? null

    return { type: 'statement', select, from, where }
  })

  private selectClause = this.RULE('selectClause', (): Ast.SelectClause => {
    const columns: Array<Ast.Identifier> = []

    this.CONSUME(Select)
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => {
        const token = this.CONSUME(Identifier)
        columns.push({ type: 'identifier', name: token.image })
      },
    })

    return { type: 'select', columns }
  })

  private fromClause = this.RULE('fromClause', (): Ast.FromClause => {
    this.CONSUME(From)
    const token = this.CONSUME(Identifier)

    return { type: 'from', table: { type: 'identifier', name: token.image } }
  })

  private whereClause = this.RULE('whereClause', (): Ast.WhereClause => {
    this.CONSUME(Where)
    const condition = this.SUBRULE(this.expression)

    return { type: 'where', condition }
  })

  private expression = this.RULE('expression', (): Ast.Expression => {
    const lhs = this.SUBRULE(this.atomicExpression)

    const operator = this.OR(
      this.c0 ??
        (this.c0 = [
          {
            ALT: () => {
              this.CONSUME(GreaterThan)
              return '>'
            },
          },
          {
            ALT: () => {
              this.CONSUME(LessThan)
              return '<'
            },
          },
        ]),
    )

    const rhs = this.SUBRULE2(this.atomicExpression)

    return { type: 'expression', lhs, operator, rhs }
  })

  private atomicExpression = this.RULE('atomicExpression', (): Ast.AtomicExpression => {
    return this.OR(
      this.c1 ??
        (this.c1 = [
          {
            ALT: () => {
              const token = this.CONSUME(Integer)
              return { type: 'integer', value: +token.image }
            },
          },
          {
            ALT: () => {
              const token = this.CONSUME(Identifier)
              return { type: 'identifier', name: token.image }
            },
          },
        ]),
    )
  })
}

const parser = new SelectParser()

/* Wrapper for bench runner. */

export function parse(text: string): Ast.SelectStatement {
  const lexed = lexer.tokenize(text)

  if (lexed.errors.length > 0) {
    throw new Error(`chevrotain lexer failed: ${lexed.errors[0].message}`)
  }

  parser.input = lexed.tokens
  const value = parser.statement()

  if (parser.errors.length > 0) {
    throw new Error(`chevrotain parser failed: ${parser.errors[0].message}`)
  }

  return value
}
