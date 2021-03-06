---
title: 'takeMid'
kind: 'composite'
description: 'takeMid combinator takes exactly three parsers and applies them in order. Returns the result of the parser in the middle.'
---

```typescript {{ withLineNumbers: false }}
function takeMid<T1, T2, T3>(
  p1: Parser<T1>,
  p2: Parser<T2>,
  p3: Parser<T3>
): Parser<T2>
```

## Description

`takeMid` combinator takes exactly **three** parsers and applies them in order. Returns the result of the `p2` parser in the middle.

## Usage

```typescript
const Parser = takeMid(
  sequence(string('fn'), whitespace()),
  letters(),
  rest()
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('fn multiply x y')

  {
    isOk: true,
    pos: 15,
    value: 'multiply'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('fn 100 x y')

  {
    isOk: false,
    pos: 3,
    expected: 'letters'
  }
  ```
</details>
