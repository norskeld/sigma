---
title: 'float'
kind: 'composite'
description: 'float parses a floating point number.'
---

```typescript {{ withLineNumbers: false }}
function float(): Parser<number>
```

## Description

`float` parses a floating point number.

## Usage

```typescript
const Parser = float()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('42.42')

  {
    isOk: true,
    pos: 5,
    value: 42.42
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42')

  {
    isOk: false,
    pos: 0,
    expected: 'float'
  }
  ```
</details>
