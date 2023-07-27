---
title: 'letter'
kind: 'composite'
description: 'letter parses a single alphabetical character. Returns the matched character. Unicode friendly.'
---

# letter <Composite />

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
  span: [ 0, 1 ],
  pos: 1,
  value: 'X'
}
```
---
```ts
run(Parser).with('こ')

{
  isOk: true,
  span: [ 0, 1 ],
  pos: 1,
  value: 'こ'
}
```
:::

::: danger Failure
```ts
run(Parser).with('42')

{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'letter'
}
```
:::
