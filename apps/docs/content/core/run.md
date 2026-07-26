---
title: 'run'
description: 'run is used to run parser with provided input.'
---

# run

`run` is used to run `parser` with provided input.

## Usage

```ts
run(string('hello world')).with('hello world')
```

::: tip Success
```ts
{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: 'hello world',
  errors: []
}
```
:::

::: danger Failure
```ts
{
  isOk: false,
  start: 0,
  end: 0,
  pos: 0,
  expected: 'hello world',
  label: null,
  errors: []
}
```
:::

## Recovered failures

Every result carries `errors`, the failures the run recovered from via [recover]. A result with a non-empty `errors` and `isOk: true` is a partial parse: the value is usable and each entry describes a syntax error. Failures additionally carry `label`, set by [commit].

`run` tolerates recovered failures; [tryRun] throws on them.

```ts
const Program = many(
  recover(Statement, syncPast(string(';')), (_failure, span) => ({ kind: 'error', span }))
)

run(Program).with('let a;let ;let c;')

{
  isOk: true,
  start: 0,
  end: 17,
  pos: 17,
  value: [ /* let, error, let */ ],
  errors: [
    { isOk: false, start: 10, end: 10, pos: 10, expected: 'letters', label: 'stmt', errors: [] }
  ]
}
```

Examples on the other pages omit `errors` and `label` for brevity, but both are always present.

<!-- Links. -->

[commit]: ../combinators/commit
[recover]: ../combinators/recover
[tryRun]: ./tryRun
