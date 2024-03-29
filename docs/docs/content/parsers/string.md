---
title: 'string'
kind: 'primitive'
description: 'string parses an ASCII string. Returns the parsed string.'
---

# string <Primitive />

## Signature

```ts
function string(match: string): Parser<string>
```

## Description

> For parsing Unicode strings, consider using [ustring].

`string` parses an *ASCII* string. Returns the parsed string.

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
  span: [ 0, 0 ],
  pos: 0,
  expected: 'hello'
}
```
:::

<!-- Parsers. -->

[ustring]: ./ustring.md
