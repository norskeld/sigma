/** Parsers of this type always succeed. */
export interface SafeParser<T> {
  parse(input: string, pos: number): Success<T>
}

/** Parsers of this type may fail. */
export interface UnsafeParser<T> {
  parse(input: string, pos: number): Result<T>
}

export type Parser<T> = SafeParser<T> | UnsafeParser<T>

export type Failure = {
  readonly isOk: false
  readonly pos: number
  readonly expected: string
}

export type Success<T> = {
  readonly isOk: true
  readonly pos: number
  readonly value: T
}

export type Result<T> = Success<T> | Failure
