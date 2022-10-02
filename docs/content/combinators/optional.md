---
title: 'optional'
kind: 'composite'
description: 'optional combinator tries to apply parser. Returns the result of parser or null, and only fails if parser fails.'
---

```typescript {{ withLineNumbers: false }}
function optional<T>(parser: Parser<T>): Parser<T | null>
```

## Description

`optional` combinator tries to apply `parser`. Returns the result of `parser` or `null`, and only fails if `parser` fails.

## Usage

```typescript
const Parser = sequence(
  optional(string('-')),
  whole()
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('-2')

  {
    isOk: true,
    pos: 2,
    value: [ '-', 2 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('~2')

  {
    isOk: false,
    pos: 0,
    expected: 'whole number'
  }
  ```
</details>
