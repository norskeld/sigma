---
title: 'defer'
kind: 'primitive'
description: 'defer is a special parser that is tailored for creating mutually recursive parsers.'
---

```typescript {{ withLineNumbers: false }}
interface Deferred<T> extends Parser<T> {
  with(parser: Parser<T>): void
}

function defer<T>(): Deferred<T>
```

## Description

`defer` is a special parser that has an additional `with` method, which should be used to define the parser. This parser is tailored for creating mutually recursive parsers.

## Example

<details>
  <summary>Combinators and parsers used in this section</summary>

  - Combinators: [choice], [sepBy], [map], [takeMid]
  - Parsers: [defer], [int], [string]
</details>

In the example below we are parsing simple nested tuples like `(1,2,(3,(4,5)))` into an AST, which then can be somehow manipulated.

```typescript
interface NumberNode {
  type: 'number'
  value: number
}

interface ListNode {
  type: 'list'
  value: Array<NumberNode | ListNode>
}

const TupleList = defer<ListNode>()
const TupleNumber = defer<NumberNode>()

TupleNumber.with(
  map(
    int(),
    (value) => ({ type: 'number', value })
  )
)

TupleList.with(
  map(
    takeMid(
      string('('),
      sepBy(choice(TupleList, TupleNumber), string(',')),
      string(')')
    ),
    (value) => ({ type: 'list', value })
  )
)
```

If we run our parser and feed it with input:

```typescript
run(TupleList).with('(1,2,(3,(4,5)))')
```

We will get the following result:

```typescript
{
  isOk: true,
  pos: 15,
  value: {
    type: 'list',
    value: [
      { type: 'number', value: 1 },
      { type: 'number', value: 2 },
      {
        type: 'list',
        value: [
          { type: 'number', value: 3 },
          {
            type: 'list',
            value: [
              { type: 'number', value: 4 },
              { type: 'number', value: 5 }
            ]
          }
        ]
      }
    ]
  }
}
```

<!-- Combinators. -->

[choice]: ../combinators/choice
[map]: ../combinators/map
[sepBy]: ../combinators/sepBy
[takeMid]: ../combinators/takeMid

<!-- Parsers. -->

[defer]: ./defer
[int]: ./int
[string]: ./string
