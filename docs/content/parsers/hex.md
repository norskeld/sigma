---
title: 'hex'
kind: 'composite'
description: "hexadecimal parses a hexadecimal number prefixed with '0x' or '0X', e.g. '0xFF', '0XFF', '0xff'. Returns a decimal number obtained using parseInt with radix of 16."
---

```typescript {{ withLineNumbers: false }}
function hex(): Parser<number>
```

## Description

`hex` parses a hexadecimal number prefixed with `0x` or `0X`, e.g. `0xFF`, `0XFF`, `0xff`. Returns **a decimal number** obtained using [parseInt] with radix of 16.

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
    value: 255
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

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
