---
title: 'defer'
kind: 'primitive'
description: 'defer is a special parser that is tailored for creating mutually recursive parsers.'
---

# defer <Primitive />

## Signature

```ts
interface Deferred<T> extends Parser<T> {
  with(parser: Parser<T>): void
}

function defer<T>(): Deferred<T>
```

## Description

`defer` is a special parser that has an additional `with` method, which should be used to define the parser. This parser is tailored for creating mutually recursive parsers.

## Example

::: info Combinators and parsers used in this section
- Combinators: [choice], [sepBy], [map], [takeMid]
- Parsers: [defer], [integer], [string]
:::

In the example below we are parsing simple nested tuples like `(1,2,(3,(4,5)))` into an AST, which then can be somehow manipulated. Every parsed node also has a span, that is location information.

```ts
interface NumberNode {
  type: 'number'
  span: Span
  value: number
}

interface ListNode {
  type: 'list'
  span: Span
  value: Array<NumberNode | ListNode>
}

const TupleList = defer<ListNode>()
const TupleNumber = defer<NumberNode>()

TupleNumber.with(
  map(
    integer(),
    (value, span) => ({ type: 'number', span, value })
  )
)

TupleList.with(
  map(
    takeMid(
      string('('),
      sepBy(choice(TupleList, TupleNumber), string(',')),
      string(')')
    ),
    (value, span) => ({ type: 'list', span, value })
  )
)
```

If we run our parser and feed it with input:

```ts
run(TupleList).with('(1,2,(3,(4,5)))')
```

We will get the following result:

::: tip Success
```ts
{
  isOk: true,
  span: [ 0, 15 ],
  pos: 15,
  value: {
    type: 'list',
    span: [ 0, 15 ],
    value: [
      { type: 'number', span: [ 1, 2 ], value: 1 },
      { type: 'number', span: [ 3, 4 ], value: 2 },
      {
        type: 'list',
        span: [ 5, 14 ],
        value: [
          { type: 'number', span: [ 6, 7 ], value: 3 },
          {
            type: 'list',
            span: [ 8, 13 ],
            value: [
              { type: 'number', span: [ 9, 10 ], value: 4 },
              { type: 'number', span: [ 11, 12 ], value: 5 }
            ]
          }
        ]
      }
    ]
  }
}
```
:::

<!-- Combinators. -->

[choice]: ../combinators/choice
[map]: ../combinators/map
[sepBy]: ../combinators/sepBy
[takeMid]: ../combinators/takeMid

<!-- Parsers. -->

[defer]: ./defer
[integer]: ./integer
[string]: ./string
