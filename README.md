# `𝝨` sigma

[![Build/Test](https://img.shields.io/github/workflow/status/norskeld/sigma/test?style=flat&colorA=black)](https://github.com/norskeld/sigma/actions)
[![Coverage](https://img.shields.io/coveralls/github/norskeld/sigma?style=flat&colorA=black)](https://coveralls.io/github/norskeld/sigma)
[![NPM](https://img.shields.io/npm/v/@nrsk/sigma?style=flat&colorA=black&colorB=CC3534)](https://npm.im/@nrsk/sigma)
[![Semantic Release](https://img.shields.io/badge/semantic_release-black)](https://github.com/semantic-release/semantic-release)

TypeScript [parser combinator] library for building fast and convenient parsers.

## Note

> This library is still in active development, and although it can already parse complex stuff and
> in fact do that *orders of magnitude* faster than some other parser combinator libraries, it still
> lacks Unicode support, common parsers and documentation.

## Installation

Just use your favorite package manager!

```bash
npm i @nrsk/sigma
```

## Example

Below is an example of parsing nested tuples like `(1, 2, (3, 4))` into an AST.

```ts
import { choice, defer, list, map, opt, regexp, string, tmid } from '@nrsk/sigma/combinators'
import { run } from '@nrsk/sigma'

/* AST. */

interface NumberNode {
  type: 'number'
  value: number
}

interface ListNode {
  type: 'list'
  value: Array<NumberNode | ListNode>
}

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: string): NumberNode {
  return {
    type: 'number',
    value: +value
  }
}

function toList(value: Array<NumberNode | ListNode>): ListNode {
  return {
    type: 'list',
    value
  }
}

/* Parsers. */

// Non-Terminals.
const Space = regexp(/\s+/g, 'whitespace')
const Integer = regexp(/\d+/g, 'integer')

// Terminals.
const OperParen = string('(')
const CloseParen = string(')')
const Comma = tmid(opt(Space), string(','), opt(Space))

// Composites. Deferred initialization allows us to use recursion and mutual calls between parsers.
const TupleNumber = defer<NumberNode>()
const TupleElement = defer<NumberNode | ListNode>()
const TupleList = defer<ListNode>()

TupleNumber.with(
  map(
    Integer,
    toNumber
  )
)

TupleElement.with(
  choice(
    TupleList,
    TupleNumber
  )
)

TupleList.with(
  map(
    tmid(
      OperParen,
      list(TupleElement, Comma),
      CloseParen
    ),
    toList
  )
)
```

Then we simply `.run` the root parser, feeding it `.with` text:

```ts
> run(TupleList).with('(1, 2, (3, 4))')
```

And in the end we get the following output with the AST, which can then be manipulated if needed:

```ts
{
  kind: 'success',
  state: {
    input: '(1, 2, (3, 4))',
    index: 14
  },
  value: {
    type: 'list',
    value: [
      { type: 'number', value: 1 },
      { type: 'number', value: 2 },
      {
        type: 'list',
        value: [
          { type: 'number', value: 3 },
          { type: 'number', value: 4 }
        ]
      }
    ]
  }
}
```

## License

[MIT](LICENSE).

[parser combinator]: https://en.wikipedia.org/wiki/Parser_combinator
