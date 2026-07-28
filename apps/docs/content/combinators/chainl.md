---
title: 'chainl'
description: 'chainl combinator parses one or more occurrences of parser, separated by op. Returns a value obtained by a recursive left-associative application of a function to the operand values and the values returned by op.'
---

# chainl

`chainl` combinator parses _one_ or more occurrences of `parser`, separated by `op` (in [EBNF] notation: `parser (op parser)*`). Returns a value obtained by a recursive left-associative application of `fn` to the operand values and the values returned by `op`. This combinator is particularly useful for eliminating left recursion, which typically occurs in expression grammars.

Note that the `op` parser matches _only_ the operator, and `fn` receives the operand values on both sides of it, as `(left, op, right)`. Unlike [map], `fn` is not given a span.

With no operator at all the single operand is returned as-is and `fn` is never called, which is why the operand type has to be assignable to the result type.

The [expressions] guide covers precedence, associativity and building a tree rather than a value.

## Usage

The code below implements a simple calculator that supports addition and subtraction.

```ts
function mapBinary(left: number, op: string, right: number) {
  switch (op) {
    case '+': return left + right
    case '-': return left - right
    default: throw `Unknown operator '${op}'.`
  }
}

const Parser = chainl(
  integer(),
  choice(
    string('+'),
    string('-')
  ),
  mapBinary
)
```

::: tip Success
```ts{7}
run(Parser).with('10+10-5+15')

{
  isOk: true,
  start: 0,
  end: 10,
  pos: 10,
  value: 30
}
```
:::

So what happens here? Let's unpack, step-by-step.

- **Consume** `10 '+' 10`, eagerly **evaluate** by applying `mapBinary`, **yield** `20`.
- **Consume** `'-' 5`, eagerly **evaluate** by applying `mapBinary` to the accumulated `20`, **yield** `15`.
- **Consume** `'+' 15`, eagerly **evaluate** by applying `mapBinary` to the accumulated `15`, and finally **yield** `30`.

As you can see, it directly maps to the [EBNF] notation given above: `parser (op parser)*`.

## Incomplete pairs

A pair that starts but doesn't finish is not an error. If `op` matches and the operand after it fails, `chainl` rewinds over the operator, resolves to what it accumulated so far, and leaves the operator unconsumed.

::: tip Success
```ts
run(Parser).with('10+10+')

{
  isOk: true,
  start: 0,
  end: 5,
  pos: 5,
  value: 20
}
```
:::

A [committed][commit] failure is different: it aborts the whole chain, discarding pairs already folded, and restores the position to where the chain started.

<!-- Links. -->

[ebnf]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form 'Extended Backus–Naur form'

<!-- Combinators. -->

[commit]: ./commit
[map]: ./map

<!-- Guides. -->

[expressions]: ../guides/expressions
