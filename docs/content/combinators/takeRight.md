---
title: 'Сombinators › takeRight'
description: 'takeRight combinator takes exactly two parsers and applies them in order. Returns the result of the rightmost parser.'
---

# takeRight

```typescript {{ withLineNumbers: false }}
function takeRight<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T2>
```

## Description

> Note: This combinator is not primitive, i.e. it is defined using other combinators.

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
    kind: 'success',
    state: { text: 'let binding', index: 11 },
    value: 'binding'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('let 42')

  {
    kind: 'failure',
    state: { text: 'let 42', index: 4 },
    expected: 'letters'
  }
  ```
</details>
