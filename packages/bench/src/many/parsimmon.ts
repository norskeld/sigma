import P from 'parsimmon'

const Parser = P.string('x!').many()

/* Wrapper for bench runner. */

export function parse(text: string): Array<string> {
  return Parser.tryParse(text)
}
