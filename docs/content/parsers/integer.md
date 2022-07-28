---
title: 'integer'
kind: 'composite'
description: "integer parses an integer number with an optional minus sign, e.g. '0', '-7', '420'. Returns parsed string."
---

```typescript {{ withLineNumbers: false }}
function integer(): Parser<string>
```

## Description

`integer` parses an integer number with an optional minus sign, e.g. `0`, `-7`, `420`. Returns parsed string.

## Usage

```typescript
const Parser = integer()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('-42')

  {
    isOk: true,
    pos: 3,
    value: '-42'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('x')

  {
    isOk: false,
    pos: 0,
    expected: 'integer number'
  }
  ```
</details>
