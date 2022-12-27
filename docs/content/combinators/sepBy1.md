---
title: 'sepBy1'
kind: 'composite'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# {{ $frontmatter.title }} <Composite />

## Signature

```ts
function sepBy1<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>>
```

## Description

`sepBy1` combinator parses *one* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`. Otherwise returns an error produced by `parser`.

## Usage

```ts
const Parser = sepBy1(whole(), string('+'))
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
run(Parser).with('one+two')

{
  isOk: false,
  pos: 0,
  expected: 'whole number'
}
```
:::
