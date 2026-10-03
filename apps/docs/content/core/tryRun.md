---
title: 'tryRun'
description: 'tryRun is used to run parser with provided input, throwing an error on failure.'
---

# tryRun

`tryRun` is used to run `parser` with provided input, **throwing `ParserError` on failure**.

## Usage

::: tip Success
```ts
tryRun(string('hello world')).with('hello world')

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
tryRun(string('hello world')).with('bye')

ParserError {
  name: 'ParserError',
  message: 'hello world',
  span: { start: 0, end: 3 },
  pos: 0,
  label: null,
  errors: []
}
```
:::

`ParserError` sets `name` to `ParserError` and `message` to what the parser expected. It also carries `span`, `pos`, the `label` set by [commit], and `errors`, which holds the failures the run recovered from. A run that failed outright is described by the error itself, and that failure isn't repeated in `errors`.

`tryRun` is the strict entry point, so it throws even when every failure was recovered by [recover] and [run] would have returned `isOk: true`. The error is then built from the first recovered failure, with `errors` holding them all.

<!-- Links. -->

[commit]: ../combinators/commit
[recover]: ../combinators/recover
[run]: ./run
