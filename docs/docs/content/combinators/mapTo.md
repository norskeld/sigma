---
title: 'mapTo'
kind: 'composite'
description: "mapTo combinator maps the parser's result to a constant value."
---

# mapTo <Composite />

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
  span: [ 0, 3 ],
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
  span: [ 1, 2 ],
  pos: 2,
  expected: '+'
}
```
:::
