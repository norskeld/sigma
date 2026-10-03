---
title: 'outer'
description: 'outer combinator takes three or more parsers and applies them in order. Returns a tuple of the values of the first and the last parsers.'
---

# outer

`outer` combinator takes **three or more** parsers and applies them in order. Returns a tuple of the values of the first and the last parsers.

## Usage

```ts
const Parser = outer(
  whole(),
  whitespace(),
  string('&'),
  whitespace(),
  whole()
)
```

::: tip Success
```ts
run(Parser).with('100 & 200')

{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: [ 100, 200 ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('100 ^ 200')

{
  isOk: false,
  start: 4,
  end: 5,
  pos: 4,
  expected: '&'
}
```
:::
