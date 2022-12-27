---
title: 'whitespace'
kind: 'composite'
description: 'whitespace parses whitespace, either a single character or consecutive ones. Returns the matched character(s).'
---

# {{ $frontmatter.title }} <Composite />

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
  pos: 5,
  expected: 'whitespace'
}
```
:::
