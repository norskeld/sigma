---
title: 'error'
description: 'error combinator allows to replace error message for parser.'
---

# error

`error` combinator allows to replace `parser`'s error message with `expected`.

## Usage

```ts
const Parser = error(
  choice(
    string('true'),
    string('false')
  ),
  `expecting either 'true' or 'false'`
)
```

::: tip Success
```ts
run(Parser).with('true')

{
  isOk: true,
  start: 0,
  end: 4,
  pos: 4,
  value: 'true'
}
```
:::

::: danger Failure
```ts
run(Parser).with('maybe')

{
  isOk: false,
  start: 0,
  end: 4,
  pos: 0,
  expected: "expecting either 'true' or 'false'"
}
:::
