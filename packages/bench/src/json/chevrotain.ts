import type { IOrAlt } from 'chevrotain'
import { EmbeddedActionsParser, Lexer, createToken } from 'chevrotain'

import type * as Ast from './ast.ts'
import { decode } from './decode.ts'

/* Tokens, following the official JSON grammar example. */

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
  line_breaks: true,
})

const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/,
})

const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/,
})

const OpenBrace = createToken({ name: 'OpenBrace', pattern: '{' })
const CloseBrace = createToken({ name: 'CloseBrace', pattern: '}' })
const OpenSquare = createToken({ name: 'OpenSquare', pattern: '[' })
const CloseSquare = createToken({ name: 'CloseSquare', pattern: ']' })
const Colon = createToken({ name: 'Colon', pattern: ':' })
const Comma = createToken({ name: 'Comma', pattern: ',' })
const True = createToken({ name: 'True', pattern: 'true' })
const False = createToken({ name: 'False', pattern: 'false' })
const Null = createToken({ name: 'Null', pattern: 'null' })

const tokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  OpenBrace,
  CloseBrace,
  OpenSquare,
  CloseSquare,
  Colon,
  Comma,
  True,
  False,
  Null,
]

const lexer = new Lexer(tokens, { positionTracking: 'onlyOffset' })

/* Parser. */

class JsonParser extends EmbeddedActionsParser {
  // Cached OR alternatives, as recommended by the chevrotain performance guide.
  private c0?: Array<IOrAlt<Ast.JsonRoot>>
  private c1?: Array<IOrAlt<Ast.JsonValue>>

  constructor() {
    super(tokens)
    this.performSelfAnalysis()
  }

  public root = this.RULE('root', (): Ast.JsonRoot => {
    return this.OR(
      this.c0 ??
        (this.c0 = [
          { ALT: () => this.SUBRULE(this.object) },
          { ALT: () => this.SUBRULE(this.array) },
        ]),
    )
  })

  private object = this.RULE('object', (): Ast.JsonObject => {
    const values: Array<Ast.JsonObjectProp> = []

    this.CONSUME(OpenBrace)
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => values.push(this.SUBRULE(this.objectProp)),
    })
    this.CONSUME(CloseBrace)

    return { type: 'object', values }
  })

  private objectProp = this.RULE('objectProp', (): Ast.JsonObjectProp => {
    const name = this.CONSUME(StringLiteral)
    this.CONSUME(Colon)
    const value = this.SUBRULE(this.value)

    return { type: 'property', name: decode(name.image.slice(1, -1)), value }
  })

  private array = this.RULE('array', (): Ast.JsonArray => {
    const values: Array<Ast.JsonValue> = []

    this.CONSUME(OpenSquare)
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => values.push(this.SUBRULE(this.value)),
    })
    this.CONSUME(CloseSquare)

    return { type: 'array', values }
  })

  private value = this.RULE('value', (): Ast.JsonValue => {
    return this.OR(
      this.c1 ??
        (this.c1 = [
          {
            ALT: () => {
              const token = this.CONSUME(StringLiteral)
              return { type: 'string', value: decode(token.image.slice(1, -1)) }
            },
          },
          {
            ALT: () => {
              const token = this.CONSUME(NumberLiteral)
              return { type: 'number', value: Number(token.image) }
            },
          },
          { ALT: () => this.SUBRULE(this.object) },
          { ALT: () => this.SUBRULE(this.array) },
          {
            ALT: () => {
              this.CONSUME(True)
              return { type: 'boolean', value: true }
            },
          },
          {
            ALT: () => {
              this.CONSUME(False)
              return { type: 'boolean', value: false }
            },
          },
          {
            ALT: () => {
              this.CONSUME(Null)
              return { type: 'null', value: null }
            },
          },
        ]),
    )
  })
}

const parser = new JsonParser()

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  const lexed = lexer.tokenize(text)

  if (lexed.errors.length > 0) {
    throw new Error(`chevrotain lexer failed: ${lexed.errors[0].message}`)
  }

  parser.input = lexed.tokens
  const value = parser.root()

  if (parser.errors.length > 0) {
    throw new Error(`chevrotain parser failed: ${parser.errors[0].message}`)
  }

  return value
}
