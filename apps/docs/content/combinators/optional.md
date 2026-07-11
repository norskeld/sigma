---
title: 'optional'
description: 'optional combinator tries to apply parser. Returns the result of parser or null. Never fails.'
---

# optional <Primitive />

`optional` combinator tries to apply `parser`. Returns the result of `parser` or `null`. Never fails.

## Usage

```ts
const Parser = sequence(
  optional(string('-')),
  whole()
)
```

::: tip Success
```ts
run(Parser).with('-2')

{
  isOk: true,
  start: 0,
  end: 2,
  pos: 2,
  value: [ '-', 2 ]
}
```
---
```ts
run(Parser).with('2')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: [ null, 2 ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('~2')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'whole number'
}
```
:::
