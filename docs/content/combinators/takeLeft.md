---
title: 'takeLeft'
kind: 'composite'
description: 'takeLeft combinator takes exactly two parsers and applies them in order. Returns the result of the leftmost parser.'
---

```typescript {{ withLineNumbers: false }}
function takeLeft<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1>
```

## Description

`takeLeft` combinator takes exactly **two** parsers and applies them in order. Returns the result of the leftmost `p1` parser.

## Usage

```typescript
const Parser = takeLeft(
  whole(),
  sequence(whitespace(), string('spartans'))
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('42 spartans')

  {
    isOk: true,
    pos: 11,
    value: 42
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('42 haskellers')

  {
    isOk: false,
    pos: 3,
    expected: 'spartans'
  }
  ```
</details>
