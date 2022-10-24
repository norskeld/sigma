---
title: 'any'
kind: 'primitive'
description: 'any parses any single character from the input and returns it; it fails at the end of input.'
---

# {{ $frontmatter.title }}

## Signature

```ts
function any(): Parser<string>
```

## Description

`any` parses any single character from the input and returns it. It fails at the end of input.

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
  pos: 0,
  expected: 'reached the end of input'
}
```
:::
