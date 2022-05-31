---
title: 'sepBy'
kind: 'primitive'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

```typescript {{ withLineNumbers: false }}
function sepBy<T, S>(parser: Parser<T>, sep: Parser<S>): Parser<Array<T>>
```

## Description

`sepBy` combinator parses *zero* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`.

## Usage

```typescript
const Parser = sepBy(uint(), string('+'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('1+2+3+4')

  {
    isOk: true,
    pos: 7,
    value: [ 1, 2, 3, 4 ]
  }
  ```

  ```typescript
  run(Parser).with('1-two')

  {
    isOk: true,
    pos: 1,
    value: [ 1 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('one+two')

  {
    isOk: true,
    pos: 0,
    value: []
  }
  ```
</details>
