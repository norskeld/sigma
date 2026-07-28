---
'@nrsk/sigma': major
---

Added error recovery, so a parser can report several errors in one run instead of stopping at the first one.

- `commit` marks a failure as committed, so enclosing combinators stop backtracking over it.
- `backtrack` turns a committed failure back into an ordinary one.
- `recover` catches a committed failure, skips the malformed region with a strategy parser and continues with a fallback value, recording the failure on the result.
- `syncTo`, `syncPast` and `syncNested` are ready-made recovery strategies that scan forward to a synchronisation point.

Associated breaking changes:

- `Success` and `Failure` now carry `errors`, the failures the run recovered from. A recovered parse is `isOk: true` with a non-empty `errors`. `Failure` also gains `label`, set by `commit`.
- `many` and other repetition combinators are no longer `SucceedingParser`, since a committed failure can pass through them.
- `error` does not relabel a failure that was committed. Use `commit(error(parser, expected), label)` for the labelled form.
- `tryRun` throws if the run recovered from anything. Use `run` to tolerate errors.
