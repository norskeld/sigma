---
title: 'tryRun'
description: 'tryRun is used to run parser with provided input, throwing an error on failure.'
---

# tryRun

`tryRun` is is used to run `parser` with provided input, **throwing `ParserError` on failure**.

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
  value: 'hello world'
}
```
:::

::: danger Failure
```ts
<ParserError>
```
:::
