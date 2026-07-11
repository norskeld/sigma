# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries. Benchmarks are powered by [mitata].

## How to run locally

From the repository root:

```shell
pnpm bench
```

This builds `@nrsk/sigma` and runs all suites. To run a single suite, use `pnpm --filter @nrsk/sigma-bench bench:json` (or `bench:tuple`, `bench:many`).

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

The [JSON sample][json-sample] is typical JSON data, ~28 KB / 924 lines. This translates to roughly **3.3M** lines of JSON per second. The [tuple sample][tuple-sample] is a ~2.7 KB nested tuple like `(1, 2, (3, 4, (5, ...)))` with nesting depth 7, exercising recursion and backtracking. The [many sample][many-sample] is the token `x!` repeated 10,000 times, a microbenchmark of repetition throughput.

```
clk: ~4.46 GHz
cpu: Apple M4 Max
runtime: node 24.13.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• JSON
------------------------------------------- -------------------------------
sigma:defer                  296.17 µs/iter 301.25 µs    ▅█▅▂
                    (270.13 µs … 449.17 µs) 378.33 µs   ▅████
                    (  1.60 mb …   2.98 mb)   2.32 mb ▄███████▄▃▂▂▂▁▂▂▂▁▂▁▁

sigma:grammar                303.39 µs/iter 285.83 µs █
                      (258.08 µs … 1.38 ms)   1.05 ms █▇
                    (  1.47 mb …   3.01 mb)   2.32 mb ██▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

parjs                          3.69 ms/iter   3.76 ms        ▇█▇
                        (3.42 ms … 4.09 ms)   4.06 ms      ▅▆███▄▃
                    ( 16.84 mb …  21.47 mb)  17.65 mb ▃▇█▆▅███████▆▄██▆▃▄▂▂

parsimmon                    812.72 µs/iter 800.88 µs  █▆█
                      (722.04 µs … 1.36 ms)   1.15 ms ▃███▂
                    (  6.81 mb …   8.74 mb)   7.80 mb █████▄▂▁▁▁▁▂▂▁▁▃▃▅▃▂▁

chevrotain                   171.37 µs/iter 168.79 µs    █
                      (144.33 µs … 2.87 ms) 271.79 µs  ▂▆█▆
                    (  3.81 kb …   1.50 mb) 359.40 kb ▂████▇▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁

JSON.parse (native)           28.34 µs/iter  28.49 µs               █
                      (27.94 µs … 28.71 µs)  28.61 µs ▅   ▅▅▅    ▅▅ █ ▅ ▅ ▅
                    ( 13.07 kb …  13.07 kb)  13.07 kb █▁▁▁███▁▁▁▁██▁█▁█▁█▁█

summary
  JSON.parse (native)
   6.05x faster than chevrotain
   10.45x faster than sigma:defer
   10.7x faster than sigma:grammar
   28.68x faster than parsimmon
   130.37x faster than parjs

• Tuple
------------------------------------------- -------------------------------
sigma                         84.18 µs/iter  85.50 µs      █
                     (73.71 µs … 175.58 µs) 121.08 µs     ▂█
                    ( 90.38 kb … 946.53 kb) 722.67 kb ▁█▇▆██▄▂▃▂▂▁▁▁▁▁▁▁▁▁▁

parjs                        280.35 µs/iter 281.08 µs     █▅
                    (251.75 µs … 709.08 µs) 364.92 µs    ▇██
                    (657.55 kb …   2.41 mb)   1.33 mb ▁▁▂███▇▄▂▂▁▁▁▁▁▁▁▁▁▁▁

parsimmon                    235.44 µs/iter 238.00 µs       █
                    (211.25 µs … 360.00 µs) 293.00 µs     █▆█▄
                    (  1.58 mb …   2.71 mb)   2.21 mb ▂▃▃█████▄▃▂▂▁▁▁▁▂▂▁▁▁

chevrotain                    72.27 µs/iter  70.79 µs     █
                       (61.13 µs … 1.98 ms) 104.38 µs     █
                    ( 14.46 kb … 559.62 kb) 178.18 kb ▃█▆▇██▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁

summary
  chevrotain
   1.16x faster than sigma
   3.26x faster than parsimmon
   3.88x faster than parjs

• many
------------------------------------------- -------------------------------
sigma                         58.00 µs/iter  58.63 µs  ▂ █
                     (51.04 µs … 149.04 µs) 102.71 µs  █ █
                    (596.80 kb …   1.67 mb)   1.41 mb ▅███▄▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁

parjs                        168.18 µs/iter 170.46 µs    ▄██▂
                    (150.54 µs … 342.54 µs) 218.83 µs    ████
                    (197.67 kb …   1.07 mb) 796.93 kb ▂▃▇████▆▅▃▃▂▂▁▁▁▁▁▁▁▁

parsimmon                    324.73 µs/iter 324.38 µs     ██
                    (286.33 µs … 458.21 µs) 424.33 µs     ██
                    (  3.91 mb …   5.06 mb)   4.50 mb ▂▂▂▄███▄▂▂▁▂▂▂▁▁▂▁▁▁▁

chevrotain                   452.38 µs/iter 421.67 µs █
                      (371.92 µs … 3.93 ms)   2.17 ms ██
                    (556.94 kb …   2.36 mb)   1.28 mb ██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma
   2.9x faster than parjs
   5.6x faster than parsimmon
   7.8x faster than chevrotain
```

<!-- Links. -->

[mitata]: https://github.com/evanwashere/mitata
[json-sample]: ./src/json/@sample.ts
[tuple-sample]: ./src/tuple/@sample.ts
[many-sample]: ./src/many/@sample.ts
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[parsimmon]: https://github.com/jneen/parsimmon
[chevrotain]: https://github.com/chevrotain/chevrotain
[arcsecond]: https://github.com/francisrstokes/arcsecond
