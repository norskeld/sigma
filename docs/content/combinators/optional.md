---
title: 'optional'
kind: 'composite'
description: 'optional combinator tries to apply parser. Returns the result of parser or null, and only fails if parser fails.'
---

# {{ $frontmatter.title }} <Composite />

## Signature

```ts
function optional<T>(parser: Parser<T>): Parser<T | null>
```

## Description

`optional` combinator tries to apply `parser`. Returns the result of `parser` or `null`, and only fails if `parser` fails.

## Usage

```ts
const Parser = sequence(
  optional(string('-')),
  whole()
)
```

::: tip Success
```ts
run(Parser).with('-2')

{
  isOk: true,
  pos: 2,
  value: [ '-', 2 ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('~2')

{
  isOk: false,
  pos: 0,
  expected: 'whole number'
}
```
:::
