---
title: 'Сombinators › sepBy'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# sepBy

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
    kind: 'success',
    state: { text: '1+2+3+4', index: 7 },
    value: [ 1, 2, 3, 4 ]
  }
  ```

  ```typescript
  run(Parser).with('1-two')

  {
    kind: 'success',
    state: { text: '1-two', index: 1 },
    value: [ 1 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('one+two')

  {
    kind: 'failure',
    state: { text: 'one+two', index: 0 },
    expected: 'unsigned integer'
  }
  ```
</details>
