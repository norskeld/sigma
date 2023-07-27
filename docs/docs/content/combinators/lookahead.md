---
title: 'lookahead'
kind: 'primitive'
description: 'lookahead combinator applies parser without consuming any input. If parser fails and consumes some input, so does lookahead.'
---

# lookahead <Primitive />

## Signature

```ts
function lookahead<T>(parser: Parser<T>): Parser<T>
```

## Description

`lookahead` combinator applies `parser` without consuming any input. If `parser` fails and consumes some input, so does `lookahead`.

## Usage

The example is rather contrived, but it clearly illustrates how the combinator works, allowing one, for example, collect ambiguous results for further processing.

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
  span: [ 0, 13 ],
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
  span: [ 6, 9 ],
  pos: 9,
  expected: 'lettuce'
}
```
---
```ts
run(Parser).with('hello something')

{
  isOk: false,
  span: [ 6, 9 ],
  pos: 9,
  expected: 'let'
}
```
:::
