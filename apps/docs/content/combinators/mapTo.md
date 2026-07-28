---
title: 'mapTo'
description: "mapTo combinator maps the parser's result to a constant value."
---

# mapTo

`mapTo` combinator maps the `parser`'s result to a constant `value`.

## Usage

```ts
const Parser = mapTo(
  sequence(integer(), string('+'), integer()),
  5
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
  value: 5
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
