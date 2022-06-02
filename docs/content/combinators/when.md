---
title: 'when'
kind: 'primitive'
description: "when combinator allows to create chained, context-aware parsers, that may depend on the output of the context parser."
---

```typescript {{ withLineNumbers: false }}
function when<T, R extends Parser<unknown>>(
  context: Parser<T>,
  parser: (ctx: Context<T>) => R
): ToParser<R>
```

## Description

`when` combinator allows to create chained, context-aware `parser`s, that may depend on the output of the `context` parser.

## Usage

```typescript
const Parser = when(string('x'), () => string('y'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('xy')

  {
    isOk: true,
    pos: 2,
    value: 'y'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('yy')

  {
    isOk: false,
    pos: 1,
    expected: 'x'
  }
  ```
</details>
