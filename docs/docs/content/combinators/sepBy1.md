---
title: 'sepBy1'
kind: 'composite'
description: 'sepBy1 combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# sepBy1 <Composite />

## Signature

<<< @/../../../src/combinators/sepBy.ts{signature}

## Description

`sepBy1` combinator parses *one* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`.

## Usage

```ts
const Parser = sepBy1(whole(), string('+'))
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
:::

::: danger Failure
```ts
run(Parser).with('one+two')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'whole number'
}
```
:::
