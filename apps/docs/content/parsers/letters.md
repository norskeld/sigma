---
title: 'letters'
description: 'letters parses a sequence of alphabetical characters. Returns matched characters as a string. Unicode friendly.'
---

# letters

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
  start: 0,
  end: 2,
  pos: 2,
  value: 'XY'
}
```
---
```ts
run(Parser).with('meaningOfLifeIs42')

{
  isOk: true,
  start: 0,
  end: 15,
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
  start: 0,
  end: 0,
  pos: 0,
  expected: 'letters'
}
```
:::
