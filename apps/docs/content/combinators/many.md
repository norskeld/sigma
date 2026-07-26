---
title: 'many'
description: 'many combinator applies parser zero or more times. Returns an array of the returned values of parser.'
---

# many

`many` combinator applies `parser` *zero* or more times. Returns an array of the returned values of `parser`. This combinator never fails on its own and returns an empty list if nothing matched, but a [committed][commit] failure from `parser` propagates instead of ending the loop. Successes that consume no input are not collected, so the combinator always terminates.

## Usage

```ts
const Parser = many(string('+'))
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

::: danger Success
```ts
run(Parser).with('---')

{
  isOk: true,
  start: 0,
  end: 0,
  pos: 0,
  value: []
}
```
:::

<!-- Links. -->

[commit]: ./commit
