---
title: 'choice'
description: 'choice combinator tries to apply parsers in order, until one of them succeeds. Returns a value of the succeeding parser.'
---

# choice <Primitive />

`choice` combinator tries to apply `ps` parsers in order, until one of them succeeds. Returns a value of the succeeding parser.

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

If all parsers fail, the failure that progressed furthest into the input is reported; on a tie, the first one wins.

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
  span: [ 0, 4 ],
  pos: 0,
  expected: 'true'
}
```
:::
