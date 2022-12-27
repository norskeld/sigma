---
title: 'letters'
kind: 'composite'
description: 'letters parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.'
---

# {{ $frontmatter.title }} <Composite />

## Signature

```ts
function letters(): Parser<string>
```

## Description

`letters` parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.

## Usage

```ts
const Parser = letters()
```

::: tip Success
```ts
run(Parser).with('XY')

{
  isOk: true,
  pos: 1,
  value: 'XY'
}
```
---
```ts
run(Parser).with('meaningOfLife42')

{
  isOk: true,
  pos: 13,
  value: 'meaningOfLife'
}
```
:::

::: danger Failure
```ts
run(Parser).with('42')

{
  isOk: false,
  pos: 0,
  expected: 'letters'
}
```
:::
