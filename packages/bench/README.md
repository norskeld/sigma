# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries. Benchmarks are powered by [mitata].

## How to run locally

From the repository root:

```shell
pnpm bench
```

This builds `@nrsk/sigma` and runs all suites. To run a single suite, use `pnpm --filter @nrsk/sigma-bench bench:json` (or `bench:tuple`, `bench:many`).

## Notes

Unfortunately, it's difficult to come up with sensible benchmarks, given that how a parser written with **sigma** depends entirely on what you are parsing, how you structure your parser(s), which patterns the parser attempts to match first, what is involved in constructing your AST (if any), and so on.

All that said, here are some rough numbers from the [JSON parsing benchmark][json-bench].

```
clk: ~4.43 GHz
cpu: Apple M4 Max
runtime: node 24.13.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• JSON :: sigma vs parjs
------------------------------------------- -------------------------------
sigma:defer                  316.58 µs/iter 317.58 µs   ▆█
                    (305.50 µs … 446.38 µs) 358.75 µs ▂▅███▅▄▃▂▁▂▂▂▁▁▁▁▁▁▁▁
                  gc(  1.01 ms …   3.39 ms)   2.32 mb (  2.02 mb…  2.99 mb)

sigma:grammar                343.52 µs/iter 345.63 µs   █▃
                    (333.58 µs … 402.83 µs) 375.13 µs ▂▆██▆▅▃▄▂▂▃▂▂▂▂▂▁▁▁▁▁
                  gc(  1.03 ms …   2.39 ms)   2.32 mb (  2.16 mb…  2.95 mb)

parjs                          5.16 ms/iter   6.72 ms  █                 ▃
                        (3.49 ms … 6.98 ms)   6.95 ms ▅█▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂██▃
                  gc(  1.09 ms …   2.25 ms)  10.92 mb ( 10.07 mb… 12.15 mb)

summary
  sigma:defer
   1.09x faster than sigma:grammar
   16.31x faster than parjs
```

I have included results from [Sigma] and [Parjs] (another parser combinator library). I wanted to also add [Arcsecond], because I like its API with functional flavor, but somehow their JSON example is _atrociously_ slow (like, orders of magnitude, 250-500 times slower).

The [JSON sample][json-sample] being parsed is a typical JSON data, which has 923 lines. This translates to roughly **3M** lines of JSON per second.

<!-- Links. -->

[mitata]: https://github.com/evanwashere/mitata
[json-bench]: ./src/json
[json-sample]: ./src/json/@sample.ts
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[arcsecond]: https://github.com/francisrstokes/arcsecond
