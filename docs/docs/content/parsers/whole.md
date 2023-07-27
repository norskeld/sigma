---
title: 'whole'
kind: 'composite'
description: "whole parses a positive whole number without leading zeros, e.g. '0', '7', '420'. Returns a decimal number obtained using parseInt with radix of 10."
---

# {{ $frontmatter.title }} <Composite />

## Signature

```ts
function whole(): Parser<number>
```

## Description

`whole` parses a positive whole number without leading zeros, e.g. `0`, `7`, `420`. Returns **a decimal number** obtained using [parseInt] with radix of 10.

## Usage

```ts
const Parser = whole()
```

::: tip Success
```ts
run(Parser).with('42')

{
  isOk: true,
  span: [ 0, 2 ],
  pos: 2,
  value: 42
}
```
:::

::: danger Failure
```ts
run(Parser).with('x')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'whole number'
}
```
:::

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
