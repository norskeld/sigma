---
title: 'first'
description: 'first combinator takes two or more parsers and applies them in order. Returns the value of the first parser.'
---

# first

`first` combinator takes **two or more** parsers and applies them in order. Returns the value of the first parser.

## Usage

```ts
const Parser = first(
  whole(),
  whitespace(),
  string('spartans')
)
```

::: tip Success
```ts
run(Parser).with('42 spartans')

{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: 42
}
```
:::

::: danger Failure
```ts
run(Parser).with('42 haskellers')

{
  isOk: false,
  start: 3,
  end: 11,
  pos: 3,
  expected: 'spartans'
}
```
:::
