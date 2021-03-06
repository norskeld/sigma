---
title: 'many'
kind: 'primitive'
description: 'many combinator applies parser zero or more times. Returns an array of the returned values of parser.'
---

```typescript {{ withLineNumbers: false }}
function many<T>(parser: Parser<T>): SafeParser<Array<T>>
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
    isOk: true,
    pos: 3,
    value: [ '+', '+', '+' ]
  }
  ```

  ### Failure

  `many` never fails and returns an empty array by default.

  ```typescript
  run(Parser).with('---')

  {
    isOk: true,
    pos: 0,
    value: []
  }
  ```
</details>
