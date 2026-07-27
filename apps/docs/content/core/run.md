---
title: 'run'
description: 'run is used to run parser with provided input.'
---

# run

`run` is used to run `parser` with provided input.

## Usage

::: tip Success
```ts
run(string('hello world')).with('hello world')

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
run(string('hello world')).with('bye')

{
  isOk: false,
  start: 0,
  end: 3,
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
const Statement = map(
  first(last(string('let '), commit(letters(), 'stmt')), string(';')),
  (name) => ({ kind: 'let', name })
)

const Program = many(
  recover(Statement, syncPast(string(';')), (_failure, span) => ({ kind: 'error', span }))
)
```

```ts
run(Program).with('let a;let ;let c;')

{
  isOk: true,
  start: 0,
  end: 17,
  pos: 17,
  value: [
    { kind: 'let', name: 'a' },
    { kind: 'error', span: { start: 6, end: 11 } },
    { kind: 'let', name: 'c' }
  ],
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
