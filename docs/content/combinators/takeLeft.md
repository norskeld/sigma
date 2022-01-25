---
title: 'Сombinators › takeLeft'
description: 'takeLeft combinator takes exactly two parsers and applies them in order. Returns the result of the leftmost parser.'
---

# takeLeft

```typescript {{ withLineNumbers: false }}
function takeLeft<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1>
```

## Description

> Note: This combinator is not primitive, i.e. it is defined using other combinators.

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
