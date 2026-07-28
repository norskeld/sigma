---
title: 'syncNested'
description: 'syncNested combinator skips out of a region delimited by open and close, tracking nesting so an inner pair does not end the region early.'
---

# syncNested

`syncNested` combinator skips out of a region delimited by `open` and `close`, starting inside it and stopping after the `close` that balances it. Inner pairs are tracked, so a nested `close` doesn't end the region early. Resolves to `null`.

It starts at depth one, since [recover] hands the strategy a position *inside* the malformed construct and the enclosing `open` has therefore already been consumed. Every `open` it then meets raises the depth and every `close` lowers it.

Unlike [syncTo] and [syncPast] it can fail: the region has to close. That failure reports `nested region` and leaves the position where the combinator started.

Use it as a [recover] strategy for bracketed constructs, where skipping to the first `)` or `}` would end up in the middle of the enclosing one. The [error recovery] guide shows it recovering out of a nested block.

## Usage

```ts
const Parser = syncNested(string('('), string(')'))
```

::: tip Success
```ts
run(Parser).with('abc)rest')

{
  isOk: true,
  start: 0,
  end: 4,
  pos: 4,
  value: null
}
```
---
```ts
run(Parser).with('a(b)c)rest')

{
  isOk: true,
  start: 0,
  end: 6,
  pos: 6,
  value: null
}
```
:::

The inner `(b)` raises the depth and drops it again, so the region ends at the second `)` rather than the first one.

::: danger Failure
```ts
run(Parser).with('a(b)c')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'nested region'
}
```
:::

`close` is tried before `open`, so identical delimiters work too: `syncNested(string('"'), string('"'))` ends at the next quote instead of nesting forever.

A failing strategy leaves the original failure standing, so a `syncNested` used with [recover] recovers only where the delimiters balance. Pair it with a [choice] of strategies, falling back to [syncPast], when the input may be truncated.

<!-- Links. -->

[choice]: ./choice
[error recovery]: ../guides/error-recovery
[recover]: ./recover
[syncPast]: ./syncPast
[syncTo]: ./syncTo
