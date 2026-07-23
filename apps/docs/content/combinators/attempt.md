---
title: 'attempt'
description: "attempt combinator applies parser and behaves exactly like it on success. On failure it pretends that no input was consumed."
---

# attempt

`attempt` combinator applies `parser` and behaves exactly like it on success. On failure it pretends that no input was consumed: the failure's `pos` is reset to the position `attempt` was applied at, while `span` still covers the attempted region.

Since [choice] retries alternatives from the same position regardless of how much a failed alternative consumed, `attempt` doesn't change what can be parsed. It only affects error reporting: [choice] reports the failure that consumed the most input, and wrapping an alternative in `attempt` excludes it from that selection.

## Usage

Both parsers below fail on the same input, but report different errors: `Plain` reports the deepest failure, coming from the first alternative, while `Attempted` demotes the first alternative and reports the failure of the second one.

```ts
const First = sequence(string('foo'), string('bar'))
const Second = sequence(string('fo'), string('x'))

const Plain = choice(First, Second)
const Attempted = choice(attempt(First), Second)
```

::: danger Failure
```ts
run(Plain).with('football')

{
  isOk: false,
  start: 3,
  end: 6,
  pos: 3,
  expected: 'bar'
}
```
---
```ts
run(Attempted).with('football')

{
  isOk: false,
  start: 2,
  end: 3,
  pos: 2,
  expected: 'x'
}
```
:::

<!-- Links. -->

[choice]: ./choice
