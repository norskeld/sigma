---
title: 'noneOf'
description: 'noneOf ensures that none of the characters in the given string matches the current character.'
---

# noneOf

`noneOf` ensures that none of the characters in the given string matches the current character. Characters are compared as whole code points, so surrogate pairs are matched intact. At the end of input it fails with `noneOf @ reached the end of input` instead of the usual `none of: ...` message.

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
