---
title: 'takeSides'
description: 'takeSides combinator takes exactly three parsers and applies them in order. Returns a tuple of the results of the first and the last parsers.'
---

# takeSides <Composite />

`takeSides` combinator takes exactly **three** parsers and applies them in order. Returns a tuple of the results of `p1` and `p3` parsers.

## Usage

```ts
const Parser = takeSides(
  whole(),
  sequence(
    whitespace(),
    string('&'),
    whitespace()
  ),
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
