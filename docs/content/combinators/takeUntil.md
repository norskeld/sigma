---
title: 'takeUntil'
kind: 'primitive'
description: 'takeUntil combinator applies source parser, collects its output, and stops after terminator parser succeeds. Returns a tuple of values collected by parser and terminator. Fails if parser fails.'
---

```typescript {{ withLineNumbers: false }}
function takeUntil<T, S>(parser: Parser<T>, terminator: Parser<S>): Parser<[Array<T>, S]>
```

## Description

`takeUntil` combinator applies source `parser`, collects its output, and stops after `terminator` parser succeeds. Returns a tuple of values collected by `parser` and `terminator`. Fails if `parser` fails.

## Usage

```typescript
const CommentParser = map(
  sequence(string('/*'), takeUntil(any(), string('*/'))),
  (values) => values.flat()
)

const FailingParser = takeUntil(regexp(/\p{Nd}/gu, 'decimal digit'), string('.'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(CommentParser).with('/* Hello */')

  {
    isOk: true,
    pos: 11,
    value: [
      '/*',
      [ ' ', 'H', 'e', 'l', 'l', 'o', ' ' ],
      '*/'
    ]
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
