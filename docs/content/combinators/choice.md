---
title: 'choice'
kind: 'primitive'
description: 'choice combinator tries to apply parsers in order, until one of them succeeds. Returns a value of the succeeding parser.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
function choice<T>(...ps: Array<Parser<T>>): Parser<T>
```

## Description

`choice` combinator tries to apply `ps` parsers in order, until one of them succeeds. Returns a value of the succeeding parser.

## Usage

```ts
const Parser = choice(
  string('true'),
  string('false')
)
```

::: tip Success
```ts
run(Parser).with('true')

{
  isOk: true,
  span: [ 0, 4 ],
  pos: 4,
  value: 'true'
}
```
:::

Notice how the `expected` field differs depending on the input, specifically its length.

::: danger Failure
```ts{7}
run(Parser).with('yank')

{
  isOk: false,
  span: [ 0, 4 ],
  pos: 0,
  expected: 'true'
}
```
---
```ts{7}
run(Parser).with('maybe')

{
  isOk: false,
  span: [ 0, 5 ],
  pos: 0,
  expected: 'false'
}
```
:::
