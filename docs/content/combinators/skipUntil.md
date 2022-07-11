---
title: 'skipUntil'
kind: 'primitive'
description: "skipUntil combinator applies source parser, ignores its output, and stops after terminator parser succeeds. Returns a terminator's value. Fails if parser fails."
---

```typescript {{ withLineNumbers: false }}
function skipUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<S>
```

## Description

`skipUntil` combinator applies source `parser`, ignores its output, and stops after `terminator` parser succeeds. Returns a `terminator`'s value. Fails if `parser` fails.

## Usage

```typescript
const CommentParser = mapTo(
  sequence(string('/*'), skipUntil(any(), string('*/'))),
  'No comments!'
)

const FailingParser = skipUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(CommentParser).with('/* Hello */')

  {
    isOk: true,
    pos: 11,
    value: 'No comments!'
  }
  ```

  ### Failure

  ```typescript
  run(FailingParser).with('one.')

  {
    isOk: false,
    pos: 0,
    expected: 'decimal digit'
  }
  ```
</details>
