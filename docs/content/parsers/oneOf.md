---
title: 'oneOf'
kind: 'primitive'
description: 'oneOf ensures that one of the characters in the given string matches the current character.'
---

```typescript {{ withLineNumbers: false }}
function oneOf(): Parser<string>
```

## Description

`oneOf` ensures that one of the characters in the given string matches the current character.

## Usage

```typescript
const Parser = oneOf('xyz')
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('y-combinator')

  {
    isOk: true,
    pos: 1,
    value: 'y'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('q-combinator')

  {
    isOk: false,
    pos: 0,
    expected: 'one of: x, y, z'
  }
  ```
</details>
