---
title: 'skipUntil'
description: "skipUntil combinator applies source parser, ignores its output, and stops after terminator parser succeeds. Returns a terminator's value. Fails if parser fails."
---

# skipUntil

`skipUntil` combinator applies source `parser`, ignores its output, and stops after `terminator` parser succeeds. Returns a `terminator`'s value. Fails if `parser` fails, or with the `terminator`'s error if `parser` succeeds without consuming input.

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
  start: 0,
  end: 11,
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
  start: 0,
  end: 0,
  pos: 0,
  expected: 'decimal digit'
}
```
:::
