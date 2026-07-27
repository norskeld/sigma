---
title: 'Parser'
description: 'Parser is the interface every parser and combinator consumes and resolves to, together with the FAIL sentinel that signals a failure.'
order: 1
---

# Parser

`Parser<T>` is the interface every parser and combinator consumes and resolves to. Writing one by hand means writing a single `parse` method that reads from the [ParseContext] and returns either a value or [FAIL].

```ts
interface Parser<T> {
  parse(ctx: ParseContext): T | Fail
}
```

## Narrower shapes

Three narrower interfaces describe parsers whose outcome is known upfront. They only document intent, since `Parser<T>` accepts all of them anyway.

```ts
interface SucceedingParser<T> {
  parse(ctx: ParseContext): T
}

interface FailingParser {
  parse(ctx: ParseContext): Fail
}

interface UnsafeParser<T> {
  parse(ctx: ParseContext): T | Fail
}
```

`SucceedingParser` covers parsers that always succeed, such as [rest], [nothing], [syncTo] and [syncPast]. `FailingParser` covers [fail], which never succeeds. Repetition combinators like [many] are *not* succeeding parsers, because a [committed][commit] failure passes through them.

## FAIL

`FAIL` is the sentinel a parser returns instead of a value when it fails, and `Fail` is its type. It's a unique symbol, so it can never collide with a parsed value, and it must never be returned as one.

```ts
const FAIL: unique symbol
type Fail = typeof FAIL
```

A parser that returns `FAIL` must leave `pos` where it entered and describe its failure through [ParseContext]:

```ts
const Digit: Parser<string> = {
  parse(ctx) {
    const char = ctx.input[ctx.pos]

    if (char === undefined || char < '0' || char > '9') {
      return ctx.fail('digit')
    }

    ctx.pos++

    return char
  }
}
```

::: tip Success
```ts
run(Digit).with('7')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: '7'
}
```
:::

::: danger Failure
```ts
run(Digit).with('x')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'digit'
}
```
:::

## EMPTY_ERRORS

`EMPTY_ERRORS` is the shared frozen array a clean run reports as its `errors`, so a parse that recovered from nothing allocates nothing extra.

```ts
const EMPTY_ERRORS: ReadonlyArray<Failure>
```

<!-- Links. -->

[ParseContext]: ./context
[FAIL]: #fail
[Failure]: ./result

<!-- Parsers. -->

[fail]: ../parsers/fail
[nothing]: ../parsers/nothing
[rest]: ../parsers/rest

<!-- Combinators. -->

[commit]: ../combinators/commit
[many]: ../combinators/many
[syncPast]: ../combinators/syncPast
[syncTo]: ../combinators/syncTo
