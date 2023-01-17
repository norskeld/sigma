---
title: 'eol'
kind: 'composite'
description: 'eol only succeeds at the end of the line with a matched line break character.'
---

# {{ $frontmatter.title }} <Composite />

## Signature

```ts
function eol(): Parser<string>
```

## Description

`eol` only succeeds at the end of the line with a matched line break character.

## Usage

```ts
const Parser = sequence(
  sequence(string('<start>'), eol()),
  sequence(string('<body>'), eol()),
  sequence(string('<end>'), eol())
)
```

::: tip Success
```ts
run(Parser).with(`<start>\n<body>\n<end>\n`)

{
  isOk: true,
  span: [ 0, 21 ],
  pos: 21,
  value: [
    [ '<start>', '\n' ],
    [ '<body>', '\n' ],
    [ '<end>', '\n' ]
  ]
}
```
:::

::: danger Failure
```ts
run(Parser).with(`<start>\n<body><end>\n`)

{
  isOk: false,
  span: [ 14, 16 ],
  pos: 14,
  expected: 'end of line'
}
```
:::
