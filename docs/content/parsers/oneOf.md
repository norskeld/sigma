---
title: 'oneOf'
kind: 'primitive'
description: 'oneOf ensures that one of the characters in the given string matches the current character.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function oneOf(): Parser<string>
```

## Description

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
  pos: 0,
  expected: 'one of: x, y, z'
}
```
:::
