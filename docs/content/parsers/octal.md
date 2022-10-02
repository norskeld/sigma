---
title: 'octal'
kind: 'composite'
description: "octal parses an octal number prefixed with '0o' or '0O', e.g. '0o42', '0O42'. Returns a decimal number obtained using parseInt with radix of 8."
---

```typescript {{ withLineNumbers: false }}
function octal(): Parser<number>
```

## Description

`octal` parses an octal number prefixed with `0o` or `0O`, e.g. `0o42`, `0O42`. Returns **a decimal number** obtained using [parseInt] with radix of 8.

## Usage

```typescript
const Parser = octal()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('0o42')

  {
    isOk: true,
    pos: 4,
    value: 34
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('o42')

  {
    isOk: false,
    pos: 0,
    expected: 'octal number'
  }
  ```
</details>

<!-- Links. -->

[parseInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
