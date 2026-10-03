---
title: 'sepBy1'
description: 'sepBy1 combinator parses one or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# sepBy1

`sepBy1` combinator parses *one* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`. Otherwise returns an error produced by `parser`. A [committed][commit] failure from `parser` or `sep` propagates instead of ending the loop, and the cursor rewinds to where the combinator started.

A `sep` that isn't followed by a value is rewound too, so a trailing separator is left unconsumed.

## Usage

```ts
const Parser = sepBy1(whole(), string('+'))
```

::: tip Success
```ts
run(Parser).with('1+2+3+4')

{
  isOk: true,
  start: 0,
  end: 7,
  pos: 7,
  value: [ 1, 2, 3, 4 ]
}
```
---
```ts
run(Parser).with('1-two')

{
  isOk: true,
  start: 0,
  end: 1,
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
  start: 0,
  end: 0,
  pos: 0,
  expected: 'whole number'
}
```
:::

<!-- Links. -->

[commit]: ./commit
