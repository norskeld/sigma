import {
  choice,
  defer,
  float,
  inner,
  integer,
  map,
  optional,
  regexp,
  run,
  sepBy,
  sequence,
  string,
  whitespace,
} from '@nrsk/sigma'

import type * as Ast from './ast.ts'
import { decode } from './decode.ts'

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
} as const

/* Mapping functions to turn parsed string values into AST nodes. */

function toJsonObject(values: Array<Ast.JsonObjectProp>): Ast.JsonObject {
  return {
    type: 'object',
    values,
  }
}

function toJsonObjectProp(tuple: [Ast.JsonString, string, Ast.JsonValue]): Ast.JsonObjectProp {
  const [{ value: name }, _, value] = tuple

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

function toJsonString(text: string): Ast.JsonString {
  return {
    type: 'string',
    value: decode(text.slice(1, -1)),
  }
}

function toJsonNumber(value: number): Ast.JsonNumber {
  return {
    type: 'number',
    value: value,
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

// Non-Terminals.
const NumberLiteral = choice(float(), integer())
const Space = optional(whitespace())
const StringLiteral = regexp(/"(?:\\.|[^"\\])*"/g, 'string')

// Utility.
const keyword = (s: string) => inner(Space, string(s), Space)
const symbol = (s: string) => inner(Space, string(s), Space)

// Composites.
const JsonRoot = defer<Ast.JsonRoot>()
const JsonObject = defer<Ast.JsonObject>()
const JsonObjectProp = defer<Ast.JsonObjectProp>()
const JsonArray = defer<Ast.JsonArray>()
const JsonString = defer<Ast.JsonString>()
const JsonNumber = defer<Ast.JsonNumber>()
const JsonBoolean = defer<Ast.JsonBoolean>()
const JsonNull = defer<Ast.JsonNull>()
const JsonValue = defer<Ast.JsonValue>()

JsonRoot.with(choice(JsonObject, JsonArray))

JsonObject.with(
  map(
    inner(
      symbol(Terminals.OpenBrace),
      sepBy(JsonObjectProp, symbol(Terminals.Comma)),
      symbol(Terminals.CloseBrace),
    ),
    toJsonObject,
  ),
)

JsonObjectProp.with(map(sequence(JsonString, symbol(Terminals.Colon), JsonValue), toJsonObjectProp))

JsonArray.with(
  map(
    inner(
      symbol(Terminals.OpenSquare),
      sepBy(JsonValue, symbol(Terminals.Comma)),
      symbol(Terminals.CloseSquare),
    ),
    toJsonArray,
  ),
)

JsonNull.with(map(keyword(Keywords.Null), toJsonNull))
JsonString.with(map(StringLiteral, toJsonString))
JsonNumber.with(map(NumberLiteral, toJsonNumber))
JsonBoolean.with(map(choice(keyword(Keywords.True), keyword(Keywords.False)), toJsonBoolean))
JsonValue.with(choice(JsonObject, JsonArray, JsonString, JsonNumber, JsonBoolean, JsonNull))

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  const result = run(JsonRoot).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}
