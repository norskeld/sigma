---
title: 'count'
description: 'count combinator applies parser exactly n times and collects the values into an array.'
---

# count

`count` combinator applies `parser` exactly `n` times and collects the values into an array. Fails with the first failure of `parser`. Resolves to an empty array if `n` is less than one.

## Usage

Combined with [when], `count` makes it easy to parse length-prefixed data, e.g. netstring-like fields:

```ts
const Parser = when(
  first(integer(), string(':')),
  ({ value }) => map(count(any(), value), (chars) => chars.join(''))
)
```

::: tip Success
```ts
run(Parser).with('4:abcd')

{
  isOk: true,
  start: 2,
  end: 6,
  pos: 6,
  value: 'abcd'
}
```
:::

::: danger Failure
```ts
run(Parser).with('4:ab')

{
  isOk: false,
  start: 4,
  end: 4,
  pos: 4,
  expected: 'any @ reached the end of input'
}
```
:::

<!-- Combinators. -->

[when]: ./when

<!-- Parsers. -->

[integer]: ../parsers/integer
