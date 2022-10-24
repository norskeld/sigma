---
title: 'rest'
kind: 'primitive'
description: 'rest simply returns the unparsed input as a string. Never fails.'
---

# {{ $frontmatter.title }}

## Signature

```ts
function rest(): Parser<string>
```

## Description

`rest` simply returns the unparsed input as a string. Never fails.

## Usage

```ts
const Parser = sequence(string('hello'), rest())
```

::: tip Success
```ts
run(Parser).with('hello world')

{
  isOk: true,
  pos: 11,
  value: ['hello', ' world']
}
```
:::

