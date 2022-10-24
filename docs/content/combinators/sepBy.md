---
title: 'sepBy'
kind: 'composite'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# {{ $frontmatter.title }}

## Signature

```ts
function sepBy<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>>
```

## Description

`sepBy` combinator parses *zero* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`. This combinator never fails and returns an empty list if nothing matched.

## Usage

```ts
const Parser = sepBy(whole(), string('+'))
```

::: tip Success
```ts
run(Parser).with('1+2+3+4')

{
  isOk: true,
  pos: 7,
  value: [ 1, 2, 3, 4 ]
}
```
---
```ts
run(Parser).with('1-two')

{
  isOk: true,
  pos: 1,
  value: [ 1 ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('1-two')

{
  isOk: true,
  pos: 1,
  value: [ 1 ]
}
```
:::
