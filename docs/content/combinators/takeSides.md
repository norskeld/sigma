---
title: 'Сombinators › takeSides'
description: 'takeSides combinator takes exactly three parsers and applies them. Returns a tuple of the results of the first and the last parsers.'
---

# takeSides

```typescript {{ withLineNumbers: false }}
function takeSides<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T3]>
```

## Description

> Note: This combinator is not primitive, i.e. it is defined using other combinators.

`takeSides` combinator takes exactly **three** parsers and applies them in order. Returns a tuple of the results of `p1` and `p3` parsers.

## Usage

```typescript
const Parser = takeSides(
  uint(),
  sequence(
    whitespace(),
    string('&'),
    whitespace()
  ),
  uint())
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('100 & 200')

  {
    kind: 'success',
    state: { text: '100 & 200', index: 9 },
    value: [ 100, 200 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('100 ^ 200')

  {
    kind: 'failure',
    state: { text: '100 ^ 200', index: 4 },
    expected: '&'
  }
  ```
</details>
