---
title: 'takeMid'
description: 'takeMid combinator takes exactly three parsers and applies them in order. Returns the result of the parser in the middle.'
---

# takeMid <Composite />

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
  span: [ 0, 15 ],
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
  span: [ 3, 3 ],
  pos: 3,
  expected: 'letters'
}
```
:::
