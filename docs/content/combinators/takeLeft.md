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
  uint(),
  sequence(whitespace(), string('spartans'))
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('42 spartans')

  {
    kind: 'success',
    state: { text: '42 spartans', index: 11 },
    value: 42
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('300 haskellers')

  {
    kind: 'failure',
    state: { text: '300 haskellers', index: 4 },
    expected: 'spartans'
  }
  ```
</details>
