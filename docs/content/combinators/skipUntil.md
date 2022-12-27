---
title: 'skipUntil'
kind: 'primitive'
description: "skipUntil combinator applies source parser, ignores its output, and stops after terminator parser succeeds. Returns a terminator's value. Fails if parser fails."
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function skipUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<S>
```

## Description

`skipUntil` combinator applies source `parser`, ignores its output, and stops after `terminator` parser succeeds. Returns a `terminator`'s value. Fails if `parser` fails.

## Usage

```ts
const CommentParser = mapTo(
  sequence(string('/*'), skipUntil(any(), string('*/'))),
  'No comments!'
)

const FailingParser = skipUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.'))
```

::: tip Success
```ts
run(CommentParser).with('/* Hello */')

{
  isOk: true,
  pos: 11,
  value: 'No comments!'
}
```
:::

::: danger Failure
```ts
run(FailingParser).with('one.')

{
  isOk: false,
  pos: 0,
  expected: 'decimal digit'
}
```
:::
