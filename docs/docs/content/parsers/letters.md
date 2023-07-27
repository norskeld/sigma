---
title: 'letters'
kind: 'composite'
description: 'letters parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.'
---

# letters <Composite />

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
  span: [ 0, 2 ],
  pos: 2,
  value: 'XY'
}
```
---
```ts
run(Parser).with('meaningOfLifeIs42')

{
  isOk: true,
  span: [ 0, 15 ],
  pos: 15,
  value: 'meaningOfLifeIs'
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
  expected: 'letters'
}
```
:::
