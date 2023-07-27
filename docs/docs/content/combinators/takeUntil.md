---
title: 'takeUntil'
kind: 'primitive'
description: 'takeUntil combinator applies source parser, collects its output, and stops after terminator parser succeeds. Returns a tuple of values collected by parser and terminator. Fails if parser fails.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function takeUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<[Array<T>, S]>
```

## Description

`takeUntil` combinator applies source `parser`, collects its output, and stops after `terminator` parser succeeds. Returns a tuple of values collected by `parser` and `terminator`. Fails if `parser` fails.

## Usage

```ts
const CommentParser = map(
  sequence(string('/*'), takeUntil(any(), string('*/'))),
  (values) => values.flat()
)

const FailingParser = takeUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.'))
```

::: tip Success
```ts
run(CommentParser).with('/* Hello */')

{
  isOk: true,
  span: [ 0, 11 ],
  pos: 11,
  value: [
    '/*',
    [ ' ', 'H', 'e', 'l', 'l', 'o', ' ' ],
    '*/'
  ]
}
```
:::

::: danger Failure
```ts
run(FailingParser).with('one.')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'decimal digit'
}
```
:::
