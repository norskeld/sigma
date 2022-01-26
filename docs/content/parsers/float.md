---
title: 'Parsers › float'
description: 'float parses a floating point number.'
---

# float

```typescript {{ withLineNumbers: false }}
function float(): Parser<number>
```

## Description

> Note: This parser is not primitive, i.e. it is defined using other parsers and combinators.

`float` parses a floating point number.

## Usage

```typescript
const Parser = float()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('42.42')

  {
    kind: 'success',
    state: { text: '42.42', index: 5 },
    value: 42.42
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42')

  {
    kind: 'failure',
    state: { text: '42', index: 0 },
    expected: 'float'
  }
  ```
</details>
