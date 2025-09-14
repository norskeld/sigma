---
title: 'attempt'
kind: 'primitive'
description: "attempt combinator applies parser without consuming any input. It doesn't care if parser succeeds or fails, it won't consume any input."
---

# attempt <Primitive />

## Signature

<<< @/../../../src/combinators/attempt.ts{signature}

## Description

<<< @/../../../src/combinators/attempt.ts{description}

## Usage

The example is the same as in the docs for [`lookahead` combinators][lookahead].

<<< @/../../../src/combinators/attempt.ts{example}

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

Notice how differs the output for the last failing case: `attempt` doesn't consume any input, i.e. it doesn't advance `pos`.

::: danger Failure
```ts
run(Parser).with('hello let')

{
  isOk: false,
  span: [ 6, 9 ],
  pos: 9, // [!code warning]
  expected: 'lettuce'
}
```
---
```ts
run(Parser).with('hello something')

{
  isOk: false,
  span: [ 6, 9 ],
  pos: 6, // [!code warning]
  expected: 'let'
}
```
:::

<!-- Links. -->

[lookahead]: ./lookahead
