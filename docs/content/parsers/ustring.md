---
title: 'ustring'
kind: 'primitive'
description: 'ustring parses a Unicode string. Returns the parsed string.'
---

# {{ $frontmatter.title }}

## Signature

```ts
function ustring(match: string): Parser<string>
```

## Description

> For parsing ASCII-only strings, consider using [string].

`ustring` parses a Unicode string. Returns the parsed string.

## Implementation notes

This parser is very similar to the [string] parser, except it takes a bit hacky (though performant) approach, that is based on counting length of the given `match` string *in bytes*. It then subslices and compares string slice with that `match` string.

It was tested on code points from the [Basic Multilingual Plane][bmp], but various tests showed that other planes are consumable as well, but that is not guaranteed. If you need guaranteed parsing of code points outside of the BMP, consider using [regexp] with `u` flag.

## Usage

```ts
const Parser = ustring('语言处理')
```

::: tip Success
Note that the index is **12**, which is correct, since every hieroglyph here takes **3 bytes**.

```ts{5}
run(Parser).with('语言处理')

{
  isOk: true,
  pos: 12,
  value: '语言处理'
}
```
:::

::: danger Failure
```ts
run(Parser).with('语言')

{
  isOk: false,
  pos: 0,
  expected: '语言处理'
}
```
:::

<!-- Links. -->

[bmp]: https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane

<!-- Parsers. -->

[string]: ./string
[regexp]: ./regexp
