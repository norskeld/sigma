import { choice, sepBy, map, takeMid, optional, sequence } from '@nrsk/sigma/combinators'
import { defer, float, int, regexp, run, string, whitespace } from '@nrsk/sigma/parsers'

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
  Comma: ','
} as const

/* Mapping functions to turn parsed string values into AST nodes. */

function toObject(values: Array<Ast.JsonObjectProp>): Ast.JsonObject {
  return {
    type: 'object',
    values
  }
}

function toObjectProp(tuple: [Ast.JsonString, string, Ast.JsonValue]): Ast.JsonObjectProp {
  const [{ value: name }, _, value] = tuple

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

function toString(text: string): Ast.JsonString {
  return {
    type: 'string',
    value: text.slice(1, -1)
  }
}

function toNumber(value: number): Ast.JsonNumber {
  return {
    type: 'number',
    value: value
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

// Non-Terminals.
const NumberLiteral = choice(float(), int())

const Space = optional(whitespace())
const StringLiteral = regexp(/"([^"]|\\.)*"/g, 'string')

// Utility.
const match = (match: string) => takeMid(Space, string(match), Space)

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
    takeMid(
      match(Terminals.OpenBrace),
      sepBy(JsonObjectProp, match(Terminals.Comma)),
      match(Terminals.CloseBrace)
    ),
    toObject
  )
)

JsonObjectProp.with(map(sequence(JsonString, match(Terminals.Colon), JsonValue), toObjectProp))

JsonArray.with(
  map(
    takeMid(
      match(Terminals.OpenSquare),
      sepBy(JsonValue, match(Terminals.Comma)),
      match(Terminals.CloseSquare)
    ),
    toArray
  )
)

JsonNull.with(map(match(Keywords.Null), toNull))

JsonString.with(map(StringLiteral, toString))

JsonNumber.with(map(NumberLiteral, toNumber))

JsonBoolean.with(map(choice(match(Keywords.True), match(Keywords.False)), toBoolean))

JsonValue.with(choice(JsonObject, JsonArray, JsonString, JsonNumber, JsonBoolean, JsonNull))

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  const result = run(JsonRoot).with(text)

  switch (result.kind) {
    case 'success': {
      return result.value
    }

    case 'failure': {
      return {
        type: 'object',
        values: []
      }
    }
  }
}
