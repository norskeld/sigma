# `𝝨` sigma

[![Build/Test](https://img.shields.io/github/workflow/status/norskeld/sigma/test?style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/norskeld/sigma/actions 'Build and test workflows')
[![Coverage](https://img.shields.io/coveralls/github/norskeld/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://coveralls.io/github/norskeld/sigma 'Test coverage')
[![NPM](https://img.shields.io/npm/v/@nrsk/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://npm.im/@nrsk/sigma 'This package on NPM')
![Node Current](https://img.shields.io/node/v/@nrsk/shikigami?style=flat-square&colorA=22272d&colorB=22272d 'Supported Node version')
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@nrsk/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://bundlephobia.com/package/@nrsk/sigma)
![Tree Shaking](https://img.shields.io/static/v1?label=tree+shaking&message=supported&style=flat-square&colorA=22272d&colorB=22272d)
[![Semantic Release](https://img.shields.io/static/v1?label=semantic&message=release&style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/semantic-release/semantic-release 'This package uses semantic release to handle releasing, versioning, changelog generation and tagging')

TypeScript [parser combinator][parser-combinator] library for building fast and convenient parsers.

## Features

- [x] Tailored for parsing [context-free grammars][cfg].
- [x] Ergonomic API with excellent TypeScript support.
- [x] Zero dependencies. Supports tree shaking.
- [x] [Performant enough][bench] to beat similar parser combinator libraries.

## Docs

You can find the documentation [here][docs]. If you want to contribute, feel free to check out [the source code][docs-source].

## Installation

Just use your favorite package manager.

```bash
npm i @nrsk/sigma
```

## Example

Below is an example of parsing nested tuples like `(1, 2, (3, 4))` into an AST.

<details>
<summary>Click to show the tuples example.</summary>

```ts
import { choice, map, optional, sepBy, sequence, takeMid } from '@nrsk/sigma/combinators'
import { defer, integer, run, string, whitespace } from '@nrsk/sigma/parsers'

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

function toNumber(value: number): NumberNode {
  return {
    type: 'number',
    value
  }
}

function toList(value: Array<NumberNode | ListNode>): ListNode {
  return {
    type: 'list',
    value
  }
}

/* Parsers. */

const OpenParen = string('(')
const CloseParen = string(')')
const Space = optional(whitespace())
const Comma = sequence(Space, string(','), Space)

const TupleNumber = defer<NumberNode>()
const TupleList = defer<ListNode>()

TupleNumber.with(
  map(
    integer(),
    toNumber
  )
)

TupleList.with(
  map(
    takeMid(
      OpenParen,
      sepBy(choice(TupleList, TupleNumber), Comma),
      CloseParen
    ),
    toList
  )
)
```

Then we simply `run` the root parser, feeding it `.with` text:

```ts
run(TupleList).with('(1, 2, (3, 4))')
```

And in the end we get the following output with the AST, which can then be manipulated if needed:

```ts
{
  isOk: true,
  pos: 14,
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
</details>

## License

[MIT](LICENSE).

<!-- Links. -->

[parser-combinator]: https://en.wikipedia.org/wiki/Parser_combinator
[cfg]: https://en.wikipedia.org/wiki/Context-free_grammar
[docs]: https://sigma.vm.codes
[docs-source]: ./docs
[bench]: ./benchmarks
