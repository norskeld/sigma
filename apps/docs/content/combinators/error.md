---
title: 'error'
description: 'error combinator allows to replace error message for parser.'
---

# error

`error` combinator allows to replace `parser`'s error message with `expected`.

A [committed][commit] failure keeps its own message, so a top-level `error` can't flatten the precise messages a grammar commits to. To label one, commit on the outside: `commit(error(parser, expected), label)`.

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
```
:::

<!-- Links. -->

[commit]: ./commit
