---
title: 'mapTo'
kind: 'composite'
description: "mapTo combinator maps the parser's result to a constant value."
---

# {{ $frontmatter.title }}

## Signature

```ts
function mapTo<T, R>(parser: Parser<T>, value: R): Parser<R>
```

## Description

`mapTo` combinator maps the `parser`'s result to a constant `value`.

## Usage

```ts
const Parser = mapTo(
  sequence(integer(), string('+'), integer()),
  5
)
```

::: tip Success
```ts
run(Parser).with('2+2')

{
  isOk: true,
  pos: 3,
  value: 5
}
```
:::

::: danger Failure
```ts
run(Parser).with('2-2')

{
  isOk: false,
  pos: 1,
  expected: '+'
}
```
:::
