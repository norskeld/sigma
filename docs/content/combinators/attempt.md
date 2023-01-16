---
title: 'attempt'
kind: 'primitive'
description: "attempt combinator applies parser without consuming any input. It doesn't care if parser succeeds or fails, it won't consume any input."
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function attempt<T>(parser: Parser<T>): Parser<T>
```

## Description

`attempt` combinator applies `parser` without consuming any input. It doesn't care if `parser` succeeds or fails, it won't consume any input.

## Usage

The example is the same as in the docs for [`lookahead` combinators][lookahead]. Notice how differs the output for the last failing case: `attempt` doesn't consume any input, i.e. it doesn't advance `pos`.

```ts
const Parser = sequence(
  takeLeft(string('hello'), whitespace()),
  lookahead(string('let')),
  string('lettuce')
)
```

::: tip Success
```ts
run(Parser).with('hello lettuce')

{
  isOk: true,
  pos: 13,
  value: [ 'hello', 'let', 'lettuce' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('hello let')

{
  isOk: false,
  pos: 9, // [!code warning]
  expected: 'lettuce'
}
```
:::

::: danger Failure
```ts
run(Parser).with('hello something')

{
  isOk: false,
  pos: 6, // [!code warning]
  expected: 'let'
}
```
:::

<!-- Links. -->

[lookahead]: ./lookahead
