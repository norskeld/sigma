---
title: 'string'
description: 'string parses a string. Returns the parsed string.'
---

# string

`string` parses a string. Returns the parsed string. An empty string matches anywhere and consumes nothing. On failure the reported span covers what the match would have covered, clamped to the end of input.

## Usage

```ts
const Parser = string('hello')
```

::: tip Success
```ts
run(Parser).with('hello')

{
  isOk: true,
  start: 0,
  end: 5,
  pos: 5,
  value: 'hello'
}
```
:::

::: danger Failure
```ts
run(Parser).with('bye')

{
  isOk: false,
  start: 0,
  end: 3,
  pos: 0,
  expected: 'hello'
}
```
:::
