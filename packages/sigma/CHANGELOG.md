# @nrsk/sigma

## 4.0.0

### Major Changes

- Parsers now run against a single mutable `ParseContext` instead of receiving `(input, pos)` and returning a result object. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- `Span` is now a `{ start, end }` object instead of a `[start, end]` tuple, and `Success` and `Failure` expose `start` and `end` directly instead of a nested `span`. `ParserError` keeps its `span` field, now in the object form. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- `lookahead` and `chainl` were rewritten, `attempt` was removed, and failure locations are now reported consistently across parsers and combinators. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- Removed the `@nrsk/sigma/combinators` and `@nrsk/sigma/parsers` subpath exports. Everything is exported from the package root. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- Removed the `ustring` parser. `string` should be used instead. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- Node.js 24 or newer is now required. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

- Renamed the `take*` selector combinators and generalized them from fixed arity to variadic. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))
  
  - `takeLeft` is now `first`, taking **two or more** parsers and returning the value of the first.
  - `takeRight` is now `last`, taking **two or more** parsers and returning the value of the last.
  - `takeMid` is now `inner`, taking **three or more** parsers. With exactly three it returns the value of the middle one as is; with more, it returns the values in between as a tuple.
  - `takeSides` is now `outer`, taking **three or more** parsers and returning the values of the first and the last as a tuple.
  
  Calling any of them below the minimum arity is a type error. The `takeUntil` and `skipUntil` combinators are unaffected.
  
  Also added the `ToFirst`, `ToLast` and `ToInner` utility types, so the return type of a wrapper built on top of these combinators can be written out the same way `ToTuple` allows for `sequence`.

- Added error recovery, so a parser can report several errors in one run instead of stopping at the first one. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))
  
  - `commit` marks a failure as committed, so enclosing combinators stop backtracking over it.
  - `backtrack` turns a committed failure back into an ordinary one.
  - `recover` catches a committed failure, skips the malformed region with a strategy parser and continues with a fallback value, recording the failure on the result.
  - `syncTo`, `syncPast` and `syncNested` are ready-made recovery strategies that scan forward to a synchronisation point.
  
  Associated breaking changes:
  
  - `Success` and `Failure` now carry `errors`, the failures the run recovered from. A recovered parse is `isOk: true` with a non-empty `errors`. `Failure` also gains `label`, set by `commit`.
  - `many` and other repetition combinators are no longer `SucceedingParser`, since a committed failure can pass through them.
  - `error` does not relabel a failure that was committed. Use `commit(error(parser, expected), label)` for the labelled form.
  - `tryRun` throws if the run recovered from anything. Use `run` to tolerate errors.

### Minor Changes

- Added `count`, `filter`, `not`, `fail` and `chainr`. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))
  
  - `count` applies a parser exactly `n` times and collects the values.
  - `filter` tests a parser's value with a predicate and fails if it is rejected.
  - `not` acts as negative lookahead: succeeds with `null` only if the parser fails.
  - `fail` always fails with the given message without consuming input.
  - `chainr` is the right-associative counterpart of `chainl`, useful for operators like exponentiation.

### Patch Changes

- Improved performance across parsers and combinators. The mutable parse context and flattened spans remove per-step result allocation, and hot paths avoid megamorphic dispatch. Overall improvements are: 2-4x faster, 5-10x less peak memory usage. ([#98](https://github.com/norskeld/sigma/pull/98)) ([@norskeld](https://github.com/norskeld))

## Older releases

Releases up to and including 3.8.0 are archived in [CHANGELOG-v3.md](https://github.com/norskeld/sigma/blob/master/packages/sigma/CHANGELOG-v3.md).
