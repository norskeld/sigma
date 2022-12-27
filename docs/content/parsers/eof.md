---
title: 'eof'
kind: 'primitive'
description: 'eof only succeeds at the end of the input.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function eof(): Parser<null>
```

## Description

`eof` only succeeds (with `null`) at the end of the input.

## Usage

```ts
const Parser = sequence(
  string('<start>'),
  string('<body>'),
  string('<end>'),
  eof()
)
```

::: tip Success
```ts
run(Parser).with(`<start><body><end>`)

{
  isOk: true,
  pos: 18,
  value: [ '<start>', '<body>', '<end>', null ]
}
```
:::

::: danger Failure
```ts
run(Parser).with(`<start><body><end>\n`)

{
  isOk: false,
  pos: 18,
  expected: 'end of input'
}
```
:::
