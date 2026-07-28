# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries. Benchmarks are using [mitata].

## How to run locally

From the repository root:

```shell
pnpm bench
```

This builds `@nrsk/sigma` and runs all suites. To run a single suite, use `pnpm --filter @nrsk/sigma-bench bench:<suite>`.

## Suites

The [JSON sample][json-sample] is typical JSON data, ~28 KB / 924 lines. This is the broadest suite: a mixed grammar, string escape decoding and AST construction, run against every library plus native `JSON.parse`.

The [tuple sample][tuple-sample] is a nested tuple like `(1, 2, (3, 4, (5, ...)))`, exercising recursion and backtracking. It comes in two sizes, benched as separate groups: ~2.6 KB with nesting depth 7 and 6 elements per list, and ~49 KB with nesting depth 10 and 10 elements per list, so deep recursion is measured apart from the fixed cost of a small parse.

The [many sample][many-sample] is the token `x!` repeated 10,000 times, a microbenchmark of repetition throughput.

The [select sample][select-sample] is a single ~23 KB SQL `SELECT` statement with 2048 columns and a `WHERE` clause (the grammar from the [chevrotain tutorial]), exercising keyword matching and separated lists.

The [recovery sample][recovery-sample] is 5000 statements, benched clean, committed and recovering, so the cost of `commit` on valid input is separated from the cost of actually recovering. A second group repeats this over 1000 nested groups. It compares sigma against itself rather than against other libraries, none of which recover.

## Libraries

| Library      | Version   | Notes                                               |
| ------------ | --------- | --------------------------------------------------- |
| [Sigma]      | workspace | Benched in two variants: `defer()` and `grammar()`. |
| [Parjs]      | 1.3.9     | Parser combinators.                                 |
| [Parsimmon]  | 1.18.1    | Parser combinators.                                 |
| [Chevrotain] | 12.0.0    | Lexer + LL(k) toolkit, via `EmbeddedActionsParser`. |

The JSON suite also includes native `JSON.parse` as a reference ceiling. Note that it produces plain values rather than an AST, so it does strictly less work than the libraries.

## Correctness

Before each suite runs, every implementation parses the sample once and its output is checked with `deepStrictEqual` against ground truth (for JSON, an AST derived from `JSON.parse`). All implementations do the same work on the same input, including JSON string escape decoding, and produce identical ASTs. A failing implementation aborts the suite instead of posting a meaningless number.

## Runner

Benchmarks execute TypeScript directly with node's native type stripping rather than a loader like `tsx` to avoid results being distorted (too much).

<!-- Links. -->

[mitata]: https://github.com/evanwashere/mitata
[json-sample]: ./src/json/@sample.ts
[tuple-sample]: ./src/tuple/@sample.ts
[many-sample]: ./src/many/@sample.ts
[select-sample]: ./src/select/@sample.ts
[recovery-sample]: ./src/recovery/@sample.ts
[chevrotain tutorial]: https://github.com/Chevrotain/chevrotain/tree/master/examples/tutorial
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[parsimmon]: https://github.com/jneen/parsimmon
[chevrotain]: https://github.com/chevrotain/chevrotain
[arcsecond]: https://github.com/francisrstokes/arcsecond
