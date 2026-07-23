---
title: 'fail'
description: 'fail always fails with the given message, without consuming any input.'
---

# fail

`fail` always fails with the given `expected` message, without consuming any input. It's the counterpart of [nothing], and is mostly useful inside [when] callbacks to reject input based on an already parsed value.

## Usage

```ts
const Parser = when(
  integer(),
  ({ value }) => value % 2 === 0 ? mapTo(nothing(), value) : fail('even number')
)
```

::: tip Success
```ts
run(Parser).with('42')

{
  isOk: true,
  start: 2,
  end: 2,
  pos: 2,
  value: 42
}
```
:::

::: danger Failure
```ts
run(Parser).with('43')

{
  isOk: false,
  start: 2,
  end: 2,
  pos: 2,
  expected: 'even number'
}
```
:::

<!-- Parsers. -->

[nothing]: ./nothing

<!-- Combinators. -->

[when]: ../combinators/when
