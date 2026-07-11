---
title: 'not'
kind: 'primitive'
description: 'not combinator applies parser without consuming any input and succeeds only if it fails, i.e. acts as negative lookahead.'
---

# not <Primitive />

## Signature

```ts
function not(parser: Parser<unknown>, expected?: string): Parser<null>
```

## Description

`not` combinator applies `parser` without consuming any input and succeeds with `null` only if it fails, i.e. acts as the negative counterpart of [lookahead]. If `parser` succeeds, `not` fails with `expected`, which defaults to `unexpected input`.

## Usage

The example below parses the `let` keyword, rejecting identifiers that merely start with it, like `letx`.

```ts
const Parser = takeLeft(string('let'), not(letter(), 'keyword boundary'))
```

::: tip Success
```ts
run(Parser).with('let x')

{
  isOk: true,
  span: [ 0, 3 ],
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
  span: [ 3, 4 ],
  pos: 3,
  expected: 'keyword boundary'
}
```
:::

<!-- Links. -->

[lookahead]: ./lookahead
