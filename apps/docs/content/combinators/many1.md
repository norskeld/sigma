---
title: 'many1'
description: 'many1 combinator applies parser one or more times. Returns an array of the returned values of parser.'
---

# many1

`many1` combinator applies `parser` *one* or more times. Returns an array of the returned values of `parser`. After the first match, a success that consumes no input ends the loop and isn't collected, so the combinator always terminates. A [committed][commit] failure from `parser` propagates instead of ending the loop, and the cursor rewinds to where the combinator started.

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

<!-- Links. -->

[commit]: ./commit
