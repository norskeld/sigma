---
title: 'sequence'
description: 'sequence combinator applies parsers in order, until all of them succeed. Returns a tuple of values returned by parsers.'
---

# sequence <Primitive />

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
  start: 0,
  end: 11,
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
  start: 6,
  end: 11,
  pos: 6,
  expected: 'world'
}
```
:::

<!-- Links. -->

[typescript-tuple]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
