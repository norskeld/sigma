# `𝝨` sigma

[![Build/Test](https://img.shields.io/github/actions/workflow/status/norskeld/sigma/test.yml?style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/norskeld/sigma/actions 'Build and test workflows')
[![Coverage](https://img.shields.io/coverallsCoverage/github/norskeld/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://coveralls.io/github/norskeld/sigma 'Test coverage')
[![NPM](https://img.shields.io/npm/v/@nrsk/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://npm.im/@nrsk/sigma 'This package on NPM')
![Supported Node Versions](https://img.shields.io/node/v/%40nrsk/sigma?style=flat-square&colorA=22272d&colorB=22272d)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@nrsk/sigma?label=minzipped&style=flat-square&colorA=22272d&colorB=22272d)](https://bundlephobia.com/package/@nrsk/sigma)
![Tree Shaking](https://img.shields.io/static/v1?label=tree+shaking&message=✔&style=flat-square&colorA=22272d&colorB=22272d)
[![Semantic Release](https://img.shields.io/static/v1?label=semantic+release&message=✔&style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/semantic-release/semantic-release 'This package uses semantic release to handle releasing, versioning, changelog generation and tagging')

TypeScript [parser combinator][parser-combinator] library for building fast and convenient parsers.

## Features

- [x] Capable of parsing [LL grammars][ll-grammar] using [recursive descent][rd] with backtracking.
- [x] Ergonomic API with excellent TypeScript support.
- [x] Zero dependencies. Supports tree shaking.
- [x] [Performant enough][bench] to beat similar parser combinator libraries.

All-in-all, Sigma is easy to use and extend, reasonably fast and convenient, *but* a bit limited regarding what types of grammars it can parse.

## Docs

You can find the documentation [here][docs]. If you want to contribute, feel free to check out [the source code][docs-source].

## Installation

### Node

Just use your favorite package manager.

```bash
npm i @nrsk/sigma
```

### Deno

You can import the library via [Skypack] (note that `?dts` query parameter, that will pull types as well, **strongly** recommended):

```ts
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma?dts'
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma/parsers?dts'
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma/combinators?dts'
```

## Example

Below is an example of parsing nested tuples like `(1, 2, (3, 4))` into an AST.

<details>
<summary>Click to show the tuples example.</summary>

```ts
import { choice, map, optional, sepBy, sequence, takeMid } from '@nrsk/sigma/combinators'
import { defer, integer, run, string, whitespace } from '@nrsk/sigma/parsers'
import type { Span } from '@nrsk/sigma'

/* AST. */

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

/* Mapping functions to turn parsed string values into AST nodes. */

function toNumber(value: number, span: Span): NumberNode {
  return {
    type: 'number',
    span,
    value
  }
}

function toList(value: Array<NumberNode | ListNode>, span: Span): ListNode {
  return {
    type: 'list',
    span,
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

Then we simply `run` the root parser, feeding it `with` text:

```ts
run(TupleList).with('(1, 2, (3, 4))')
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

## Development

Fork, clone, then instead of `npm install` run:

```sh
npm run install:all
```

> **Note**
>
> This will install dependencies for the package itself, and also for **docs** and **benchmarks** packages. This is due to limitations of the current repository setup and needed to avoid problems with eslint that runs on pre-commit hook.

## License

[MIT](LICENSE).

<!-- Links. -->

[ll-grammar]: https://en.wikipedia.org/wiki/LL_grammar
[rd]: https://en.wikipedia.org/wiki/Recursive_descent_parser
[parser-combinator]: https://en.wikipedia.org/wiki/Parser_combinator
[cfg]: https://en.wikipedia.org/wiki/Context-free_grammar
[docs]: https://sigma.vm.codes
[docs-source]: ./docs
[bench]: ./benchmarks
[skypack]: https://skypack.dev
