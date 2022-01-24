---
title: 'many'
---

# many

```typescript {{ withLineNumbers: false }}
function many<T>(parser: Parser<T>): Parser<Array<T>>
```

## Description

`many` combinator applies the `parser` *zero* or more times. Returns an array of the returned values of `parser`.

## Usage

```typescript
const Parser = many(string('+'))
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('+++')

  {
    kind: 'success',
    state: { text: '+++', index: 3 },
    value: [ '+', '+', '+' ]
  }
  ```

  ### Failure

  `many` actually never fails, but returns an empty array if the given `parser` fails.

  ```typescript
  run(Parser).with('---')

  {
    kind: 'success',
    state: { text: '---', index: 0 },
    value: []
  }
  ```
</details>
