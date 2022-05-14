---
title: 'whitespace'
kind: 'composite'
description: 'whitespace parses whitespace, either a single character or consecutive ones. Returns the matched character(s).'
---

```typescript {{ withLineNumbers: false }}
function whitespace(): Parser<string>
```

## Description

`whitespace` parses whitespace, either a single character or consecutive ones. Returns the matched character(s).

## Usage

```typescript
const Parser = sequence(string('hello'), whitespace(), string('world'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('hello world')

  {
    isOk: true,
    pos: 11,
    value: [ 'hello', ' ', 'world' ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('helloworld')

  {
    isOk: false,
    pos: 5,
    expected: 'whitespace'
  }
  ```
</details>
