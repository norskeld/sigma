# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries. Benchmarks are powered by [mitata].

## How to run locally

From the repository root:

```shell
pnpm bench
```

This builds `@nrsk/sigma` and runs all suites. To run a single suite, use `pnpm --filter @nrsk/sigma-bench bench:json` (or `bench:tuple`, `bench:many`, `bench:select`).

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

Benchmarks execute TypeScript directly with node's native type stripping rather than a loader like `tsx` to avoid results being distorted.

## Notes

Unfortunately, it's difficult to come up with sensible benchmarks, given that how a parser written with **sigma** depends entirely on what you are parsing, how you structure your parser(s), which patterns the parser attempts to match first, what is involved in constructing your AST (if any), and so on.

All that said, here are some rough numbers.

The [JSON sample][json-sample] is typical JSON data, ~28 KB / 924 lines. This translates to roughly **3.3M** lines of JSON per second. The [tuple sample][tuple-sample] is a ~2.7 KB nested tuple like `(1, 2, (3, 4, (5, ...)))` with nesting depth 7, exercising recursion and backtracking. The [many sample][many-sample] is the token `x!` repeated 10,000 times, a microbenchmark of repetition throughput. The [select sample][select-sample] is a single ~23 KB SQL `SELECT` statement with 2048 columns and a `WHERE` clause (the grammar from the [chevrotain tutorial]), exercising keyword matching and separated lists.

```
clk: ~4.36 GHz
cpu: Apple M4 Max
runtime: node 24.13.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• JSON
------------------------------------------- -------------------------------
sigma:defer                  219.96 µs/iter 225.62 µs   █
                    (205.88 µs … 371.79 µs) 262.25 µs  ▇█▅▂ ▂
                    ( 75.84 kb …   1.10 mb) 386.45 kb ▃███████▆█▆▃▂▂▁▁▁▁▁▁▁

sigma:grammar                203.10 µs/iter 208.63 µs  █
                    (189.75 µs … 474.46 µs) 253.42 µs  █▆ ▂
                    ( 64.33 kb … 892.42 kb) 386.31 kb ▇███████▇▃▂▂▁▁▁▁▁▁▁▁▁

parjs                          3.59 ms/iter   3.67 ms        ▅█▇
                        (3.35 ms … 3.96 ms)   3.89 ms    ▅▇█▆███▅ ▂
                    ( 16.84 mb …  21.54 mb)  17.65 mb ▃▆█████████▇█▆███▄▆▃▃

parsimmon                    773.04 µs/iter 780.25 µs      ▄█▄
                    (723.67 µs … 915.75 µs) 867.17 µs    ▂▆███▄
                    (  7.45 mb …   8.30 mb)   7.80 mb ▃█▇██████▆▅▄▄▄▃▄▃▃▃▂▁

chevrotain                   178.64 µs/iter 177.75 µs  ▇ █
                      (153.79 µs … 2.92 ms) 284.92 µs ▂███▆
                    (  3.86 kb …   1.22 mb) 359.73 kb █████▇▄▃▂▁▁▁▁▁▁▁▁▁▁▁▁

JSON.parse (native)           27.62 µs/iter  27.84 µs     █
                      (27.30 µs … 28.00 µs)  27.98 µs █   █           █
                    ( 13.07 kb …  13.07 kb)  13.07 kb █▁▁▁█▁█▁▁▁█▁█▁▁▁█▁▁▁█

summary
  JSON.parse (native)
   6.47x faster than chevrotain
   7.35x faster than sigma:grammar
   7.96x faster than sigma:defer
   27.99x faster than parsimmon
   129.89x faster than parjs

• Tuple
------------------------------------------- -------------------------------
sigma                         56.93 µs/iter  59.46 µs   █     ▂
                     (51.92 µs … 162.96 µs)  70.00 µs  ▇█     █▅
                    (  2.83 kb …   0.99 mb) 152.27 kb ▁██▇▅▅▄▄██▂▃▂▁▁▁▁▁▁▁▁

parjs                        271.92 µs/iter 276.83 µs    █▆█
                    (243.92 µs … 637.04 µs) 363.92 µs  ▃████▇
                    (437.68 kb …   2.26 mb)   1.33 mb ▄██████▆▄▃▂▂▂▁▂▂▁▁▁▁▁

parsimmon                    236.26 µs/iter 247.46 µs  █
                    (213.58 µs … 364.75 µs) 317.38 µs ▃█▂
                    (  1.68 mb …   2.71 mb)   2.21 mb ██████▇▇▆▅▃▃▂▂▂▁▁▁▁▁▁

chevrotain                    71.75 µs/iter  71.25 µs  █  ▂
                       (61.88 µs … 2.05 ms) 108.92 µs ▆█▄██
                    ( 12.48 kb … 497.49 kb) 178.16 kb █████▇▄▄▃▂▂▂▁▁▁▁▁▁▁▁▁

summary
  sigma
   1.26x faster than chevrotain
   4.15x faster than parsimmon
   4.78x faster than parjs

• many
------------------------------------------- -------------------------------
sigma                         57.60 µs/iter  59.29 µs    █
                     (51.88 µs … 178.04 µs)  74.33 µs    █▂
                    ( 72.62 kb … 511.83 kb) 256.18 kb ▁▆▇██▄▅▄▇▅▂▂▂▁▁▁▁▁▁▁▁

parjs                        165.32 µs/iter 170.00 µs     ▂▅▃█
                    (148.29 µs … 328.67 µs) 214.25 µs  ▂██████
                    (197.67 kb …   1.07 mb) 796.88 kb ▁███████▅▃▃▂▂▂▁▁▁▁▁▁▁

parsimmon                    322.15 µs/iter 324.63 µs    ██▇
                    (288.38 µs … 483.00 µs) 419.46 µs    ███▄
                    (  3.91 mb …   5.06 mb)   4.50 mb ▃▄▆████▄▃▂▂▂▂▂▂▂▂▁▂▂▁

chevrotain                   453.13 µs/iter 421.83 µs █
                      (380.83 µs … 3.79 ms)   2.13 ms █
                    (149.34 kb …   2.19 mb)   1.28 mb █▅▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma
   2.87x faster than parjs
   5.59x faster than parsimmon
   7.87x faster than chevrotain

• Select
------------------------------------------- -------------------------------
sigma:defer                  176.54 µs/iter 172.46 µs  █▇▃▅
                      (151.29 µs … 2.19 ms) 246.71 µs  █████
                    ( 15.45 kb …   1.02 mb) 421.87 kb ▄█████▆▃▂▂▁▁▁▁▁▁▁▁▁▁▁

sigma:grammar                147.22 µs/iter 153.08 µs  █
                    (135.96 µs … 327.71 µs) 178.58 µs  █▄     ▅
                    ( 90.04 kb …   1.22 mb) 418.55 kb ▂███▇▇▇▆██▃▂▂▁▂▁▁▁▁▁▁

parjs                        885.53 µs/iter 894.29 µs       █
                      (807.71 µs … 1.40 ms)   1.05 ms     ▂███
                    (  3.39 mb …   6.68 mb)   4.35 mb ▂▃▅▅████▆▅▃▃▃▂▂▂▁▁▁▁▁

parsimmon                    881.54 µs/iter 898.13 µs  ▇      █
                      (824.08 µs … 1.04 ms) 985.67 µs  █▇  ▅▃▇██
                    ( 10.48 mb …  10.71 mb)  10.52 mb ▇███▇█████▇▄▅▆▄▅▅▅▃▂▂

chevrotain                   176.58 µs/iter 172.08 µs    █
                      (150.83 µs … 4.18 ms) 278.50 µs  ███▂
                    (113.53 kb …   1.56 mb) 525.31 kb ▅████▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma:grammar
   1.2x faster than sigma:defer
   1.2x faster than chevrotain
   5.99x faster than parsimmon
   6.02x faster than parjs
```

<!-- Links. -->

[mitata]: https://github.com/evanwashere/mitata
[json-sample]: ./src/json/@sample.ts
[tuple-sample]: ./src/tuple/@sample.ts
[many-sample]: ./src/many/@sample.ts
[select-sample]: ./src/select/@sample.ts
[chevrotain tutorial]: https://github.com/Chevrotain/chevrotain/tree/master/examples/tutorial
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[parsimmon]: https://github.com/jneen/parsimmon
[chevrotain]: https://github.com/chevrotain/chevrotain
[arcsecond]: https://github.com/francisrstokes/arcsecond
