---
title: 'sequence'
kind: 'primitive'
description: 'sequence combinator applies parsers in order, until all of them succeed. Returns a tuple of values returned by parsers.'
---

# sequence <Primitive />

## Signature

```ts
function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>>
```

## Description

`sequence` combinator applies `ps` parsers in order, until *all* of them succeed. Returns [a tuple][typescript-tuple] of values returned by `ps` parsers.

## Usage

```ts
const Parser = sequence(
  string('hello'),
  whitespace(),
  string('world')
)
```

::: tip Success
```ts
run(Parser).with('hello world')

{
  isOk: true,
  span: [ 0, 11 ],
  pos: 11,
  value: [ 'hello', ' ', 'world' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('hello friend')

{
  isOk: false,
  span: [ 6, 11 ],
  pos: 6,
  expected: 'world'
}
```
:::

<!-- Links. -->

[typescript-tuple]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
