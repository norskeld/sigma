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
  sequence(integer(), string('+'), integer()),
  5
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('2+2')

  {
    isOk: true,
    pos: 3,
    value: 5
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('2-2')

  {
    isOk: false,
    pos: 1,
    expected: '+'
  }
  ```
</details>
