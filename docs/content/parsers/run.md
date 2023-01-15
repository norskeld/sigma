---
title: 'run'
kind: 'primitive'
description: 'run is used to run parser with provided input.'
---

# {{ $frontmatter.title }} <Primitive />

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
  pos: 11,
  value: 'hello world'
}
```
:::

::: danger Failure
```ts
{
  isOk: false,
  pos: 0,
  expected: 'hello world'
}
```
:::
