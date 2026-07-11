import { anyCharOf, anyStringOf, float, noCharOf, string, stringLen, whitespace } from 'parjs'
import {
  between,
  later,
  many,
  manySepBy,
  map,
  or,
  qthen,
  stringify,
  then,
  thenq,
} from 'parjs/combinators'

import type * as Ast from './ast'

/* Tokens. */

const Keywords = {
  True: 'true',
  False: 'false',
  Null: 'null',
} as const

const Terminals = {
  OpenBrace: '{',
  CloseBrace: '}',
  OpenSquare: '[',
  CloseSquare: ']',
  Colon: ':',
  Comma: ',',
  Quote: '"',
} as const

const Escapes: Record<string, string> = {
  '"': `"`,
  '\\': '\\',
  '/': '/',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
}

/* Mapping functions to turn parsed string values into AST nodes. */

function toJsonObject(values: Array<Ast.JsonObjectProp>): Ast.JsonObject {
  return {
    type: 'object',
    values,
  }
}

function toJsonObjectProp(tuple: [Ast.JsonString, Ast.JsonValue]): Ast.JsonObjectProp {
  const [{ value: name }, value] = tuple

  return {
    type: 'property',
    name,
    value,
  }
}

function toJsonArray(values: Array<Ast.JsonValue>): Ast.JsonArray {
  return {
    type: 'array',
    values,
  }
}

function toJsonString(value: string): Ast.JsonString {
  return {
    type: 'string',
    value,
  }
}

function toJsonNumber(value: number): Ast.JsonNumber {
  return {
    type: 'number',
    value,
  }
}

function toJsonBoolean(kind: string): Ast.JsonBoolean {
  switch (kind) {
    case Keywords.True: {
      return {
        type: 'boolean',
        value: true,
      }
    }

    case Keywords.False: {
      return {
        type: 'boolean',
        value: false,
      }
    }

    default: {
      return {
        type: 'boolean',
        value: false,
      }
    }
  }
}

function toJsonNull(): Ast.JsonNull {
  return {
    type: 'null',
    value: null,
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
      map((x) => String.fromCharCode(x)),
    ),
  ),
)

const pEscapeAny = string('\\').pipe(qthen(pEscapeChar.pipe(or(pEscapeUnicode))))
const pCharOrEscape = pEscapeAny.pipe(or(noCharOf(Terminals.Quote)))
const pString = pCharOrEscape.pipe(many(), stringify(), between(Terminals.Quote))
const pJsonString = pString.pipe(map(toJsonString))
const pBool = anyStringOf(Keywords.True, Keywords.False).pipe(map(toJsonBoolean))
const pNull = string(Keywords.Null).pipe(map(toJsonNull))
const pNumber = float().pipe(map(toJsonNumber))

const pArray = pJsonValue.pipe(
  manySepBy(Terminals.Comma),
  between(Terminals.OpenSquare, Terminals.CloseSquare),
  map(toJsonArray),
)

const pObjectProperty = pString.pipe(
  thenq(string(Terminals.Colon).pipe(between(whitespace()))),
  then(pJsonValue),
  between(whitespace()),
  map(([name, value]) => toJsonObjectProp([toJsonString(name), value])),
)

const pObject = pObjectProperty.pipe(
  manySepBy(Terminals.Comma),
  between(Terminals.OpenBrace, Terminals.CloseBrace),
  map(toJsonObject),
)

pJsonValue.init(
  pJsonString.pipe(or(pNull, pNumber, pBool), or(pArray, pObject), between(whitespace())),
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
    values: [],
  }
}
