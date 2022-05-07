---
title: 'run'
kind: 'primitive'
description: 'run is not a parser, but is used to run parser with provided input.'
---

```typescript {{ withLineNumbers: false }}
interface Runnable<T> {
  with(input: string): Result<T>
}

function run<T>(parser: Parser<T>): Runnable<T>
```

## Description

`run` is not a parser, but is used to run `parser` with provided input.

## Usage

```typescript
run(string('hello world')).with('hello world')
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  {
    kind: 'success',
    state: { text: 'hello world', index: 11 },
    value: 'hello world'
  }
  ```

  ### Failure

  ```typescript
  {
    kind: 'failure',
    state: { text: 'hello world', index: 0 },
    expected: 'hello world'
  }
  ```
</details>
