---
title: 'integer'
kind: 'composite'
description: "integer parses an integer number with an optional minus sign, e.g. '0', '-7', '420'. Returns a decimal number obtained using parseInt with radix of 10."
---

# integer <Composite />

## Signature

```ts
function integer(): Parser<number>
```

## Description

`integer` parses an integer number with an optional minus sign, e.g. `0`, `-7`, `420`. Returns **a decimal number** obtained using [parseInt] with radix of 10.

## Usage

```ts
const Parser = integer()
```

::: tip Success
```ts
run(Parser).with('-42')

{
  isOk: true,
  span: [ 0, 3 ],
  pos: 3,
  value: -42
}
```
---
```ts
run(Parser).with('134912398891')

{
  isOk: true,
  span: [ 0, 12 ],
  pos: 12,
  value: 134912398891
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
  expected: 'integer number'
}
```
:::

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
