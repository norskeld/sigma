---
title: 'noneOf'
description: 'noneOf ensures that none of the characters in the given string matches the current character.'
---

# noneOf <Primitive />

`noneOf` ensures that none of the characters in the given string matches the current character.

## Usage

```ts
const Parser = noneOf('xyz')
```

::: tip Success
```ts
run(Parser).with('q-combinator')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: 'q'
}
```
:::

::: danger Failure
```ts
run(Parser).with('y-combinator')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'none of: x, y, z'
}
```
:::
