---
title: 'octal'
kind: 'composite'
description: "octal parses an octal number prefixed with '0o' or '0O', e.g. '0o42', '0O42'. Returns parsed number as a string."
---

```typescript {{ withLineNumbers: false }}
function octal(): Parser<string>
```

## Description

`octal` parses an octal number prefixed with `0o` or `0O`, e.g. `0o42`, `0O42`. Returns parsed number **as a string**.

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
    value: '0o42'
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
