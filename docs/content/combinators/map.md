---
title: 'map'
kind: 'primitive'
description: "map combinator applies a function to the parser's result and returns the result of that function."
---

```typescript {{ withLineNumbers: false }}
function map<T, R>(parser: Parser<T>, fn: (value: T) => R): Parser<R>
```

## Description

`map` combinator applies `fn` to the `parser`'s result and returns the result of that `fn`.

## Usage

```typescript
function add([left, right]: [number, number]): number {
  return left + right
}

const Parser = map(
  takeSides(whole(), string('+'), whole()),
  add
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
    value: 4
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
