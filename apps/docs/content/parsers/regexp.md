---
title: 'regexp'
description: 'regexp parses a string that matches a provided regular expression. Returns the matched string, or fails with a provided message.'
---

# regexp

`regexp` parses a string that matches a provided `re` regular expression. Returns the matched string, or fails with an `expected` message.

## Implementation notes

::: warning
Matching is performed in sticky mode, so `g` and `y` flags are handled automatically.
:::

The regular expression must obey one simple rule: it *doesn't* use `^` and `$` to match at the beginning or at the end of the text. Flags like u and i are allowed and can be added if needed.

## Usage

```ts
const Parser = regexp(/\p{Emoji_Presentation}/gu, 'emoji')
```

::: tip Success
```ts
run(Parser).with('👌')

{
  isOk: true,
  start: 0,
  end: 2,
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
  start: 0,
  end: 0,
  pos: 0,
  expected: 'emoji'
}
```
:::
