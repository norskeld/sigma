---
title: 'binary'
kind: 'composite'
description: "binary parses a binary number prefixed with '0b' or '0B', e.g. '0b10', '0B10'. Returns parsed number as a string."
---

```typescript {{ withLineNumbers: false }}
function binary(): Parser<string>
```

## Description

`binary` parses a binary number prefixed with `0b` or `0B`, e.g. `0b10`, `0B10`. Returns parsed number **as a string**.

## Usage

```typescript
const Parser = binary()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('0b10')

  {
    isOk: true,
    pos: 4,
    value: '0b10'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('b10')

  {
    isOk: false,
    pos: 0,
    expected: 'binary number'
  }
  ```
</details>
