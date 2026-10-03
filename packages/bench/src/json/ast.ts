export interface JsonObject {
  type: 'object'
  values: Array<JsonObjectProp>
}

export interface JsonObjectProp {
  type: 'property'
  name: string
  value: JsonValue
}

export interface JsonArray {
  type: 'array'
  values: Array<JsonValue>
}

export interface JsonString {
  type: 'string'
  value: string
}

export interface JsonNumber {
  type: 'number'
  value: number
}

export interface JsonBoolean {
  type: 'boolean'
  value: boolean
}

export interface JsonNull {
  type: 'null'
  value: null
}

export type JsonValue = JsonObject | JsonArray | JsonString | JsonNumber | JsonBoolean | JsonNull
export type JsonRoot = JsonObject | JsonArray
