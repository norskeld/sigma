---
title: 'error'
kind: 'primitive'
description: 'error combinator allows to replace error message for parser.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function error<T>(parser: Parser<T>, expected: string): Parser<T>
```

## Description

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
  span: [ 0, 4 ],
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
  span: [ 0, 5 ],
  pos: 5,
  expected: "expecting either 'true' or 'false'"
}
:::
