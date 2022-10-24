---
title: 'when'
kind: 'primitive'
description: "when combinator allows to create chained, context-aware parsers, that may depend on the output of the context parser."
---

# {{ $frontmatter.title }}

## Signature

```ts
function when<T, R extends Parser<unknown>>(
  context: Parser<T>,
  parser: (ctx: Context<T>) => R
): ToParser<R>
```

## Description

`when` combinator allows to create chained, context-aware `parser`s, that may depend on the output of the `context` parser.

## Usage

```ts
const Parser = when(string('x'), () => string('y'))
```

::: tip Success
```ts
run(Parser).with('xy')

{
  isOk: true,
  pos: 2,
  value: 'y'
}
```
:::

::: danger Failure
```ts
run(Parser).with('yy')

{
  isOk: false,
  pos: 1,
  expected: 'x'
}
```
:::
