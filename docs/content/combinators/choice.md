---
title: 'Сombinators › choice'
description: 'choice combinator tries to apply given parsers in order, until one of them succeeds. Returns the value of the succeeding parser, otherwise fails with expectation message of the first parser without consuming input.'
---

# choice

```typescript {{ withLineNumbers: false }}
function choice<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToUnion<T>>
function choice<T>(...ps: Array<Parser<T>>): Parser<T>
```

## Description

`choice` combinator tries to apply the `ps` parsers in order, until one of them succeeds. Returns the value of the succeeding parser, otherwise fails with expectation message of the first parser without consuming input.

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
