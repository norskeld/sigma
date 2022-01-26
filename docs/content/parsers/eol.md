---
title: 'Parsers › eol'
description: 'eol only succeeds at the end of the line with a matched line break character.'
---

# eol

```typescript {{ withLineNumbers: false }}
function eol(): Parser<string>
```

## Description

> Note: This parser is not primitive, i.e. it is defined using other parsers and combinators.

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
    kind: 'success',
    state: { text: '<start>\n<body>\n<end>\n', index: 21 },
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
    kind: 'failure',
    state: { text: '<start>\n<body><end>\n', index: 14 },
    expected: 'end of line'
  }
  ```
</details>
