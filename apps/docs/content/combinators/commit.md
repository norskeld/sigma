---
title: 'commit'
description: 'commit combinator applies parser and behaves exactly like it on success. On failure it marks the failure as committed, so enclosing combinators stop backtracking over it.'
---

# commit

`commit` combinator applies `parser` and behaves exactly like it on success. On failure the failure becomes *committed*: enclosing combinators stop backtracking over it. [choice] doesn't try later alternatives, repetition combinators like [many] and [sepBy] propagate it instead of ending the loop with what they collected, and [optional] no longer swallows it. Only [recover] and [backtrack] clear it again. [syncTo], [syncPast], [syncNested], [skipUntil] and [takeUntil] scan speculatively, so they drop any commitment raised inside their own scan.

The optional `label` ends up on the failure and is what [recover] matches with its `label` option. It defaults to `null`.

The [error recovery] guide covers where to place commits in a real grammar.

## Usage

Both parsers below describe the same grammar, but `Committed` marks the point past which `if` can only be a conditional. On `ifx` the plain version backtracks and matches the second alternative, while the committed one reports a real syntax error.

```ts
const IfStmt = sequence(string('if'), commit(string('('), 'cond'))

const Plain = choice(sequence(string('if'), string('(')), string('ifx'))
const Committed = choice(IfStmt, string('ifx'))
```

::: tip Success
```ts
run(Plain).with('ifx')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: 'ifx'
}
```
:::

::: danger Failure
```ts
run(Committed).with('ifx')

{
  isOk: false,
  start: 2,
  end: 3,
  pos: 2,
  expected: '(',
  label: 'cond'
}
```
:::

Commits nest, and the innermost label describes the failure most precisely, so that is the one kept.

```ts
const Parser = commit(sequence(string('a'), commit(string('b'), 'inner')), 'outer')
```

::: danger Failure
```ts
run(Parser).with('ax')

{
  isOk: false,
  start: 1,
  end: 2,
  pos: 1,
  expected: 'b',
  label: 'inner'
}
```
:::

An unlabelled inner commit falls back to the nearest enclosing label: `commit(sequence(string('a'), commit(string('b'))), 'outer')` on the same input reports `outer`. That keeps [recover]'s `label` option working when an inner rule commits without a label of its own.

[error] doesn't touch a committed failure either: the message stays as the committed parser reported it, so a relabelling higher up can't flatten it.

```ts
const Parser = error(sequence(string('hello'), commit(string(' world'), 'rest')), 'a greeting')
```

::: danger Failure
```ts
run(Parser).with('hello there')

{
  isOk: false,
  start: 5,
  end: 11,
  pos: 5,
  expected: ' world',
  label: 'rest'
}
```
:::

<!-- Links. -->

[error]: ./error
[choice]: ./choice
[error recovery]: ../guides/error-recovery
[many]: ./many
[optional]: ./optional
[recover]: ./recover
[sepBy]: ./sepBy
[backtrack]: ./backtrack
[syncTo]: ./syncTo
[syncPast]: ./syncPast
[syncNested]: ./syncNested
[skipUntil]: ./skipUntil
[takeUntil]: ./takeUntil
