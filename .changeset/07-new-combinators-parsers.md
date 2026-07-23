---
'@nrsk/sigma': minor
---

Added `char`, `count`, `filter`, `not`, `fail` and `chainr`.

- `char` parses a single character, i.e. a full code point.
- `count` applies a parser exactly `n` times and collects the values.
- `filter` tests a parser's value with a predicate and fails if it is rejected.
- `not` acts as negative lookahead: succeeds with `null` only if the parser fails.
- `fail` always fails with the given message without consuming input.
- `chainr` is the right-associative counterpart of `chainl`, useful for operators like exponentiation.
