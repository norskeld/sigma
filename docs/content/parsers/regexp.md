---
title: 'regexp'
kind: 'primitive'
description: 'regexp parses a string that matches a provided regular expression. Returns the matched string, or fails with a provided message.'
---

```typescript {{ withLineNumbers: false }}
function regexp(re: RegExp, expected: string): Parser<string>
```

## Description

`regexp` parses a string that matches a provided `re` regular expression. Returns the matched string, or fails with an `expected` message.

## Implementation notes

The regular expression must obey three simple rules:

- It *does* use `g` flag. Flags like `u` and `i` are allowed and can be added if needed.
- It *doesn't* use `^` and `$` to match at the beginning or at the end of the text.
- It *doesn't* use capturing groups.

## Usage

```typescript
const Parser = regexp(/\p{Emoji_Presentation}/gu, 'emoji')
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with('👌')

  {
    kind: 'success',
    state: { text: '👌', index: 2 },
    value: '👌'
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with('大')

  {
    kind: 'failure',
    state: { text: '大', index: 0 },
    expected: 'emoji'
  }
  ```
</details>
