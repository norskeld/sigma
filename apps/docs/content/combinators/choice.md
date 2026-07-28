---
title: 'choice'
description: 'choice combinator tries to apply parsers in order, until one of them succeeds. Returns a value of the succeeding parser.'
---

# choice

`choice` combinator tries to apply `ps` parsers in order, until one of them succeeds. Returns a value of the succeeding parser. A [committed][commit] failure stops it right there and is reported as is, not as the failure that got the furthest. Anything a discarded alternative [recovered][recover] is dropped along with that alternative.

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
  start: 0,
  end: 4,
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
  start: 0,
  end: 4,
  pos: 0,
  expected: 'true'
}
```
---
```ts{7}
run(Parser).with('maybe')

{
  isOk: false,
  start: 0,
  end: 4,
  pos: 0,
  expected: 'true'
}
```
:::

<!-- Links. -->

[commit]: ./commit
[recover]: ./recover
