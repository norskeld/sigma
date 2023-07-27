---
title: 'run'
kind: 'primitive'
description: 'run is used to run parser with provided input.'
---

# run <Primitive />

## Signature

```ts
interface Runnable<T> {
  with(input: string): Result<T>
}

function run<T>(parser: Parser<T>): Runnable<T>
```

## Description

`run` is used to run `parser` with provided input.

## Usage

```ts
run(string('hello world')).with('hello world')
```

::: tip Success
```ts
{
  isOk: true,
  span: [ 0, 11 ],
  pos: 11,
  value: 'hello world'
}
```
:::

::: danger Failure
```ts
{
  isOk: false,
  span: [ 0, 0 ],
  pos: 0,
  expected: 'hello world'
}
```
:::
