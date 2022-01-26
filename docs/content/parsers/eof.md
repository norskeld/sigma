---
title: 'Parsers › eof'
description: 'eof only succeeds at the end of the input.'
---

# eof

```typescript {{ withLineNumbers: false }}
function eof(): Parser<null>
```

## Description

`eof` only succeeds (with `null`) at the end of the input.

## Usage

```typescript
const Parser = sequence(
  string('<start>'),
  string('<body>'),
  string('<end>'),
  eof()
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with(`<start><body><end>`)

  {
    kind: 'success',
    state: { text: '<start><body><end>', index: 18 },
    value: [ '<start>', '<body>', '<end>', null ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with(`<start><body><end>\n`)

  {
    kind: 'failure',
    state: { text: '<start><body><end>\n', index: 18 },
    expected: 'end of input'
  }
  ```
</details>
