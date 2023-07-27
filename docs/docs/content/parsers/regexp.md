---
title: 'regexp'
kind: 'primitive'
description: 'regexp parses a string that matches a provided regular expression. Returns the matched string, or fails with a provided message.'
---

# regexp <Primitive />

## Signature

```ts
function regexp(rs: RegExp, expected: string): Parser<string>
```

## Description

`regexp` parses a string that matches a provided `re` regular expression. Returns the matched string, or fails with an `expected` message.

## Implementation notes

::: warning
If `g` flag is missing, it will be automatically injected. It's still better to always provide it to avoid small performance penalty and clearly document the intention.
:::

The regular expression must obey two simple rules:

- It *does* use g flag. Flags like u and i are allowed and can be added if needed.
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
  span: [ 0, 2 ],
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
  span: [ 0, 0 ],
  pos: 0,
  expected: 'emoji'
}
```
:::
