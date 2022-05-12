---
title: 'letter'
kind: 'composite'
description: 'letter parses a single alphabetical character. Returns the matched character. Unicode friendly.'
---

```typescript {{ withLineNumbers: false }}
function letter(): Parser<string>
```

## Description

`letter` parses a single alphabetical character. Returns the matched character. Unicode friendly.

## Usage

```typescript
const Parser = letter()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('X')

  {
    kind: 'success',
    state: { text: 'X', index: 1 },
    value: 'X'
  }
  ```

  ```typescript
  run(Parser).with('こ')

  {
    kind: 'success',
    state: { text: 'こ', index: 1 },
    value: 'こ'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('8')

  {
    kind: 'failure',
    state: { text: '8', index: 0 },
    expected: 'letter'
  }
  ```
</details>
