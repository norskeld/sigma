---
title: 'regexp'
kind: 'primitive'
description: 'regexp parses a string that matches a provided regular expression. Returns the matched string, or fails with a provided message.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function regexp(re: RegExp, expected: string): Parser<string>
```

## Description

`regexp` parses a string that matches a provided `re` regular expression. Returns the matched string, or fails with an `expected` message.

## Implementation notes

The regular expression must obey two simple rules:

- It *does* use `g` flag. Flags like `u` and `i` are allowed and can be added if needed.
- It *doesn't* use `^` and `$` to match at the beginning or at the end of the text.

## Usage

```ts
const Parser = regexp(/\p{Emoji_Presentation}/gu, 'emoji')
```

::: tip Success
```ts
run(Parser).with('👌')

{
  isOk: true,
  pos: 2,
  value: '👌'
}
```
:::

::: danger Failure
```ts
run(Parser).with('大')

{
  isOk: false,
  pos: 0,
  expected: 'emoji'
}
```
:::
