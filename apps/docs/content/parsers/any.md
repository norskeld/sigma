---
title: 'any'
description: 'any parses any single character from the input and returns it; it fails at the end of input.'
---

# any

`any` parses any single character from the input and returns it. A character here is a whole code point, so a surrogate pair comes back intact. It fails at the end of input with `any @ reached the end of input`.

## Usage

```ts
const ManyParser = many(any())
const SingleParser = any()
```

::: tip Success
```ts
run(ManyParser).with('xyz')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: [ 'x', 'y', 'z' ]
}
```
:::

::: danger Failure
```ts
run(SingleParser).with('')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'any @ reached the end of input'
}
```
:::
