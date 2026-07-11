---
title: 'grammar'
kind: 'core'
description: 'This simplifies the creation of a self-contained grammar.'
---

# grammar

## Description

`grammar` is used to create a self-contained grammar.

Similarly to [defer], this allows for the creation of mutually recursive parsers,
but lets you define all of the component parsers within a single call.

The function takes an object with parser initializers, and returns an object with
all of those parsers initialized. Within the parser initializers, use `this` to
reference other initialized parsers, as in the example below.

The properties of the resulting object are just regular parsers - you can freely
destructure these, pass them around individually, or compose them with other
grammars, parsers or combinators as needed.

## Usage

Here is an example of a simple grammar that recursively matches `ab` sequences:

```ts
const ab = grammar({
  a(): Parser<string> {
    return map(
      sequence(
        string('a'),
        optional(this.b)
      ),
      ([a, b]) => a + (b ?? '')
    )
  },
  b(): Parser<string> {
    return map(
      sequence(
        string('b'),
        choice(this.a, this.b)
      ),
      ([b, a]) => b + a
    )
  }
})
```

The individual properties are just regular parsers:

```ts
const { a } = ab

console.log(run(a).with('abba'))
```

::: tip Success
```ts
{
  isOk: true,
  span: [0, 4],
  pos: 4,
  value: 'abba'
}
```
:::

[defer]: ../parsers/defer
