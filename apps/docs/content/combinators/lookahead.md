---
title: 'lookahead'
description: 'lookahead combinator applies parser without consuming any input on success.'
---

# lookahead <Primitive />

`lookahead` combinator applies `parser` without consuming any input on success. On failure the failure is returned as is, with `pos` pointing to the deepest position reached, which yields more precise errors.

## Usage

The example is rather contrived, but it clearly illustrates how the combinator works, allowing one, for example, collect ambiguous results for further processing.

```ts
const Parser = sequence(
  takeLeft(string('hello'), whitespace()),
  lookahead(string('let')),
  string('lettuce')
)
```

::: tip Success
```ts
run(Parser).with('hello lettuce')

{
  isOk: true,
  start: 0,
  end: 13,
  pos: 13,
  value: [ 'hello', 'let', 'lettuce' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('hello let')

{
  isOk: false,
  start: 6,
  end: 9,
  pos: 6,
  expected: 'lettuce'
}
```
---
```ts
run(Parser).with('hello something')

{
  isOk: false,
  start: 6,
  end: 9,
  pos: 6,
  expected: 'let'
}
```
:::
