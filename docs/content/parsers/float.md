---
title: 'float'
kind: 'composite'
description: "float parses a float number with an optional minus sign, e.g. '0.25', '-7.90', '4.20'. Returns parsed number as a string."
---

```typescript {{ withLineNumbers: false }}
function float(): Parser<string>
```

## Description

> Note: It doesn't handle floats with exponent parts.

`float` parses a float number with an optional minus sign, e.g. `0.25`, `-7.90`, `4.20`. Returns parsed number **as a string**.

## Usage

```typescript
const Parser = float()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('-42.0')

  {
    isOk: true,
    pos: 5,
    value: '-42.0'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42')

  {
    isOk: false,
    pos: 0,
    expected: 'float number'
  }
  ```
</details>
