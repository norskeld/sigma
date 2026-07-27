---
title: 'not'
description: 'not combinator applies parser without consuming any input and succeeds only if it fails, i.e. acts as negative lookahead.'
---

# not

`not` combinator applies `parser` without consuming any input and succeeds with `null` only if it fails, i.e. acts as the negative counterpart of [lookahead]. If `parser` succeeds, `not` fails with `expected`, which defaults to `unexpected input`.

A [committed][commit] failure propagates instead of counting as a non-match, so wrap `parser` in [backtrack] to keep it speculative.

## Usage

The example below parses the `let` keyword, rejecting identifiers that merely start with it, like `letx`.

```ts
const Parser = first(string('let'), not(letter(), 'keyword boundary'))
```

::: tip Success
```ts
run(Parser).with('let x')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: 'let'
}
```
:::

::: danger Failure
```ts
run(Parser).with('letx')

{
  isOk: false,
  start: 3,
  end: 4,
  pos: 3,
  expected: 'keyword boundary'
}
```
:::

<!-- Links. -->

[lookahead]: ./lookahead
[commit]: ./commit
[backtrack]: ./backtrack
