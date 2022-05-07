---
title: 'string'
kind: 'primitive'
description: 'string parses an ASCII string. Returns the parsed string.'
---

```typescript {{ withLineNumbers: false }}
function string(match: string): Parser<string>
```

## Description

> For parsing Unicode strings, consider using [ustring].

`string` parses an *ASCII* string. Returns the parsed string.

## Usage

```typescript
const Parser = string('hello')
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('hello')

  {
    kind: 'success',
    state: { text: 'hello', index: 5 },
    value: 'hello'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('bye')

  {
    kind: 'failure',
    state: { text: 'bye', index: 0 },
    expected: 'hello'
  }
  ```
</details>

<!-- Parsers. -->

[ustring]: ./ustring.md
