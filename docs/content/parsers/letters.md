---
title: 'letters'
kind: 'composite'
description: 'letters parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.'
---

```typescript {{ withLineNumbers: false }}
function letters(): Parser<string>
```

## Description

`letters` parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.

## Usage

```typescript
const Parser = letters()
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('XY')

  {
    kind: 'success',
    state: { text: 'XY', index: 1 },
    value: 'XY'
  }
  ```

  ```typescript
  run(Parser).with('meaningOfLife42')

  {
    kind: 'success',
    state: { text: 'meaningOfLife42', index: 13 },
    value: 'meaningOfLife'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42')

  {
    kind: 'failure',
    state: { text: '42', index: 0 },
    expected: 'letters'
  }
  ```
</details>
