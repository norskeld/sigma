import { SAMPLE } from './@sample.ts'
import type * as Ast from './ast.ts'

function toAst(value: unknown): Ast.JsonValue {
  if (value === null) {
    return { type: 'null', value: null }
  }

  switch (typeof value) {
    case 'string': {
      return { type: 'string', value }
    }

    case 'number': {
      return { type: 'number', value }
    }

    case 'boolean': {
      return { type: 'boolean', value }
    }
  }

  if (Array.isArray(value)) {
    return { type: 'array', values: value.map(toAst) }
  }

  if (typeof value === 'object') {
    return {
      type: 'object',
      values: Object.entries(value).map(([name, prop]) => ({
        type: 'property',
        name,
        value: toAst(prop),
      })),
    }
  }

  throw new Error(`Unsupported JSON value: ${String(value)}.`)
}

/** Ground-truth AST derived from `JSON.parse`. */
export const EXPECTED: Ast.JsonRoot = toAst(JSON.parse(SAMPLE)) as Ast.JsonRoot
