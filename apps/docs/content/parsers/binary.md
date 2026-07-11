---
title: 'binary'
kind: 'composite'
description: "binary parses a binary number prefixed with '0b' or '0B', e.g. '0b10', '0B10'. Returns a decimal number obtained using parseInt with radix of 2."
---

# binary <Composite />

## Signature

```ts
function binary(): Parser<number>
```

## Description

`binary` parses a binary number prefixed with `0b` or `0B`, e.g. `0b10`, `0B10`. Returns **a decimal number** obtained using [parseInt] with radix of 2.

## Usage

```ts
const Parser = binary()
```

::: tip Success
```ts
run(Parser).with('0b10')

{
  isOk: true,
  span: [ 0, 4 ],
  pos: 4,
  value: 2
}
```
:::

::: danger Failure
```ts
run(Parser).with('b10')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'binary number'
}
```
:::

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
