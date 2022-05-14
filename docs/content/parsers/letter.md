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
    isOk: true,
    pos: 1,
    value: 'X'
  }
  ```

  ```typescript
  run(Parser).with('こ')

  {
    isOk: true,
    pos: 1,
    value: 'こ'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('8')

  {
    isOk: false,
    pos: 0,
    expected: 'letter'
  }
  ```
</details>
