---
title: 'rest'
kind: 'primitive'
description: 'rest simply returns the unparsed input as a string. Never fails.'
---

```typescript {{ withLineNumbers: false }}
function rest(): Parser<string>
```

## Description

`rest` simply returns the unparsed input as a string. Never fails.

## Usage

```typescript
const Parser = sequence(string('hello'), rest())
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('hello world')

  {
    isOk: true,
    pos: 11,
    value: ['hello', ' world']
  }
  ```
</details>
