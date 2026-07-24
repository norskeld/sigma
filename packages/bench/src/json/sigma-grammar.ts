import type { Parser } from '@nrsk/sigma'
import {
  choice,
  float,
  grammar,
  integer,
  map,
  optional,
  regexp,
  run,
  sepBy,
  sequence,
  string,
  takeMid,
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
const keyword = (s: string) => takeMid(Space, string(s), Space)
const symbol = (s: string) => takeMid(Space, string(s), Space)

// Grammar.
const Json = grammar({
  Root(): Parser<Ast.JsonRoot> {
    return choice(this.Object, this.Array)
  },
  Object(): Parser<Ast.JsonObject> {
    return map(
      takeMid(
        symbol(Terminals.OpenBrace),
        sepBy(this.ObjectProp, symbol(Terminals.Comma)),
        symbol(Terminals.CloseBrace),
      ),
      toJsonObject,
    )
  },
  ObjectProp(): Parser<Ast.JsonObjectProp> {
    return map(sequence(this.String, symbol(Terminals.Colon), this.Value), toJsonObjectProp)
  },
  Array(): Parser<Ast.JsonArray> {
    return map(
      takeMid(
        symbol(Terminals.OpenSquare),
        sepBy(this.Value, symbol(Terminals.Comma)),
        symbol(Terminals.CloseSquare),
      ),
      toJsonArray,
    )
  },
  String(): Parser<Ast.JsonString> {
    return map(StringLiteral, toJsonString)
  },
  Number(): Parser<Ast.JsonNumber> {
    return map(NumberLiteral, toJsonNumber)
  },
  Boolean(): Parser<Ast.JsonBoolean> {
    return map(choice(keyword(Keywords.True), keyword(Keywords.False)), toJsonBoolean)
  },
  Null(): Parser<Ast.JsonNull> {
    return map(keyword(Keywords.Null), toJsonNull)
  },
  Value(): Parser<Ast.JsonValue> {
    return choice(this.Object, this.Array, this.String, this.Number, this.Boolean, this.Null)
  },
})

/* Wrapper for bench runner. */

export function parse(text: string): Ast.JsonRoot {
  const result = run(Json.Root).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}
