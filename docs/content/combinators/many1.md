---
title: 'many1'
kind: 'composite'
description: 'many1 combinator applies parser one or more times. Returns an array of the returned values of parser.'
---

# {{ $frontmatter.title }}

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
  pos: 0,
  expected: 'at least one successful application of the parser'
}
```
:::
