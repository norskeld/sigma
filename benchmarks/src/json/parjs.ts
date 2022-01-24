import { anyStringOf, float, string, stringLen, anyCharOf, noCharOf, whitespace } from 'parjs'
import {
  later,
  many,
  manySepBy,
  map,
  or,
  stringify,
  qthen,
  thenq,
  then,
  between
} from 'parjs/combinators'

import * as Ast from './ast'

/* Tokens. */

const Keywords = {
  True: 'true',
  False: 'false',
  Null: 'null'
} as const

const Terminals = {
  OpenBrace: '{',
  CloseBrace: '}',
  OpenSquare: '[',
  CloseSquare: ']',
  Colon: ':',
  Comma: ',',
  Quote: '"'
} as const

const Escapes: Record<string, string> = {
  '"': `"`,
  '\\': '\\',
  '/': '/',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t'
}

/* Mapping functions to turn parsed string values into AST nodes. */

function toObject(values: Array<Ast.JsonObjectProp>): Ast.JsonObject {
  return {
    type: 'object',
    values
  }
}

function toObjectProp(tuple: [Ast.JsonString, Ast.JsonValue]): Ast.JsonObjectProp {
  const [{ value: name }, value] = tuple

  return {
    type: 'property',
    name,
    value
  }
}

function toArray(values: Array<Ast.JsonValue>): Ast.JsonArray {
  return {
    type: 'array',
    values
  }
}

function toString(value: string): Ast.JsonString {
  return {
    type: 'string',
    value
  }
}

function toNumber(value: number): Ast.JsonNumber {
  return {
    type: 'number',
    value
  }
}

function toBoolean(kind: string): Ast.JsonBoolean {
  switch (kind) {
    case Keywords.True: {
      return {
        type: 'boolean',
        value: true
      }
    }

    case Keywords.False: {
      return {
        type: 'boolean',
        value: false
      }
    }

    default: {
      return {
        type: 'boolean',
        value: false
      }
    }
  }
}

function toNull(): Ast.JsonNull {
  return {
    type: 'null',
    value: null
  }
}

/* Parsers. */

const pJsonValue = later<Ast.JsonValue>()
const pJsonRoot = later<Ast.JsonRoot>()

const pEscapeChar = anyCharOf(Object.keys(Escapes).join()).pipe(map((char) => Escapes[char]))

const pEscapeUnicode = string('u').pipe(
  qthen(
    stringLen(4).pipe(
      map((str) => parseInt(str, 16)),
      map((x) => String.fromCharCode(x))
    )
  )
)

const pEscapeAny = string('\\').pipe(qthen(pEscapeChar.pipe(or(pEscapeUnicode))))
const pCharOrEscape = pEscapeAny.pipe(or(noCharOf(Terminals.Quote)))
const pString = pCharOrEscape.pipe(many(), stringify(), between(Terminals.Quote))
const pJsonString = pString.pipe(map(toString))
const pBool = anyStringOf(Keywords.True, Keywords.False).pipe(map(toBoolean))
const pNull = string(Keywords.Null).pipe(map(toNull))
const pNumber = float().pipe(map(toNumber))

const pArray = pJsonValue.pipe(
  manySepBy(Terminals.Comma),
  between(Terminals.OpenSquare, Terminals.CloseSquare),
  map(toArray)
)

const pObjectProperty = pString.pipe(
  thenq(string(Terminals.Colon).pipe(between(whitespace()))),
  then(pJsonValue),
  between(whitespace()),
  map(([name, value]) => toObjectProp([toString(name), value]))
)

const pObject = pObjectProperty.pipe(
  manySepBy(Terminals.Comma),
  between(Terminals.OpenBrace, Terminals.CloseBrace),
  map(toObject)
)

pJsonValue.init(
  pJsonString.pipe(or(pNull, pNumber, pBool), or(pArray, pObject), between(whitespace()))
)

pJsonRoot.init(pArray.pipe(or(pObject), between(whitespace())))

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  const result = pJsonRoot.parse(text)

  if (result.kind === 'OK') {
    return result.value
  }

  return {
    type: 'object',
    values: []
  }
}
