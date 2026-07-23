---
title: 'many1'
description: 'many1 combinator applies parser one or more times. Returns an array of the returned values of parser.'
---

# many1

`many1` combinator applies `parser` *one* or more times. Returns an array of the returned values of `parser`. After the first match, successes that consume no input are not collected, so the combinator always terminates.

## Usage

```ts
const Parser = many1(string('+'))
```

::: tip Success
```ts
run(Parser).with('+++')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: [ '+', '+', '+' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('---')

{
  isOk: false,
  start: 0,
  end: 1,
  pos: 0,
  expected: '+'
}
```
:::
