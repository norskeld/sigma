---
title: 'syncPast'
description: "syncPast combinator consumes input until sync matches, consuming the match too, or stopping at the end of input if it never matches. Never fails."
---

# syncPast

`syncPast` combinator consumes input until `sync` matches, consuming the match as well, or stops at the end of input if `sync` never matches. Resolves to `null` and never fails.

Like [syncTo] it advances by whole code points and applies `sync` speculatively, so surrogate pairs are never split and the sync parser's own commitments and errors don't leak into the surrounding parse. The only difference is where it leaves the position: [syncTo] stops before the match, `syncPast` stops after it.

Consuming the match means it always advances unless the cursor is already at the end of the input, which is what guarantees a [recover] inside a repetition combinator makes progress.

Use it as a [recover] strategy when `sync` terminates the malformed construct rather than starting the next one, such as the `;` ending a statement.

The [error recovery] guide works through choosing between the two on a real grammar.

## Usage

```ts
const Parser = syncPast(string(';'))
```

::: tip Success
```ts
run(Parser).with('abc;rest')

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
run(Parser).with('abc')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: null
}
```
:::

On `;;` the resynchronisation point sits at the entry position, so only that first `;` is consumed.

::: tip Success
```ts
run(Parser).with(';;')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: null
}
```
:::

<!-- Links. -->

[error recovery]: ../guides/error-recovery
[recover]: ./recover
[syncTo]: ./syncTo
