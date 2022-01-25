---
title: 'Сombinators › sequence'
description: 'sequence combinator applies parsers in order, until all of them succeed. Returns a tuple of values returned by parsers.'
---

# sequence

```typescript {{ withLineNumbers: false }}
function sequence<T extends Array<Parser<unknown>>>(...ps: T): Parser<ToTuple<T>>
function sequence<T>(...ps: Array<Parser<T>>): Parser<Array<T>>
```

## Description

`sequence` combinator applies `ps` parsers in order, until *all* of them succeed. Returns [a tuple][typescript-tuple] of values returned by `ps` parsers.

## Usage

```typescript
const Parser = sequence(string('hello'), whitespace(), string('world'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('hello world')

  {
    kind: 'success',
    state: { text: 'hello world', index: 11 },
    value: [ 'hello', ' ', 'world' ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('hello friend')

  {
    kind: 'failure',
    state: { text: 'hello friend', index: 6 },
    expected: 'world'
  }
  ```
</details>

<!-- Links. -->

[typescript-tuple]: https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
