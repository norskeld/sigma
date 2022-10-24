---
title: 'noneOf'
kind: 'primitive'
description: 'noneOf ensures that none of the characters in the given string matches the current character.'
---

# {{ $frontmatter.title }}

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
  pos: 1,
  value: 'q'
}
```
:::

::: danger Failure
```ts
run(Parser).with('q-combinator')

{
  isOk: false,
  pos: 0,
  expected: 'none of: x, y, z'
}
```
:::
