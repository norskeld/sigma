---
title: 'string'
kind: 'primitive'
description: 'string parses a string. Returns the parsed string.'
---

# string <Primitive />

## Signature

```ts
function string(match: string): Parser<string>
```

## Description

`string` parses a string. Returns the parsed string.

## Usage

```ts
const Parser = string('hello')
```

::: tip Success
```ts
run(Parser).with('hello')

{
  isOk: true,
  span: [ 0, 5 ],
  pos: 5,
  value: 'hello'
}
```
:::

::: danger Failure
```ts
run(Parser).with('bye')

{
  isOk: false,
  span: [ 0, 3 ],
  pos: 0,
  expected: 'hello'
}
```
:::
