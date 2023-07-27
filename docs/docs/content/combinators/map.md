---
title: 'map'
kind: 'primitive'
description: "map combinator applies a function to the parser's result and returns the result of that function."
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function map<T, R>(parser: Parser<T>, fn: (value: T) => R): Parser<R>
```

## Description

`map` combinator applies `fn` to the `parser`'s result and returns the result of that `fn`.

## Usage

```ts
function add([left, right]: [number, number]): number {
  return left + right
}

const Parser = map(
  takeSides(whole(), string('+'), whole()),
  add
)
```

::: tip Success
```ts
run(Parser).with('2+2')

{
  isOk: true,
  span: [ 0, 3 ],
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
  span: [ 1, 2 ],
  pos: 2,
  expected: '+'
}
```
:::
