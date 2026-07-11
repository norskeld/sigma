---
title: 'eof'
description: 'eof only succeeds at the end of the input.'
---

# eof <Primitive />

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
  start: 0,
  end: 18,
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
  start: 18,
  end: 18,
  pos: 18,
  expected: 'end of input'
}
```
:::
