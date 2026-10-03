---
title: 'inner'
description: 'inner combinator takes three or more parsers and applies them in order. Returns the values of all but the first and the last parsers.'
---

# inner

`inner` combinator takes **three or more** parsers and applies them in order. Returns the values of all but the first and the last parsers.

Given exactly three parsers, the value of the middle one is returned as is. Given more, the values in between are returned as a tuple.

## Usage

```ts
const Parser = inner(
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

## Tuple of inner values

With four or more parsers the values in between come back as a tuple.

```ts
const Parser = inner(
  string('('),
  whole(),
  string(','),
  whole(),
  string(')')
)
```

::: tip Success
```ts
run(Parser).with('(1,2)')

{
  isOk: true,
  start: 0,
  end: 5,
  pos: 5,
  value: [ 1, ',', 2 ]
}
```
:::
