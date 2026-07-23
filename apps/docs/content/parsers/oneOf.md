---
title: 'oneOf'
description: 'oneOf ensures that one of the characters in the given string matches the current character.'
---

# oneOf

`oneOf` ensures that one of the characters in the given string matches the current character.

## Usage

```ts
const Parser = oneOf('xyz')
```

::: tip Success
```ts
run(Parser).with('y-combinator')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: 'y'
}
```
:::

::: danger Failure
```ts
run(Parser).with('q-combinator')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'one of: x, y, z'
}
```
:::
