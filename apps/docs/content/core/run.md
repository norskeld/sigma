---
title: 'run'
description: 'run is used to run parser with provided input.'
---

# run

`run` is used to run `parser` with provided input.

## Usage

```ts
run(string('hello world')).with('hello world')
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
{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'hello world'
}
```
:::
