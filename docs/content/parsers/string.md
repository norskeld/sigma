---
title: 'Parsers › string'
description: 'string parses a sequence of ASCII characters. Returns the parsed string.'
---

# string

```typescript {{ withLineNumbers: false }}
function string(match: string): Parser<string>
```

## Description

> Note: For Unicode strings consider using `ustring` parser.

`string` parses a sequence of *ASCII characters*. Returns the parsed string.

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
