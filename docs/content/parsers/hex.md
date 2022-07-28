---
title: 'hex'
kind: 'composite'
description: "hexadecimal parses a hexadecimal number prefixed with '0x' or '0X', e.g. '0xFF', '0XFF', '0xff'. Returns parsed number as a string."
---

```typescript {{ withLineNumbers: false }}
function hex(): Parser<string>
```

## Description

`hex` parses a hexadecimal number prefixed with `0x` or `0X`, e.g. `0xFF`, `0XFF`, `0xff`. Returns parsed number **as a string**.

## Usage

```typescript
const Parser = hex()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('0xFF')

  {
    isOk: true,
    pos: 4,
    value: '0xFF'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('xFF')

  {
    isOk: false,
    pos: 0,
    expected: 'hexadecimal number'
  }
  ```
</details>
