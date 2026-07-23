---
title: 'chainr'
description: 'chainr combinator parses zero or more occurrences of parser, separated by op. Returns a value obtained by a recursive right-associative application of a function to the values returned by parser and op.'
---

# chainr

`chainr` combinator parses _zero_ or more occurrences of `parser`, separated by `op` (in [EBNF] notation: `parser (op parser)*`). Returns a value obtained by a recursive right-associative application of `fn` to the operand values and the values returned by `op`. It is the right-associative counterpart of [chainl], useful for right-associative operators like exponentiation.

Note that unlike [chainl], the `op` parser matches _only_ the operator, and `fn` receives the operand values on both sides of it.

## Usage

```ts
const Integer = map(regexp(/\d+/g, 'integer'), Number)

const Parser = chainr(
  Integer,
  string(' ^ '),
  (left, _, right) => Math.pow(left, right)
)
```

::: tip Success
```ts
run(Parser).with('2 ^ 3 ^ 2')

{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: 512
}
```
:::

The input is parsed right-associatively, i.e. as `2 ^ (3 ^ 2) = 2 ^ 9 = 512`, and not as `(2 ^ 3) ^ 2 = 64`.

<!-- Links. -->

[ebnf]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form 'Extended Backus–Naur form'

<!-- Combinators. -->

[chainl]: ./chainl
