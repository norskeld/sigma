---
title: 'eol'
kind: 'composite'
description: 'eol only succeeds at the end of the line with a matched line break character.'
---

```typescript {{ withLineNumbers: false }}
function eol(): Parser<string>
```

## Description

`eol` only succeeds at the end of the line with a matched line break character.

## Usage

```typescript
const Parser = sequence(
  sequence(string('<start>'), eol()),
  sequence(string('<body>'), eol()),
  sequence(string('<end>'), eol())
)
```

<details>
  <summary>Output</summary>

  ### Success

  ```typescript
  run(Parser).with(`<start>\n<body>\n<end>\n`)

  {
    isOk: true,
    pos: 21,
    value: [
      [ '<start>', '\n' ],
      [ '<body>', '\n' ],
      [ '<end>', '\n' ]
    ]
  }
  ```

  ### Failure

  ```typescript
  run(Parser).with(`<start>\n<body><end>\n`)

  {
    isOk: false,
    pos: 14,
    expected: 'end of line'
  }
  ```
</details>
