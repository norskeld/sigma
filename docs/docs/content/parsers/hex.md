---
title: 'hex'
kind: 'composite'
description: "hexadecimal parses a hexadecimal number prefixed with '0x' or '0X', e.g. '0xFF', '0XFF', '0xff'. Returns a decimal number obtained using parseInt with radix of 16."
---

# hex <Composite />

## Signature

```ts
function hex(): Parser<number>
```

## Description

`hex` parses a hexadecimal number prefixed with `0x` or `0X`, e.g. `0xFF`, `0XFF`, `0xff`. Returns **a decimal number** obtained using [parseInt] with radix of 16.

## Usage

```ts
const Parser = hex()
```

::: tip Success
```ts
run(Parser).with('0xFF')

{
  isOk: true,
  span: [ 0, 4 ],
  pos: 4,
  value: 255
}
```
:::

::: danger Failure
```ts
run(Parser).with('xFF')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'hexadecimal number'
}
```
:::

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
