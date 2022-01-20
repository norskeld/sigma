---
title: 'Parsers › defer'
description: 'defer is a special parser that is tailored for creating mutually recursive parsers.'
---

# defer

```typescript {{ withLineNumbers: false }}
function defer<T>(): Deferred<T>
```

## Description

`defer` is a special parser that has an additional `with` method, which should be used to define the parser. If parser was not defined via `with` method an error will be thrown.

This parser is tailored for creating mutually recursive parsers.

## Example

<details>
  <summary>Combinators and parsers used in this section</summary>

  - Combinators: [choice], [list], [map], [takeMid]
  - Parsers: [defer], [integer], [string]
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
    integer(),
    (value) => ({ type: 'number', value })
  )
)

TupleList.with(
  map(
    takeMid(
      string('('),
      list(choice(TupleList, TupleNumber), string(',')),
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
  kind: 'success',
  state: { text: '(1,2,(3,(4,5)))', index: 15 },
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
[list]: ../combinators/list
[takeMid]: ../combinators/takeMid

<!-- Parsers. -->

[defer]: ./defer
[integer]: ./integer
[string]: ./string
