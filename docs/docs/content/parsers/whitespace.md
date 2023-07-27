---
title: 'whitespace'
kind: 'composite'
description: 'whitespace parses whitespace, either a single character or consecutive ones. Returns the matched character(s).'
---

# whitespace <Composite />

## Signature

```ts
function whitespace(): Parser<string>
```

## Description

`whitespace` parses whitespace, either a single character or consecutive ones. Returns the matched character(s).

## Usage

```ts
const Parser = sequence(string('hello'), whitespace(), string('world'))
```

::: tip Success
```ts
run(Parser).with('hello world')

{
  isOk: true,
  span: [ 0, 11 ],
  pos: 11,
  value: [ 'hello', ' ', 'world' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('helloworld')

{
  isOk: false,
  span: [ 5, 5 ],
  pos: 5,
  expected: 'whitespace'
}
```
:::
