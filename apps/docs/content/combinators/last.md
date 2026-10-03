---
title: 'last'
description: 'last combinator takes two or more parsers and applies them in order. Returns the value of the last parser.'
---

# last

`last` combinator takes **two or more** parsers and applies them in order. Returns the value of the last parser.

## Usage

```ts
const Parser = last(
  string('let'),
  whitespace(),
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
