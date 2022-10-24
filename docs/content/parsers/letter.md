---
title: 'letter'
kind: 'composite'
description: 'letter parses a single alphabetical character. Returns the matched character. Unicode friendly.'
---

# {{ $frontmatter.title }}

## Signature

```ts
function letter(): Parser<string>
```

## Description

`letter` parses a single alphabetical character. Returns the matched character. Unicode friendly.

## Usage

```ts
const Parser = letter()
```

::: tip Success
```ts
run(Parser).with('X')

{
  isOk: true,
  pos: 1,
  value: 'X'
}
```
---
```ts
run(Parser).with('こ')

{
  isOk: true,
  pos: 1,
  value: 'こ'
}
```
:::

::: danger Failure
```ts
run(Parser).with('8')

{
  isOk: false,
  pos: 0,
  expected: 'letter'
}
```
:::
