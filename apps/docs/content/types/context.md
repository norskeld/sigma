---
title: 'ParseContext'
description: 'ParseContext is the mutable state shared by all parsers during a single run. It holds the cursor, the failure that would be reported now, and the failures recovered so far.'
order: 3
---

# ParseContext

`ParseContext` is the mutable state every parser in a run shares. It holds the cursor, the failure that would be reported if the parse stopped right now, and the failures recovered so far. You only touch it when writing a [Parser] by hand.

```ts
class ParseContext {
  input: string
  pos: number

  errorPos: number
  errorStart: number
  errorEnd: number
  expected: string

  fatal: boolean
  label: string | null

  readonly errors: Array<Failure>
}
```

`pos` is the offset of the next character to read. The `error*` fields and `expected` describe the failure a parser last reported. `errorPos` is where it happened, and `errorStart` and `errorEnd` span what was wanted. That span may reach past `errorPos`.

`fatal` is true while a [committed][commit] failure propagates, and `label` is the name that commit attached, meaningful only while `fatal` is true. `errors` collects what [recover] handled.

## Methods

```ts
fail(expected: string, end?: number): Fail
```

Records a failure at the current position and returns [FAIL]. `end` defaults to `pos`, so pass it to highlight a wider span.

```ts
mark(): number
reset(mark: number): void
record(failure: Failure): void
```

`mark` snapshots how many failures have been recovered so far, and `reset` discards everything recovered since that point. That's what a combinator does when it throws away a speculative attempt. `record` appends a recovered failure.

```ts
commit(label: string | null): Fail
uncommit(): void
snapshot(): Failure
restore(failure: Failure): Fail
```

`commit` marks the current failure as committed and `uncommit` clears that mark. `snapshot` freezes the current failure into a [Failure], and `restore` writes one back, which is how [recover] re-raises a failure after its strategy gave up.

## Invariants

A hand-written parser has to respect all of these:

- A parser that returns [FAIL] leaves `pos` where it entered, with the error fields describing its failure.
- Committed failures rewind `pos` like ordinary ones.
- On success the error fields mean nothing, and `fatal` must be left false.
- [FAIL] rewinds `pos` but never `errors`, so a run that fails outright still reports what it recovered.

To swallow a failure, return it unchanged if `fatal` is set. Otherwise `reset` to the `mark` taken on entry, which drops what the discarded attempt recovered. A combinator that only passes a failure upwards does neither of these; whoever swallows the failure does.

<!-- Links. -->

[FAIL]: ./parser#fail
[Failure]: ./result#failure
[Parser]: ./parser

<!-- Combinators. -->

[commit]: ../combinators/commit
[recover]: ../combinators/recover
