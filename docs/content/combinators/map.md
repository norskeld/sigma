---
title: 'Сombinators › map'
description: "map combinator applies a function to the parser's result and returns the result of that function."
---

# map

```typescript {{ withLineNumbers: false }}
function map<T, R>(parser: Parser<T>, fn: (value: T) => R): Parser<R>
```

## Description

`map` combinator applies `fn` to the `parser`'s result and returns the result of that `fn`.

## Usage

```typescript
function add([left, _, right]: [number, string, number]): number {
  return left + right
}

const Parser = map(
  sequence(int(), string('+'), int()),
  add
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
    value: 4
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
