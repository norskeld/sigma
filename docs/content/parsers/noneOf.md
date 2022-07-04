---
title: 'noneOf'
kind: 'primitive'
description: 'noneOf ensures that none of the characters in the given string matches the current character.'
---

```typescript {{ withLineNumbers: false }}
function noneOf(): Parser<string>
```

## Description

`noneOf` ensures that none of the characters in the given string matches the current character.

## Usage

```typescript
const Parser = noneOf('xyz')
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('q-combinator')

  {
    isOk: true,
    pos: 1,
    value: 'q'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('q-combinator')

  {
    isOk: false,
    pos: 0,
    expected: 'none of: x, y, z'
  }
  ```
</details>
