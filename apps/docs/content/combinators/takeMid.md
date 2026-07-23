---
title: 'takeMid'
description: 'takeMid combinator takes exactly three parsers and applies them in order. Returns the result of the parser in the middle.'
---

# takeMid

`takeMid` combinator takes exactly **three** parsers and applies them in order. Returns the result of the `p2` parser in the middle.

## Usage

```ts
const Parser = takeMid(
  sequence(string('fn'), whitespace()),
  letters(),
  rest()
)
```

::: tip Success
```ts
run(Parser).with('fn multiply x y')

{
  isOk: true,
  start: 0,
  end: 15,
  pos: 15,
  value: 'multiply'
}
```
:::

::: danger Failure
```ts
run(Parser).with('fn 100 x y')

{
  isOk: false,
  start: 3,
  end: 3,
  pos: 3,
  expected: 'letters'
}
```
:::
