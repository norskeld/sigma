import { EmbeddedActionsParser, Lexer, createToken } from 'chevrotain'

/* Tokens. */

const Token = createToken({ name: 'Token', pattern: 'x!' })

const tokens = [Token]

const lexer = new Lexer(tokens, { positionTracking: 'onlyOffset' })

/* Parser. */

class ManyParser extends EmbeddedActionsParser {
  constructor() {
    super(tokens)
    this.performSelfAnalysis()
  }

  public items = this.RULE('items', (): Array<string> => {
    const value: Array<string> = []

    this.MANY(() => {
      value.push(this.CONSUME(Token).image)
    })

    return value
  })
}

const parser = new ManyParser()

/* Wrapper for bench runner. */

export function parse(text: string): Array<string> {
  const lexed = lexer.tokenize(text)

  if (lexed.errors.length > 0) {
    throw new Error(`chevrotain lexer failed: ${lexed.errors[0].message}`)
  }

  parser.input = lexed.tokens
  const value = parser.items()

  if (parser.errors.length > 0) {
    throw new Error(`chevrotain parser failed: ${parser.errors[0].message}`)
  }

  return value
}
