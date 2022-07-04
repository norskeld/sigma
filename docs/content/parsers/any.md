---
title: 'any'
kind: 'primitive'
description: 'any parses any single character from the input and returns it; it fails at the end of input.'
---

```typescript {{ withLineNumbers: false }}
function any(): Parser<string>
```

## Description

`any` parses any single character from the input and returns it. It fails at the end of input.

## Usage

```typescript
const ManyParser = many(any())
const SingleParser = any()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(ManyParser).with('xyz')

  {
    isOk: true,
    pos: 3,
    value: [ 'x', 'y', 'z' ]
  }
  ```

  ### Failure

  ```typescript
  run(SingleParser).with('')

  {
    isOk: false,
    pos: 0,
    expected: 'reached the end of input'
  }
  ```
</details>
