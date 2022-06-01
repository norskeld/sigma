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
