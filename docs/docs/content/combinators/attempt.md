---
title: 'attempt'
kind: 'primitive'
description: "attempt combinator applies parser without consuming any input. It doesn't care if parser succeeds or fails, it won't consume any input."
---

# attempt <Primitive />

## Signature

```ts
function attempt<T>(parser: Parser<T>): Parser<T>
```

## Description

`attempt` combinator applies `parser` without consuming any input. It doesn't care if `parser` succeeds or fails, it won't consume any input.

## Usage

The example is the same as in the docs for [`lookahead` combinators][lookahead].

```ts
const Parser = sequence(
  takeLeft(string('hello'), whitespace()),
  attempt(string('let')),
  string('lettuce')
)
```

::: tip Success
```ts
run(Parser).with('hello lettuce')

{
  isOk: true,
  span: [ 0, 13 ],
  pos: 13,
  value: [ 'hello', 'let', 'lettuce' ]
}
```
:::

In both failing cases `pos` stays untouched, while `span` still covers the attempted region.

::: danger Failure
```ts
run(Parser).with('hello let')

{
  isOk: false,
  span: [ 6, 9 ],
  pos: 6,
  expected: 'lettuce'
}
```
---
```ts
run(Parser).with('hello something')

{
  isOk: false,
  span: [ 6, 9 ],
  pos: 6,
  expected: 'let'
}
```
:::

<!-- Links. -->

[lookahead]: ./lookahead
