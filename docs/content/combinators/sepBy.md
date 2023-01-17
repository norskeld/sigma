---
title: 'sepBy'
kind: 'composite'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# {{ $frontmatter.title }} <Composite />

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
  span: [ 0, 7 ],
  pos: 7,
  value: [ 1, 2, 3, 4 ]
}
```
---
```ts
run(Parser).with('1-two')

{
  isOk: true,
  span: [ 0, 1 ],
  pos: 1,
  value: [ 1 ]
}
```
---
```ts
run(Parser).with('one+two')

{
  isOk: true,
  span: [ 0, 0 ],
  pos: 0,
  value: []
}
```
:::
