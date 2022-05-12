---
title: 'letter'
kind: 'composite'
description: 'letter parses an alphabetical character. Matches any Unicode char.'
---

```typescript {{ withLineNumbers: false }}
function letter(): Parser<string>
```

## Description

`letter` parses an alphabetical character. Matches any Unicode char.

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
