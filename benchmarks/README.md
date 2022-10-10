# Benchmarks

Here you will find some benchmarks and rough performance comparison with similar libraries.

## How to run locally

Like a piece of cake.

> **Note**
>
> Make sure to run `npm i` at the root of the repository as well before running benchmarks, because `benchmarks` depend on the `@nrsk/sigma` sources outside this package.

```shell
npm i
npm run bench
```

## Notes

Unfortunately, it's difficult to come up with sensible benchmarks, given that how a parser written with **sigma** depends entirely on what you are parsing, how you structure your parser(s), which patterns the parser attempts to match first, what is involved in constructing your AST (if any), and so on.

All that said, here are some rough numbers from the [JSON parsing benchmark][json-bench] (running on my MacBook Pro 16" 2019 with `Intel i9-9880H @ 2.30GHz` and `Node@18`).

```hs
Running "JSON :: sigma vs parjs" suite...

  sigma: 790 ops/s, ±0.71%   | fastest
  parjs: 146 ops/s, ±0.56%   | slowest, 81.52% slower
```

I have included results from [Sigma] and [Parjs] (another parser combinator library). I wanted to also add [Arcsecond], because I like its API with functional flavor, but somehow their JSON example is _atrociously_ slow (like, orders of magnitude, 250-500 times slower).

The [JSON sample][json-sample] being parsed is a typical JSON data, which has 923 lines. This translates to **~700-730k** lines of JSON per second, and that is actually on par with some Rust parser combinator crates like [pom].

<!-- Links. -->

[json-bench]: ./src/json
[json-sample]: ./src/json/@sample.ts
[sigma]: https://github.com/norskeld/sigma
[parjs]: https://github.com/GregRos/parjs
[arcsecond]: https://github.com/francisrstokes/arcsecond
[pom]: https://github.com/J-F-Liu/pom
