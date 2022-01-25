---
title: 'Сombinators › error'
description: 'error combinator allows to replace error message for parser.'
---

# error

```typescript {{ withLineNumbers: false }}
function error<T>(parser: Parser<T>, expected: string): Parser<T>
```

## Description

`error` combinator allows to replace `parser`'s error message with `expected`.

## Usage

```typescript
const Parser = error(
  choice(
    string('true'),
    string('false')
  ),
  `expecting either 'true' or 'false'`
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('true')

  {
    kind: 'success',
    state: { text: 'true', index: 4 },
    value: 'true'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('maybe')

  {
    kind: 'failure',
    state: { text: 'maybe', index: 0 },
    expected: "expecting either 'true' or 'false'"
  }
  ```
</details>
