---
title: 'Result'
description: 'Result is what run returns: a Success with the parsed value, or a Failure that says what went wrong. Both list the failures the run recovered from.'
order: 2
---

# Result

`Result<T>` is what [run] returns. It's a union discriminated by `isOk`, so narrowing on that field gives access to either `value` or `expected`.

```ts
type Result<T> = Success<T> | Failure
```

## Success

```ts
type Success<T> = {
  readonly isOk: true
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly value: T
  readonly errors: ReadonlyArray<Failure>
}
```

`start` is always `0` and `end` is where the parser stopped, which equals `pos`. A run that stopped early is still a success, so pair the top-level parser with [eof] to require the whole input.

`errors` holds the failures the run [recovered][recover] from. A non-empty `errors` means the parse is partial: the value is usable, and each entry describes a syntax error.

## Failure

```ts
type Failure = {
  readonly isOk: false
  readonly start: number
  readonly end: number
  readonly pos: number
  readonly expected: string
  readonly label: string | null
  readonly errors: ReadonlyArray<Failure>
}
```

`pos` is where the failure is reported, while `start` and `end` span what should have been there. The span can reach past `pos`, because a parser reports what it wanted to see. It's clamped to the end of input.

`expected` is what the failed parser wanted, and `label` is the name attached by [commit], or `null` when nothing was committed. `errors` is empty on failures nested inside another result, so only the top-level result lists what was recovered.

## Span

`Span` is the range a value covers in the input. [map] hands one to its callback, and [ParserError] exposes the failing range as one.

```ts
interface Span {
  readonly start: number
  readonly end: number
}
```

## ParserError

`ParserError` is what [tryRun] throws. Its `message` is the `expected` string, and `name` is `ParserError`.

```ts
class ParserError extends Error {
  readonly name = 'ParserError'
  readonly span: Span
  readonly pos: number
  readonly label: string | null
  readonly errors: ReadonlyArray<Failure>
}
```

<!-- Links. -->

[ParserError]: #parsererror

<!-- Core. -->

[eof]: ../parsers/eof
[run]: ../core/run
[tryRun]: ../core/tryRun

<!-- Combinators. -->

[commit]: ../combinators/commit
[map]: ../combinators/map
[recover]: ../combinators/recover
