---
title: 'whole'
kind: 'composite'
description: "whole parses a positive whole number without leading zeros, e.g. '0', '7', '420'. Returns parsed string."
---

```typescript {{ withLineNumbers: false }}
function whole(): Parser<string>
```

## Description

`whole` parses a positive whole number without leading zeros, e.g. `0`, `7`, `420`. Returns parsed string.

## Usage

```typescript
const Parser = whole()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('42')

  {
    isOk: true,
    pos: 2,
    value: '42'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('x')

  {
    isOk: false,
    pos: 0,
    expected: 'whole number'
  }
  ```
</details>
