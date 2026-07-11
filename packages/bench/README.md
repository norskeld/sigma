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
clk: ~4.38 GHz
cpu: Apple M4 Max
runtime: node 24.13.1 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
• JSON :: sigma vs parjs
------------------------------------------- -------------------------------
sigma:defer                  313.82 µs/iter 300.04 µs  █
                      (263.58 µs … 1.25 ms) 965.17 µs ▄█
                    (  1.69 mb …   2.97 mb)   2.31 mb ██▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

sigma:grammar                306.77 µs/iter 294.79 µs ▄█
                      (259.08 µs … 1.23 ms) 978.33 µs ██
                    (  1.51 mb …   2.90 mb)   2.31 mb ██▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

parjs                          3.79 ms/iter   3.90 ms      █▅▇▆
                        (3.46 ms … 4.29 ms)   4.24 ms   ▃▄▂████▄▄   ▅▄
                    ( 17.03 mb …  20.67 mb)  17.59 mb ▃▅██████████▃▆██▅▄▃▄▃

summary
  sigma:grammar
   1.02x faster than sigma:defer
   12.36x faster than parjs
```

I have included results from [Sigma] and [Parjs] `v1.3.9` (another parser combinator library). I wanted to also add [Arcsecond], because I like its API with functional flavor, but somehow their JSON example is _atrociously_ slow (like, orders of magnitude, 250-500 times slower).

The [JSON sample][json-sample] being parsed is a typical JSON data, which has 923 lines. This translates to roughly **3M** lines of JSON per second.

<!-- Links. -->

[mitata]: https://github.com/evanwashere/mitata
[json-bench]: ./src/json
[json-sample]: ./src/json/@sample.ts
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[arcsecond]: https://github.com/francisrstokes/arcsecond
