---
title: 'float'
kind: 'composite'
description: "float parses a float number with an optional minus sign, e.g. '0.25', '-7.90', '4.20'. Returns a decimal number obtained using parseInt with radix of 8."
---

# float <Composite />

## Signature

```ts
function float(): Parser<number>
```

## Description

> Note: It doesn't handle floats with exponent parts.

`float` parses a float number with an optional minus sign, e.g. `0.25`, `-7.90`, `4.20`. Returns **a decimal number** obtained using [parseFloat].

## Usage

```ts
const Parser = float()
```

::: tip Success
```ts
run(Parser).with('-42.0')

{
  isOk: true,
  span: [ 0, 5 ],
  pos: 5,
  value: -42
}
```
:::

::: danger Failure
```ts
run(Parser).with('42')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'float number'
}
```
:::

<!-- Links. -->

[parseFloat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
