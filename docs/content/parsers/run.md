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
    isOk: true,
    pos: 11,
    value: 'hello world'
  }
  ```

  ### Failure

  ```typescript
  {
    isOk: false,
    pos: 0,
    expected: 'hello world'
  }
  ```
</details>
