---
title: 'noneOf'
kind: 'primitive'
description: 'noneOf ensures that none of the characters in the given string matches the current character.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function noneOf(): Parser<string>
```

## Description

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
  span: [ 0, 1 ],
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
  span: [ 0, 0 ],
  pos: 0,
  expected: 'none of: x, y, z'
}
```
:::
