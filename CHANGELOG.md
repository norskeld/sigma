## [3.1.3](https://github.com/norskeld/sigma/compare/v3.1.2...v3.1.3) (2023-01-05)


### Bug Fixes

* **parsers/noneOf:** halt at reaching eoi ([06779bd](https://github.com/norskeld/sigma/commit/06779bd77babd2dc523782d0ffa3f6419071a18f))
* **parsers/oneOf:** halt at reaching eoi ([b20f2a2](https://github.com/norskeld/sigma/commit/b20f2a25a523794de68fb4416e885697b2d46dfb))

## [3.1.2](https://github.com/norskeld/sigma/compare/v3.1.1...v3.1.2) (2023-01-05)


### Bug Fixes

* **combinators/many:** fix an edge case when combined with `noneOf` ([4630bf4](https://github.com/norskeld/sigma/commit/4630bf4e53749b91efb906be8ece5429aa74eddb))

## [3.1.1](https://github.com/norskeld/sigma/compare/v3.1.0...v3.1.1) (2022-10-25)


### Bug Fixes

* **vitest:** fix coverage collection ([91a1f9b](https://github.com/norskeld/sigma/commit/91a1f9bd5e9cd545ad2e9fefb66d792894146b59))

# [3.1.0](https://github.com/norskeld/sigma/compare/v3.0.0...v3.1.0) (2022-10-08)


### Bug Fixes

* **scripts:** move tsm back ([cf899d0](https://github.com/norskeld/sigma/commit/cf899d0c2d495ec7e8ded8a992c50548a671b183))


### Features

* **build:** finalize tsup setup with multiple options for build ([d9a54a8](https://github.com/norskeld/sigma/commit/d9a54a86f8f8856b7c76c3385df86dbdbcaa75e7))
* **build:** introduce tsup, simplify build, make package a module ([e803455](https://github.com/norskeld/sigma/commit/e803455d24909769096d04b699bfe4f5e28e101b))
* **chore:** cleanup packages and files ([6cd7146](https://github.com/norskeld/sigma/commit/6cd714630e29cc9bb06bf6919c41ae46996850ef))
* **vitest:** add vitest, aliasing, cleanup uvu deps ([a4883a3](https://github.com/norskeld/sigma/commit/a4883a35a62d541e50e32634a341000a96b28e5a))

# [3.0.0](https://github.com/norskeld/sigma/compare/v2.10.0...v3.0.0) (2022-10-02)


### Code Refactoring

* change the output type from to `number` for number parsers ([24406ab](https://github.com/norskeld/sigma/commit/24406abdbff934165c210966ad06768bab7ea420))


### BREAKING CHANGES

* The output type of number parsers has changed from `string` to `number`, i.e. these parsers now have the type of `Parser<number>` instead of `Parser<string>`.

# [2.10.0](https://github.com/norskeld/sigma/compare/v2.9.0...v2.10.0) (2022-07-29)


### Features

* number parsers ([c22af49](https://github.com/norskeld/sigma/commit/c22af49510f1241125b1b221be1e982066058fbe))

# [2.9.0](https://github.com/norskeld/sigma/compare/v2.8.0...v2.9.0) (2022-07-12)


### Features

* **tsdoc:** add tsdocs for parsers ([c78d57a](https://github.com/norskeld/sigma/commit/c78d57a04bb373b2964a3ec0cfb20ad50818a3db))
* **tsdoc:** add tsdocs to combinators ([5220e26](https://github.com/norskeld/sigma/commit/5220e2611a580b551b56eba75100c0f3c089d3c0))
* **tsdoc:** final touches ([3233440](https://github.com/norskeld/sigma/commit/323344035537f3d8ece23ef6826a0a764b78f89e))

# [2.8.0](https://github.com/norskeld/sigma/compare/v2.7.0...v2.8.0) (2022-07-12)


### Features

* **combinators/*Until:** add `takeUntil` and `skipUntil` combinators ([003f82d](https://github.com/norskeld/sigma/commit/003f82d51c79349905dc5808aaca3e0725797021))

# [2.7.0](https://github.com/norskeld/sigma/compare/v2.6.0...v2.7.0) (2022-07-04)


### Features

* **parsers/noneOf:** add `noneOf` parser ([d6bc81c](https://github.com/norskeld/sigma/commit/d6bc81c591cc5262183f9977bf54f45407aa9bc0))

# [2.6.0](https://github.com/norskeld/sigma/compare/v2.5.0...v2.6.0) (2022-07-04)


### Features

* **parsers/oneOf:** add `oneOf` parser ([6d6c2a6](https://github.com/norskeld/sigma/commit/6d6c2a6d20c42ec0198b245f26cea0d08d615c08))

# [2.5.0](https://github.com/norskeld/sigma/compare/v2.4.0...v2.5.0) (2022-07-04)


### Features

* **parsers/any:** add `any` parser ([bfb9620](https://github.com/norskeld/sigma/commit/bfb96200c83d3f20b6c6b7414e84b7c9263080e4))

# [2.4.0](https://github.com/norskeld/sigma/compare/v2.3.1...v2.4.0) (2022-07-02)


### Features

* **combinators/sepBy1:** add `sepBy1` combinator ([52b7ddf](https://github.com/norskeld/sigma/commit/52b7ddf6fbdab2daae9ac43d6f6055ed833ab0ad))

## [2.3.1](https://github.com/norskeld/sigma/compare/v2.3.0...v2.3.1) (2022-06-01)


### Bug Fixes

* **combinators/many1:** fix `many1` behavior ([169bf2e](https://github.com/norskeld/sigma/commit/169bf2eef323b131bf3e670f5336fb0e002a18bd))

# [2.3.0](https://github.com/norskeld/sigma/compare/v2.2.0...v2.3.0) (2022-06-01)


### Features

* **combinators/when:** add context-aware `when` combinator ([1537b51](https://github.com/norskeld/sigma/commit/1537b510e1ea2487519dadb62981a00aad01ceaa))

# [2.2.0](https://github.com/norskeld/sigma/compare/v2.1.3...v2.2.0) (2022-05-31)


### Features

* **bench:** add latest sigma for benchmarks ([f48e132](https://github.com/norskeld/sigma/commit/f48e132a86732c340e217a2240053e9d070e304f))

## [2.1.3](https://github.com/norskeld/sigma/compare/v2.1.2...v2.1.3) (2022-05-31)


### Bug Fixes

* **combinators/choice:** get rid of non-null assertion and refactor a bit ([2f0a9f9](https://github.com/norskeld/sigma/commit/2f0a9f927ce903bf8d9252ba7554b278f4487722))
* **combinators/sepBy:** remove unreachable `return` ([7b3a9d0](https://github.com/norskeld/sigma/commit/7b3a9d05f794b8e9fc60ed321d234ed13d706ec0))
* **parsers/float:** do not return `input` ([bd92d3d](https://github.com/norskeld/sigma/commit/bd92d3d7256ced7273449290493a7d623e6ac298))

## [2.1.2](https://github.com/norskeld/sigma/compare/v2.1.1...v2.1.2) (2022-05-31)


### Bug Fixes

* **combinators/sepBy:** fix behavior & improve perf ([f709a30](https://github.com/norskeld/sigma/commit/f709a304782b5048ed0b5fe7b360f4dfe65d446f))

## [2.1.1](https://github.com/norskeld/sigma/compare/v2.1.0...v2.1.1) (2022-05-14)


### Bug Fixes

* **README:** update README ([3e0a3f2](https://github.com/norskeld/sigma/commit/3e0a3f22895bf8626c56aedf3fea7775470a6720))

# [2.1.0](https://github.com/norskeld/sigma/compare/v2.0.2...v2.1.0) (2022-05-14)


### Features

* **combinators/many1:** add `many1` combinator ([5342135](https://github.com/norskeld/sigma/commit/534213598672b4609f82dcbba37973155caf0a29))


### Performance Improvements

* **no-release:** refactor benchmarks & add another bench ([11d42b4](https://github.com/norskeld/sigma/commit/11d42b4ecbbb6527bc1b1b17660afefe7fea61eb))

## [2.0.2](https://github.com/norskeld/sigma/compare/v2.0.1...v2.0.2) (2022-05-14)


### Bug Fixes

* change `error` back to `expected` ([d1ba6c3](https://github.com/norskeld/sigma/commit/d1ba6c3ebb4d5a09336cb5ba1fcb42ff492a0458))

## [2.0.1](https://github.com/norskeld/sigma/compare/v2.0.0...v2.0.1) (2022-05-13)


### Performance Improvements

* improve performance by simplifying values passed around ([505dad8](https://github.com/norskeld/sigma/commit/505dad8d173ee3bd92da759233f36b164339b7d7))
* **no-release:** add benchmarks ([fd39bb1](https://github.com/norskeld/sigma/commit/fd39bb16e894ee1cad6816a7130fb99b23de9923))

# [2.0.0](https://github.com/norskeld/sigma/compare/v1.4.2...v2.0.0) (2022-01-23)


### Code Refactoring

* remove `lazy` parser ([4340d7d](https://github.com/norskeld/sigma/commit/4340d7df47e504e3d354047d529056b465fd79e8))
* restructure & rename combinators/parsers ([f6a6956](https://github.com/norskeld/sigma/commit/f6a69567eb87579d74cfb76a776a799e34b35107))


### BREAKING CHANGES

- Lifted contents of the `internal` directory since the library itself gets bundled anyway.
- Removed all aliases for parsers and combinators.
- Removed `whitespaceOptional` parser. Its functionality can be replicated with `optional(whitespace())`.
- Removed `lazy` parser. `defer` is superior to it at almost every aspect.
- Renamed the following parsers:
  - `newline` -> `eol`
  - `integer` -> `int`
  - `integerUnsigned` -> `uint`
  - `uniString` -> `ustring`
- Renamed the following combinators:
  - `list` -> `sepBy`

## [1.4.2](https://github.com/norskeld/sigma/compare/v1.4.1...v1.4.2) (2022-01-12)


### Bug Fixes

* **combinators/choice:** get rid of manual overloads ([ace89ea](https://github.com/norskeld/sigma/commit/ace89ea4b151b42ed10c459c06a341dadff68f95))
* **combinators/sequence:** get rid of manual overloads ([d81a7b6](https://github.com/norskeld/sigma/commit/d81a7b6cd44a66bf232b23c334c9aab23a3091ad))

## [1.4.1](https://github.com/norskeld/sigma/compare/v1.4.0...v1.4.1) (2022-01-02)


### Bug Fixes

* mark package as side-effect-free ([e2f7327](https://github.com/norskeld/sigma/commit/e2f7327cddfb90e0599f833e119ad2252964e55c))

# [1.4.0](https://github.com/norskeld/sigma/compare/v1.3.0...v1.4.0) (2021-12-02)


### Features

* **combinators/take:** add `takeSides` combinator ([7bd2eb1](https://github.com/norskeld/sigma/commit/7bd2eb130337a419308aaf777b75627a370c065b))

# [1.3.0](https://github.com/norskeld/sigma/compare/v1.2.0...v1.3.0) (2021-11-28)


### Bug Fixes

* **parsers/float:** fix regexps, options & tests ([78fa9af](https://github.com/norskeld/sigma/commit/78fa9af8e3a998cf7f0970528d361699183e393c))
* **parsers/integer:** fix regexp ([c689144](https://github.com/norskeld/sigma/commit/c68914446a12f7adc4f9b30378ccfa7789db8f60))
* **parsers/integer:** fix regexps, options & tests ([2421d6d](https://github.com/norskeld/sigma/commit/2421d6df6900aea0e2a4d7f3758e956a65b611e7))


### Features

* **parsers/eof:** add `eof` parser ([d88a3f2](https://github.com/norskeld/sigma/commit/d88a3f2ccbc6a9de1864950b3cfa232616626ced))
* **parsers/float:** add `float` parser ([f993009](https://github.com/norskeld/sigma/commit/f9930092708f8bab1c1517b02214d983d634d756))
* **parsers/integer:** add `integer` parser ([f206d49](https://github.com/norskeld/sigma/commit/f206d49c15ff8c415a7dd23674bea3f24110c4de))
* **parsers/letter:** add `letter` and `letters` parsers ([2540b17](https://github.com/norskeld/sigma/commit/2540b1762c9c5082c5818e60301681199f370307))
* **parsers/newline:** add `newline` parser ([ae8d6ec](https://github.com/norskeld/sigma/commit/ae8d6ec60ce9e1975aa6bd03e258a351e73b8560))
* **parsers/rest:** add `rest` parser ([1c4c745](https://github.com/norskeld/sigma/commit/1c4c745343cb5c4747d542b10e10c20b3456ce70))
* **parsers/whitespace:** add `whitespace` & `whitespaceOptional` parsers ([821680a](https://github.com/norskeld/sigma/commit/821680a4c5b53730c0c731ef312e123ceec12668))

# [1.2.0](https://github.com/norskeld/sigma/compare/v1.1.1...v1.2.0) (2021-11-17)

### Features

* add unicode support ([#14](https://github.com/norskeld/sigma/issues/14)) ([ebf884a](https://github.com/norskeld/sigma/commit/ebf884a5e039cd05b14b43cd52c0090de15bfa7d))


# [1.1.1](https://github.com/norskeld/sigma/compare/v1.1.0...v1.1.1) (2021-11-15)

### Docs

* **readme**: add `installation` and `example` sections ([e80cae3](https://github.com/norskeld/sigma/commit/e80cae365d00298859d8557c83dc88e038443b84))


# [1.1.0](https://github.com/norskeld/sigma/compare/v1.0.0...v1.1.0) (2021-11-15)

### Features

* hybrid bundles - esm + cjs ([#10](https://github.com/norskeld/sigma/issues/10)) ([5987ad7](https://github.com/norskeld/sigma/commit/5987ad7ff757ea61a82d44066927de304bf5afac))


# 1.0.0 (2021-11-12)

### Features

* proof of concept ([#7](https://github.com/norskeld/sigma/issues/7)) ([ee117b6](https://github.com/norskeld/sigma/commit/ee117b6ca07116a3d3a34a098c4c1f14dbe18e4d))
