---
title: 'any'
kind: 'primitive'
description: 'any parses any single character from the input and returns it; it fails at the end of input.'
---

# {{ $frontmatter.title }} <Primitive />

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
  span: [ 0, 3 ],
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
  span: [ 0, 0 ],
  pos: 0,
  expected: 'any @ reached the end of input'
}
```
:::
