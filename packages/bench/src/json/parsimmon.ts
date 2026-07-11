import P from 'parsimmon'

import type * as Ast from './ast.ts'
import { decode } from './decode.ts'

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
    value: decode(value),
  }
}

function toJsonNumber(value: string): Ast.JsonNumber {
  return {
    type: 'number',
    value: Number(value),
  }
}

function toJsonBoolean(value: boolean): Ast.JsonBoolean {
  return {
    type: 'boolean',
    value,
  }
}

function toJsonNull(): Ast.JsonNull {
  return {
    type: 'null',
    value: null,
  }
}

/* Parsers. */

interface JsonLanguage {
  Root: Ast.JsonRoot
  Value: Ast.JsonValue
  Object: Ast.JsonObject
  ObjectProp: Ast.JsonObjectProp
  Array: Ast.JsonArray
  String: Ast.JsonString
  Number: Ast.JsonNumber
  Boolean: Ast.JsonBoolean
  Null: Ast.JsonNull
}

function token<T>(parser: P.Parser<T>): P.Parser<T> {
  return parser.skip(P.optWhitespace)
}

const Json = P.createLanguage<JsonLanguage>({
  Root: (r) => P.alt<Ast.JsonRoot>(r.Object, r.Array).trim(P.optWhitespace),

  Value: (r) => {
    return P.alt<Ast.JsonValue>(r.Object, r.Array, r.String, r.Number, r.Boolean, r.Null)
  },

  Object: (r) => {
    return r.ObjectProp.sepBy(token(P.string(',')))
      .wrap(token(P.string('{')), P.string('}'))
      .map(toJsonObject)
      .thru(token)
  },

  ObjectProp: (r) => {
    return P.seq(r.String.skip(token(P.string(':'))), r.Value).map(toJsonObjectProp)
  },

  Array: (r) => {
    return r.Value.sepBy(token(P.string(',')))
      .wrap(token(P.string('[')), P.string(']'))
      .map(toJsonArray)
      .thru(token)
  },

  String: () => {
    return token(P.regexp(/"((?:\\.|[^"\\])*)"/, 1)).map(toJsonString)
  },

  Number: () => {
    return token(P.regexp(/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/)).map(toJsonNumber)
  },

  Boolean: () => {
    return token(P.alt(P.string('true').result(true), P.string('false').result(false))).map(
      toJsonBoolean,
    )
  },

  Null: () => {
    return token(P.string('null')).map(toJsonNull)
  },
})

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  return Json.Root.tryParse(text)
}
