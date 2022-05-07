---
title: 'choice'
kind: 'primitive'
description: 'choice combinator tries to apply parsers in order, until one of them succeeds. Returns a value of the succeeding parser.'
---

```typescript {{ withLineNumbers: false }}
function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
function choice<T>(...ps: Array<Parser<T>>): Parser<T>
```

## Description

`choice` combinator tries to apply `ps` parsers in order, until one of them succeeds. Returns a value of the succeeding parser.

## Usage

```typescript
const Parser = choice(
  string('true'),
  string('false')
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('true')

  {
    kind: 'success',
    state: { text: 'true', index: 4 },
    value: 'true'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('maybe')

  {
    kind: 'failure',
    state: { text: 'maybe', index: 0 },
    expected: 'true'
  }
  ```
</details>
