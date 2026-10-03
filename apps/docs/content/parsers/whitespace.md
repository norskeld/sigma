---
title: 'whitespace'
description: 'whitespace parses whitespace, either a single character or consecutive ones. Returns the matched character(s).'
---

# whitespace

`whitespace` parses whitespace, either a single character or consecutive ones. Returns the matched character(s).

## Usage

```ts
const Parser = sequence(string('hello'), whitespace(), string('world'))
```

::: tip Success
```ts
run(Parser).with('hello world')

{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: [ 'hello', ' ', 'world' ]
}
```
:::

::: danger Failure
```ts
run(Parser).with('helloworld')

{
  isOk: false,
  start: 5,
  end: 5,
  pos: 5,
  expected: 'whitespace'
}
```
:::
