---
title: 'takeRight'
description: 'takeRight combinator takes exactly two parsers and applies them in order. Returns the result of the rightmost parser.'
---

# takeRight

`takeRight` combinator takes exactly **two** parsers and applies them in order. Returns the result of the rightmost `p2` parser.

## Usage

```ts
const Parser = takeRight(
  sequence(string('let'), whitespace()),
  letters()
)
```

::: tip Success
```ts
run(Parser).with('let binding')

{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: 'binding'
}
```
:::

::: danger Failure
```ts
run(Parser).with('let 42')

{
  isOk: false,
  start: 4,
  end: 4,
  pos: 4,
  expected: 'letters'
}
```
:::
