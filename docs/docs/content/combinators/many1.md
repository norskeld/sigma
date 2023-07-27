---
title: 'many1'
kind: 'composite'
description: 'many1 combinator applies parser one or more times. Returns an array of the returned values of parser.'
---

# many1 <Primitive />

## Signature

```ts
function many1<T>(parser: Parser<T>): Parser<Array<T>>
```

## Description

`many1` combinator applies `parser` *one* or more times. Returns an array of the returned values of `parser`.

## Usage

```ts
const Parser = many1(string('+'))
```

::: tip Success
```ts
run(Parser).with('+++')

{
  isOk: true,
  span: [ 0, 3 ],
  pos: 3,
  value: [ '+', '+', '+' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('---')

{
  isOk: false,
  span: [ 0, 1 ],
  pos: 1,
  expected: '+'
}
```
:::
