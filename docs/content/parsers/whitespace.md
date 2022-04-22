---
title: 'Parsers › whitespace'
description: 'whitespace parses whitespace, either a single character or consecutive ones. Returns the matched character(s).'
---

# whitespace

```typescript {{ withLineNumbers: false }}
function whitespace(): Parser<string>
```

## Description

> Note: This parser is not primitive, i.e. it is defined using other parsers and combinators.

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
    kind: 'success',
    state: { text: 'hello world', index: 11 },
    value: [ 'hello', ' ', 'world' ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('helloworld')

  {
    kind: 'failure',
    state: { text: 'helloworld', index: 5 },
    expected: 'whitespace'
  }
  ```
</details>
