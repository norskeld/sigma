---
title: 'takeRight'
kind: 'composite'
description: 'takeRight combinator takes exactly two parsers and applies them in order. Returns the result of the rightmost parser.'
---

# takeRight <Composite />

## Signature

```ts
function takeRight<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T2>
```

## Description

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
  span: [ 0, 11 ],
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
  span: [ 4, 4 ],
  pos: 4,
  expected: 'letters'
}
```
:::
