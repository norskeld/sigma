---
title: 'takeRight'
kind: 'composite'
description: 'takeRight combinator takes exactly two parsers and applies them in order. Returns the result of the rightmost parser.'
---

```typescript {{ withLineNumbers: false }}
function takeRight<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T2>
```

## Description

`takeRight` combinator takes exactly **two** parsers and applies them in order. Returns the result of the rightmost `p2` parser.

## Usage

```typescript
const Parser = takeRight(
  sequence(string('let'), whitespace()),
  letters()
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('let binding')

  {
    isOk: true,
    pos: 11,
    value: 'binding'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('let 42')

  {
    isOk: false,
    pos: 4,
    expected: 'letters'
  }
  ```
</details>
