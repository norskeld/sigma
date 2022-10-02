---
title: 'binary'
kind: 'composite'
description: "binary parses a binary number prefixed with '0b' or '0B', e.g. '0b10', '0B10'. Returns a decimal number obtained using parseInt with radix of 2."
---

```typescript {{ withLineNumbers: false }}
function binary(): Parser<number>
```

## Description

`binary` parses a binary number prefixed with `0b` or `0B`, e.g. `0b10`, `0B10`. Returns **a decimal number** obtained using [parseInt] with radix of 2.

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
    value: 2
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

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
