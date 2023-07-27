---
title: 'many'
kind: 'primitive'
description: 'many combinator applies parser zero or more times. Returns an array of the returned values of parser.'
---

# many <Primitive />

## Signature

```ts
function many<T>(parser: Parser<T>): SafeParser<Array<T>>
```

## Description

`many` combinator applies `parser` *zero* or more times. Returns an array of the returned values of `parser`. This combinator never fails and returns an empty list if nothing matched.

## Usage

```ts
const Parser = many(string('+'))
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

::: danger Success
```ts
run(Parser).with('---')

{
  isOk: true,
  span: [ 0, 0 ],
  pos: 0,
  value: []
}
```
:::
