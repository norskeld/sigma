---
title: 'choice'
kind: 'primitive'
description: 'choice combinator tries to apply parsers in order, until one of them succeeds. Returns a value of the succeeding parser.'
---

# choice <Primitive />

## Signature

<<< @/../../../src/combinators/choice.ts{signature}

## Description

<<< @/../../../src/combinators/choice.ts{description}

## Usage

```ts
const Parser = choice(
  string('true'),
  string('false')
)
```

::: tip Success
```ts
run(Parser).with('true')

{
  isOk: true,
  span: [ 0, 4 ],
  pos: 4,
  value: 'true'
}
```
:::

Notice how the `expected` field differs depending on the input, specifically its length.

::: danger Failure
```ts{7}
run(Parser).with('yank')

{
  isOk: false,
  span: [ 0, 4 ],
  pos: 0,
  expected: 'true'
}
```
---
```ts{7}
run(Parser).with('maybe')

{
  isOk: false,
  span: [ 0, 5 ],
  pos: 0,
  expected: 'false'
}
```
:::
