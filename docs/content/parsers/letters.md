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
    isOk: true,
    pos: 1,
    value: 'XY'
  }
  ```

  ```typescript
  run(Parser).with('meaningOfLife42')

  {
    isOk: true,
    pos: 13,
    value: 'meaningOfLife'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42')

  {
    isOk: false,
    pos: 0,
    expected: 'letters'
  }
  ```
</details>
