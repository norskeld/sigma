---
title: 'sepBy'
description: 'sepBy combinator parses zero or more occurrences of parser, separated by sep. Returns a list of values (without separator) returned by parser.'
---

# sepBy

`sepBy` combinator parses *zero* or more occurrences of `parser`, separated by `sep`. Returns a list of values (without separator) returned by `parser`. This combinator never fails and returns an empty list if nothing matched.

## Usage

```ts
const Parser = sepBy(whole(), string('+'))
```

::: tip Success
```ts
run(Parser).with('1+2+3+4')

{
  isOk: true,
  start: 0,
  end: 7,
  pos: 7,
  value: [ 1, 2, 3, 4 ]
}
```
---
```ts
run(Parser).with('1-two')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: [ 1 ]
}
```
---
```ts
run(Parser).with('one+two')

{
  isOk: true,
  start: 0,
  end: 0,
  pos: 0,
  value: []
}
```
:::
