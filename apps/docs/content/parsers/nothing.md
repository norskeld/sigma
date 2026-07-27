---
title: 'nothing'
description: 'nothing simply resolves to null. It consumes no input and never fails.'
---

# nothing

`nothing` simply resolves to `null`. It consumes no input and never fails, so it works as a default branch in combinators like [choice], or as a placeholder to [mapTo] something else.

## Usage

The example below reads an optional sign, defaulting to a positive one.

```ts
const Parser = choice(
  mapTo(string('-'), -1),
  mapTo(nothing(), 1)
)
```

::: tip Success
```ts
run(Parser).with('-')

{
  isOk: true,
  start: 0,
  end: 1,
  pos: 1,
  value: -1
}
```
:::

::: tip Success
```ts
run(Parser).with('42')

{
  isOk: true,
  start: 0,
  end: 0,
  pos: 0,
  value: 1
}
```
:::

<!-- Combinators. -->

[choice]: ../combinators/choice
[mapTo]: ../combinators/mapTo
