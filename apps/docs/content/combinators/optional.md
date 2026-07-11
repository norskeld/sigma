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
  span: [ 0, 2 ],
  pos: 2,
  value: [ '-', 2 ]
}
```
---
```ts
run(Parser).with('2')

{
  isOk: true,
  span: [ 0, 1 ],
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
  span: [ 0, 0 ],
  pos: 0,
  expected: 'whole number'
}
```
:::
