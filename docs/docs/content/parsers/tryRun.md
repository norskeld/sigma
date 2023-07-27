---
title: 'tryRun'
kind: 'primitive'
description: 'tryRun is used to run parser with provided input, throwing an error on failure.'
---

# tryRun <Primitive />

## Signature

```ts
interface Runnable<T> {
  with(input: string): Success<T>
}

function tryRun<T>(parser: Parser<T>): Runnable<T>
```

## Description

`tryRun` is is used to run `parser` with provided input, **throwing `ParserError` on failure**.

## Usage

```ts
tryRun(string('hello world')).with('hello world')
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
<ParserError>
```
:::
