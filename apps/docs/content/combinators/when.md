---
title: 'when'
description: 'when combinator allows to create chained, context-aware parsers, that may depend on the output of the context parser.'
---

# when

`when` combinator allows to create chained, context-aware parsers, that may depend on the output of the `context` parser. Returns a parser produced by the `parser` callback, which is called only if the `context` parser succeeds, i.e. if it fails, then `when` fails as well. A failure of the produced parser rewinds the cursor to before `context`, so the whole chain is retried or reported as one unit.

## Usage

```ts
const Parser = when(first(letters(), whitespace()), ({ value }) => {
  switch (value) {
    case 'integer': return integer()
    case 'string': return letters()
    case 'bracketed': return inner(string('('), letters(), string(')'))
    default: return rest()
  }
})
```

::: tip Success
```ts
run(Parser).with('integer 42')

{
  isOk: true,
  start: 0,
  end: 10,
  pos: 10,
  value: 42
}
```
---
```ts
run(Parser).with('string Something')

{
  isOk: true,
  start: 0,
  end: 16,
  pos: 16,
  value: 'Something'
}
```
---
```ts
run(Parser).with('bracketed (Something)')

{
  isOk: true,
  start: 0,
  end: 21,
  pos: 21,
  value: 'Something'
}
```
---
```ts
run(Parser).with('some input')

{
  isOk: true,
  start: 0,
  end: 10,
  pos: 10,
  value: 'input'
}
```
:::

::: danger Failure
```ts
run(Parser).with('0x42')

{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'letters'
}
```
:::
