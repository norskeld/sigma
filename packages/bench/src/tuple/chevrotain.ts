import type { IOrAlt } from 'chevrotain'
import { EmbeddedActionsParser, Lexer, createToken } from 'chevrotain'

import type * as Ast from './ast.ts'

/* Tokens. */

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
  line_breaks: true,
})

const Integer = createToken({ name: 'Integer', pattern: /-?\d+/ })
const OpenParen = createToken({ name: 'OpenParen', pattern: '(' })
const CloseParen = createToken({ name: 'CloseParen', pattern: ')' })
const Comma = createToken({ name: 'Comma', pattern: ',' })

const tokens = [WhiteSpace, Integer, OpenParen, CloseParen, Comma]

const lexer = new Lexer(tokens, { positionTracking: 'onlyOffset' })

/* Parser. */

class TupleParser extends EmbeddedActionsParser {
  // Cached OR alternatives, as recommended by the chevrotain performance guide.
  private c0?: Array<IOrAlt<Ast.NumberNode | Ast.ListNode>>

  constructor() {
    super(tokens)
    this.performSelfAnalysis()
  }

  public list = this.RULE('list', (): Ast.ListNode => {
    const value: Array<Ast.NumberNode | Ast.ListNode> = []

    this.CONSUME(OpenParen)
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => value.push(this.SUBRULE(this.item)),
    })
    this.CONSUME(CloseParen)

    return { type: 'list', value }
  })

  private item = this.RULE('item', (): Ast.NumberNode | Ast.ListNode => {
    return this.OR(
      this.c0 ??
        (this.c0 = [
          {
            ALT: () => {
              const token = this.CONSUME(Integer)
              return { type: 'number', value: +token.image }
            },
          },
          { ALT: () => this.SUBRULE(this.list) },
        ]),
    )
  })
}

const parser = new TupleParser()

/* Wrapper for bench runner. */

export function parse(text: string): Ast.ListNode {
  const lexed = lexer.tokenize(text)

  if (lexed.errors.length > 0) {
    throw new Error(`chevrotain lexer failed: ${lexed.errors[0].message}`)
  }

  parser.input = lexed.tokens
  const value = parser.list()

  if (parser.errors.length > 0) {
    throw new Error(`chevrotain parser failed: ${parser.errors[0].message}`)
  }

  return value
}
