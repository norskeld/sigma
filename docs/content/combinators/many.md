---
title: 'Сombinators › many'
description: 'many combinator applies parser zero or more times. Returns an array of the returned values of parser.'
---

# many

```typescript {{ withLineNumbers: false }}
function many<T>(parser: Parser<T>): Parser<Array<T>>
```

## Description

`many` combinator applies `parser` *zero* or more times. Returns an array of the returned values of `parser`.

## Usage

```typescript
const Parser = many(string('+'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('+++')

  {
    kind: 'success',
    state: { text: '+++', index: 3 },
    value: [ '+', '+', '+' ]
  }
  ```

  ### Failure

  `many` never fails and returns an empty array by default.

  ```typescript
  run(Parser).with('---')

  {
    kind: 'success',
    state: { text: '---', index: 0 },
    value: []
  }
  ```
</details>
