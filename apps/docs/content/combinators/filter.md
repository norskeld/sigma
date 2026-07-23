---
title: 'filter'
description: 'filter combinator applies parser and tests its value with a predicate, failing if the value is rejected.'
---

# filter

`filter` combinator applies `parser` and tests its value with the `fn` predicate. Succeeds with the value if `fn` returns `true`, otherwise fails with `expected`. Failures of `parser` itself are propagated as is.

## Usage

```ts
const Port = filter(
  integer(),
  (value) => value >= 0 && value <= 65535,
  'port number'
)
```

::: tip Success
```ts
run(Port).with('8080')

{
  isOk: true,
  start: 0,
  end: 4,
  pos: 4,
  value: 8080
}
```
:::

::: danger Failure
```ts
run(Port).with('70000')

{
  isOk: false,
  start: 0,
  end: 5,
  pos: 0,
  expected: 'port number'
}
```
:::

<!-- Links. -->

[integer]: ../parsers/integer
