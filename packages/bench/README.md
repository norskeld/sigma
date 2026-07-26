# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries. Benchmarks are powered by [mitata].

## How to run locally

From the repository root:

```shell
pnpm bench
```

This builds `@nrsk/sigma` and runs all suites. To run a single suite, use `pnpm --filter @nrsk/sigma-bench bench:json` (or `bench:tuple`, `bench:many`, `bench:select`, `bench:recovery`).

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

The [JSON sample][json-sample] is typical JSON data, ~28 KB / 924 lines. This translates to roughly **3.3M** lines of JSON per second. The [tuple sample][tuple-sample] is a ~2.7 KB nested tuple like `(1, 2, (3, 4, (5, ...)))` with nesting depth 7, exercising recursion and backtracking. The [many sample][many-sample] is the token `x!` repeated 10,000 times, a microbenchmark of repetition throughput. The [select sample][select-sample] is a single ~23 KB SQL `SELECT` statement with 2048 columns and a `WHERE` clause (the grammar from the [chevrotain tutorial]), exercising keyword matching and separated lists. The [recovery sample][recovery-sample] is 5000 statements, benched clean, committed and recovering, so the cost of `commit` on valid input is separated from the cost of actually recovering; it compares sigma against itself rather than against other libraries, none of which recover.

```
clk: ~4.43 GHz
cpu: Apple M4 Max
runtime: node 24.13.1 (arm64-darwin)

benchmark                                       avg (min … max) p75 / p99    (min … top 1%)
--------------------------------------------------------------- -------------------------------
• JSON
--------------------------------------------------------------- -------------------------------
sigma:defer                                      243.64 µs/iter 248.71 µs      ▃  █            
                                        (220.75 µs … 573.38 µs) 291.25 µs     ▇████▂           
                                        ( 35.23 kb …   1.10 mb) 463.17 kb ▂▆▅███████▅▂▂▁▂▁▁▁▁▁▁

sigma:grammar                                    225.33 µs/iter 230.08 µs    ▃  █              
                                        (205.17 µs … 532.83 µs) 284.54 µs   █████▇             
                                        ( 35.81 kb …   1.14 mb) 462.88 kb ▅███████▆▄▃▂▂▁▂▁▁▁▁▁▁

parjs                                              3.72 ms/iter   3.81 ms         ▆▂█▃         
                                            (3.42 ms … 4.04 ms)   4.01 ms     ▂  ▆████▂ █      
                                        ( 16.84 mb …  21.53 mb)  17.65 mb ▄▂▂▄█▇██████████▇█▄▃▄

parsimmon                                        793.51 µs/iter 797.88 µs         █▂           
                                        (717.54 µs … 914.25 µs) 889.96 µs        ███           
                                        (  7.46 mb …   8.30 mb)   7.80 mb ▂▂▁▂▃▃▅███▆▃▄▃▃▃▂▂▂▁▁

chevrotain                                       180.51 µs/iter 178.58 µs    █                 
                                          (153.54 µs … 2.92 ms) 277.08 µs   ▆█▄                
                                        (  4.23 kb …   1.18 mb) 359.53 kb ▂████▇▅▃▂▁▁▁▁▁▁▁▁▁▁▁▁

JSON.parse (native)                               28.59 µs/iter  28.67 µs █ ██  ██   ███ ██   █
                                          (28.35 µs … 28.92 µs)  28.78 µs █ ██  ██   ███ ██   █
                                        ( 13.07 kb …  13.07 kb)  13.07 kb █▁██▁▁██▁▁▁███▁██▁▁▁█

summary
  JSON.parse (native)
   6.31x faster than chevrotain
   7.88x faster than sigma:grammar
   8.52x faster than sigma:defer
   27.76x faster than parsimmon
   130.3x faster than parjs

• Tuple
--------------------------------------------------------------- -------------------------------
sigma                                             60.91 µs/iter  61.83 µs        █             
                                         (54.38 µs … 163.88 µs)  73.67 µs        ██            
                                        (  9.63 kb … 621.56 kb) 177.18 kb ▂▇▅▄▃▃▃██▃▃▂▁▁▁▁▁▁▁▁▁

parjs                                            279.18 µs/iter 280.29 µs     █▂               
                                        (249.75 µs … 855.33 µs) 368.13 µs    ▂██               
                                        (357.51 kb …   2.44 mb)   1.33 mb ▁▂▂███▅▂▂▂▁▁▁▁▁▁▁▁▁▁▁

parsimmon                                        234.75 µs/iter 237.50 µs     ▅▆█▂             
                                        (211.54 µs … 352.04 µs) 289.50 µs    ▃████             
                                        (  1.55 mb …   2.71 mb)   2.21 mb ▁▄▃█████▅▄▂▂▂▁▁▁▂▂▂▁▁

chevrotain                                        73.01 µs/iter  71.42 µs     █                
                                           (61.96 µs … 1.94 ms) 104.92 µs     █                
                                        (  4.51 kb … 482.31 kb) 178.10 kb ▃▆▅▇██▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma
   1.2x faster than chevrotain
   3.85x faster than parsimmon
   4.58x faster than parjs

• many
--------------------------------------------------------------- -------------------------------
sigma                                             94.34 µs/iter  96.29 µs          ██          
                                         (82.25 µs … 209.04 µs) 110.67 µs        ▄▇██          
                                        ( 50.92 kb … 798.03 kb) 256.30 kb ▁▂▃▆▇▇█████▇▄▂▂▂▂▁▂▁▁

parjs                                            168.28 µs/iter 169.54 µs      █               
                                        (150.04 µs … 315.79 µs) 217.08 µs     ▃██              
                                        (197.67 kb …   1.10 mb) 796.88 kb ▁▂▂▇███▄▂▂▁▁▁▁▁▁▁▁▁▁▁

parsimmon                                        329.68 µs/iter 330.04 µs     ▄█               
                                        (289.92 µs … 475.04 µs) 428.50 µs     ██▄              
                                        (  3.92 mb …   5.06 mb)   4.50 mb ▁▂▂▄███▄▂▂▂▂▂▁▂▁▂▁▁▁▁

chevrotain                                       464.34 µs/iter 433.38 µs  █                   
                                          (380.71 µs … 3.77 ms)   2.08 ms ▄█                   
                                        (452.84 kb …   2.51 mb)   1.28 mb ██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma
   1.78x faster than parjs
   3.49x faster than parsimmon
   4.92x faster than chevrotain

• Select
--------------------------------------------------------------- -------------------------------
sigma:defer                                      200.22 µs/iter 193.42 µs    █                 
                                          (166.54 µs … 1.93 ms) 330.00 µs   ██                 
                                        ( 46.30 kb …   1.82 mb) 499.91 kb ▃████▄▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁

sigma:grammar                                    167.80 µs/iter 170.79 µs       ▇█             
                                        (149.33 µs … 404.92 µs) 207.71 µs     ▄▅██▄            
                                        (158.81 kb …   1.54 mb) 512.70 kb ▃▇▆██████▅▃▃▂▂▁▁▁▁▁▁▁

parjs                                            921.78 µs/iter 928.46 µs        █             
                                          (829.38 µs … 1.41 ms)   1.06 ms       ▅██            
                                        (  3.44 mb …   6.66 mb)   4.35 mb ▂▂▂▂▃▄████▄▄▂▂▃▂▁▂▁▁▁

parsimmon                                        902.04 µs/iter 913.67 µs          █           
                                          (818.29 µs … 1.05 ms)   1.00 ms         ▃█▇          
                                        ( 10.44 mb …  10.78 mb)  10.52 mb ▄▅▃▃▆▅▅▇███▅▄▂▄▃▄▃▅▂▁

chevrotain                                       176.29 µs/iter 168.21 µs    █                 
                                          (146.88 µs … 2.87 ms) 287.46 µs   ▇█                 
                                        (191.98 kb …   1.33 mb) 524.62 kb ▂▅██▄▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma:grammar
   1.05x faster than chevrotain
   1.19x faster than sigma:defer
   5.38x faster than parsimmon
   5.49x faster than parjs

• recovery
--------------------------------------------------------------- -------------------------------
sigma:plain (no commit)                          289.06 µs/iter 291.21 µs     █                
                                        (254.67 µs … 504.88 µs) 408.50 µs    ▄█▆               
                                        (884.66 kb …   2.56 mb)   1.50 mb ▂▃▄███▅▂▂▁▁▁▁▁▁▁▁▁▁▁▁

sigma:committed (valid input)                    301.28 µs/iter 303.75 µs     ▇█               
                                        (265.58 µs … 600.29 µs) 413.29 µs     ██               
                                        (966.27 kb …   2.56 mb)   1.50 mb ▂▃▃▆██▇▃▂▁▁▁▁▁▁▁▁▁▁▁▁

sigma:recovering (valid input)                   322.99 µs/iter 325.21 µs     █▂               
                                        (286.83 µs … 599.71 µs) 442.54 µs     ██               
                                        (240.09 kb …   2.40 mb)   1.50 mb ▂▃▂███▅▂▂▁▁▁▁▁▁▁▁▁▁▁▁

sigma:committed (fails at the end)               304.97 µs/iter 308.08 µs     █                
                                        (268.67 µs … 532.42 µs) 431.08 µs    ▆██               
                                        (614.00 kb …   2.27 mb)   1.50 mb ▂▄▄███▅▃▂▁▁▁▁▁▁▁▁▁▁▁▁

sigma:recovering (5% broken)                     330.91 µs/iter 334.00 µs     █▇               
                                        (294.67 µs … 717.79 µs) 448.38 µs     ██               
                                        (141.05 kb …   2.95 mb)   1.44 mb ▂▅▄▇██▇▃▂▂▁▁▁▁▁▁▁▁▁▁▁

sigma:recovering (5% broken, syncTo)             333.48 µs/iter 337.46 µs     ▂█               
                                        (294.42 µs … 727.25 µs) 446.58 µs     ██▇              
                                        (266.59 kb …   2.53 mb)   1.44 mb ▂▄▃▆███▄▂▂▁▁▁▁▁▁▁▁▁▁▁

sigma:recovering (100% broken)                   370.91 µs/iter 374.13 µs    █▅                
                                        (331.92 µs … 897.42 µs) 538.42 µs    ██                
                                        (456.66 kb …   2.55 mb)   1.04 mb ▃▃▅██▆▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma:plain (no commit)
   1.04x faster than sigma:committed (valid input)
   1.06x faster than sigma:committed (fails at the end)
   1.12x faster than sigma:recovering (valid input)
   1.14x faster than sigma:recovering (5% broken)
   1.15x faster than sigma:recovering (5% broken, syncTo)
   1.28x faster than sigma:recovering (100% broken)

• recovery (nested)
--------------------------------------------------------------- -------------------------------
sigma:groups (valid input)                       296.43 µs/iter 300.42 µs     █▂               
                                        (264.67 µs … 492.00 µs) 415.00 µs    ▄██               
                                        (212.74 kb …   1.95 mb)   1.22 mb ▃▆▄███▄▂▂▁▁▁▁▁▁▁▁▁▁▁▁

sigma:groups recovering (1000 groups, 5% broken) 307.42 µs/iter 311.08 µs    ▄█                
                                        (277.00 µs … 763.83 µs) 430.42 µs    ██▃               
                                        (402.30 kb …   1.84 mb)   1.18 mb ▆▆▆███▄▂▂▂▁▁▁▁▁▁▁▁▁▁▁

summary
  sigma:groups (valid input)
   1.04x faster than sigma:groups recovering (1000 groups, 5% broken)
```

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
