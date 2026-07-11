---
title: 'takeLeft'
description: 'takeLeft combinator takes exactly two parsers and applies them in order. Returns the result of the leftmost parser.'
---

# takeLeft <Composite />

`takeLeft` combinator takes exactly **two** parsers and applies them in order. Returns the result of the leftmost `p1` parser.

## Usage

```ts
const Parser = takeLeft(
  whole(),
  sequence(whitespace(), string('spartans'))
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
