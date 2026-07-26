---
title: 'syncTo'
description: "syncTo combinator consumes input until sync matches, stopping before it, or at the end of input if it never matches. Never fails."
---

# syncTo

`syncTo` combinator consumes input until `sync` matches, stopping *before* it, or at the end of input if `sync` never matches. Resolves to `null` and never fails.

A match at the starting position counts, so nothing is consumed when the cursor already sits on the resynchronisation point. That is what you want under [recover], which starts the scan on un-consumed input: the code point the parser rejected is still a candidate for the scan.

Use it as a [recover] strategy when `sync` belongs to the next construct and has to be left in place, such as a keyword that starts the following statement. Use [syncPast] when `sync` terminates the malformed construct instead.

Because it can stop without consuming anything, `syncTo` on its own doesn't guarantee that a [recover] inside [many] makes progress; [syncPast] carries the stronger guarantee. See [recover] for when each one advances.

Scanning advances by whole code points, so surrogate pairs are never split.

The [error recovery] guide works through choosing between the two on a real grammar.

## Usage

```ts
const Parser = syncTo(string(';'))
```

::: tip Success
```ts
run(Parser).with('abc;rest')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
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

With `;;` the resynchronisation point sits at the entry position, so the scan stops right there.

::: tip Success
```ts
run(Parser).with(';;')

{
  isOk: true,
  start: 0,
  end: 0,
  pos: 0,
  value: null
}
```
:::

The scan applies `sync` speculatively, so the sync parser's own commitments and errors don't leak into the surrounding parse.

<!-- Links. -->

[error recovery]: ../guides/error-recovery
[many]: ./many
[recover]: ./recover
[syncPast]: ./syncPast
