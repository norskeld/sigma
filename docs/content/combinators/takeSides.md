---
title: 'takeSides'
kind: 'composite'
description: 'takeSides combinator takes exactly three parsers and applies them in order. Returns a tuple of the results of the first and the last parsers.'
---

```typescript {{ withLineNumbers: false }}
function takeSides<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<[T1, T3]>
```

## Description

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
    isOk: true,
    pos: 9,
    value: [ 100, 200 ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('100 ^ 200')

  {
    isOk: false,
    pos: 4,
    expected: '&'
  }
  ```
</details>
