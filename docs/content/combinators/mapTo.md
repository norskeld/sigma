---
title: 'mapTo'
kind: 'composite'
description: "mapTo combinator maps the parser's result to a constant value."
---

```typescript {{ withLineNumbers: false }}
function mapTo<T, R>(parser: Parser<T>, value: R): Parser<R>
```

## Description

`mapTo` combinator maps the `parser`'s result to a constant `value`.

## Usage

```typescript
const Parser = mapTo(
  sequence(int(), string('+'), int()),
  5
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('2+2')

  {
    kind: 'success',
    state: { text: '2+2', index: 3 },
    value: 5
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('2-2')

  {
    kind: 'failure',
    state: { text: '2-2', index: 1 },
    expected: '+'
  }
  ```
</details>
