---
title: 'Сombinators › optional'
description: 'optional combinator tries to apply parser. Returns the result of parser or null, and only fails if parser fails.'
---

# optional

```typescript {{ withLineNumbers: false }}
function optional<T>(parser: Parser<T>): Parser<T | null>
```

## Description

> Note: This combinator is not primitive, i.e. it is defined using other combinators.

`optional` combinator tries to apply `parser`. Returns the result of `parser` or `null`, and only fails if `parser` fails.

## Usage

```typescript
const Parser = sequence(
  optional(string('-')),
  uint()
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('-2')

  {
    kind: 'success',
    state: { text: '-2', index: 2 },
    value: [ '-', 2 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('~2')

  {
    kind: 'failure',
    state: { text: '~2', index: 0 },
    expected: 'unsigned integer'
  }
  ```
</details>
