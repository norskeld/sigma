---
title: 'tryRun'
description: 'tryRun is used to run parser with provided input, throwing an error on failure.'
---

# tryRun

`tryRun` is used to run `parser` with provided input, **throwing `ParserError` on failure**.

## Usage

```ts
tryRun(string('hello world')).with('hello world')
```

::: tip Success
```ts
{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: 'hello world',
  errors: []
}
```
:::

::: danger Failure
```ts
<ParserError>
```
:::

`ParserError` carries `span`, `pos`, the `label` set by [commit], and `errors`, holding the failures the run recovered from. A run that failed outright is described by the error itself, and that failure isn't repeated in `errors`.

`tryRun` is the strict entry point, so it throws even when every failure was recovered by [recover] and [run] would have returned `isOk: true`. The error is then built from the first recovered failure, with `errors` holding them all.

<!-- Links. -->

[commit]: ../combinators/commit
[recover]: ../combinators/recover
[run]: ./run
