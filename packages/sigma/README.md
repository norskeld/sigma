# `𝝨` sigma

TypeScript [parser combinator](https://en.wikipedia.org/wiki/Parser_combinator) library for building fast and convenient parsers.

## Features

- [x] Capable of parsing [LL grammars](https://en.wikipedia.org/wiki/LL_grammar) using [recursive descent](https://en.wikipedia.org/wiki/Recursive_descent_parser) with backtracking.
- [x] Ergonomic API with excellent TypeScript support.
- [x] Zero dependencies. Supports tree shaking.
- [x] [Performant enough](../bench/) to beat similar parser combinator libraries.

## Docs

You can find the documentation [here](https://sigma.nrsk.dev). Changelog is [here](./CHANGELOG.md).

## Installation

Just use your favorite package manager.

```bash
npm i @nrsk/sigma # or
pnpm add @nrsk/sigma # or
yarn add @nrsk/sigma
```

For Deno and the browser, you can import the library via something like [Skypack](https://skypack.dev) (note the `?dts` query parameter, this is to pull types):

```ts
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma?dts'
```

## Example

Below is a simple example of parsing nested tuples like `(1, 2, (3, 4))` into an AST.

<details>
<summary>Click to show the tuples example</summary>

```ts
import * as s from '@nrsk/sigma'

/* AST. */

interface NumberNode {
  type: 'number'
  span: s.Span
  value: number
}

interface ListNode {
  type: 'list'
  span: s.Span
  value: Array<NumberNode | ListNode>
}

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumberNode(value: number, span: s.Span): NumberNode {
  return {
    type: 'number',
    span,
    value,
  }
}

function toListNode(value: Array<NumberNode | ListNode>, span: s.Span): ListNode {
  return {
    type: 'list',
    span,
    value,
  }
}

/* Parsers. */

const OpenParen = s.string('(')
const CloseParen = s.string(')')
const Space = s.optional(s.whitespace())
const Comma = s.sequence(Space, s.string(','), Space)

const TupleNumber = s.defer<NumberNode>()
const TupleList = s.defer<ListNode>()

TupleNumber.with(s.map(s.integer(), toNumberNode))

TupleList.with(
  s.map(
    s.takeMid(
      OpenParen,
      s.sepBy(s.choice(TupleList, TupleNumber), Comma),
      CloseParen
    ),
    toListNode,
  ),
)
```

Then we simply `run` the root parser, feeding it `with` text:

```ts
console.log(s.run(TupleList).with('(1, 2, (3, 4))'))
```

And in the end we get the following output with the AST, which can then be manipulated if needed:

```ts
{
  isOk: true,
  span: [ 0, 14 ],
  pos: 14,
  value: {
    type: 'list',
    span: [ 0, 14 ],
    value: [
      { type: 'number', span: [ 1, 2 ], value: 1 },
      { type: 'number', span: [ 4, 5 ], value: 2 },
      {
        type: 'list',
        span: [ 7, 13 ],
        value: [
          { type: 'number', span: [ 8, 9 ], value: 3 },
          { type: 'number', span: [ 11, 12 ], value: 4 }
        ]
      }
    ]
  }
}
```
</details>

## License

[MIT](LICENSE).
