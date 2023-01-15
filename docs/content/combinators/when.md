---
title: 'when'
kind: 'primitive'
description: "when combinator allows to create chained, context-aware parsers, that may depend on the output of the context parser."
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function when<T, R extends Parser<unknown>>(
  context: Parser<T>,
  parser: (ctx: Context<T>) => R
): ToParser<R>
```

## Description

`when` combinator allows to create chained, context-aware parsers, that may depend on the output of the `context` parser. Returns a parser produced by the `parser` callback, which is called only if the `context` parser succeeds, i.e. if it fails, then `when` fails as well.

## Usage

```ts
const Parser = when(takeLeft(letters(), whitespace()), ({ value }) => {
  switch (value) {
    case 'integer': return integer()
    case 'string': return letters()
    case 'bracketed': return takeMid(string('('), letters(), string(')'))
    default: return rest()
  }
})
```

::: tip Success
```ts
run(Parser).with('integer 42')

{
  isOk: true,
  pos: 10,
  value: 42
}
```
:::

::: tip Success
```ts
run(Parser).with('string Something')

{
  isOk: true,
  pos: 16,
  value: 'Something'
}
```
:::

::: tip Success
```ts
run(Parser).with('bracketed (Something)')

{
  isOk: true,
  pos: 21,
  value: 'Something'
}
```
:::

::: tip Success
```ts
run(Parser).with('unknown input')

{
  isOk: true,
  pos: 13,
  value: 'input'
}
```
:::

::: danger Failure
```ts
run(Parser).with('0x42')

{
  isOk: false,
  pos: 0,
  expected: 'letters'
}
```
:::
