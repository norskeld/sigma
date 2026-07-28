---
title: 'map'
description: "map combinator applies a function to the parser's result and returns the result of that function."
---

# map

`map` combinator applies `fn` to the `parser`'s result and returns the result of that `fn`. `fn` also receives the result's span as its second argument.

## Usage

```ts
function add([left, right]: [number, number]): number {
  return left + right
}

const Parser = map(
  outer(whole(), string('+'), whole()),
  add
)
```

::: tip Success
```ts
run(Parser).with('2+2')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: 4
}
```
:::

::: danger Failure
```ts
run(Parser).with('2-2')

{
  isOk: false,
  start: 1,
  end: 2,
  pos: 1,
  expected: '+'
}
```
:::
