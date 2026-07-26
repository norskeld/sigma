---
title: 'backtrack'
description: 'backtrack combinator applies parser and turns a committed failure back into an ordinary one, so enclosing combinators may backtrack over it again.'
---

# backtrack

`backtrack` combinator applies `parser` and turns a committed failure back into an ordinary one, so enclosing combinators may backtrack over it again. The `label` set by [commit] is cleared along with the commitment. On success it's fully transparent.

Use it to run a committed parser speculatively. A grammar rule that commits internally is still worth trying as a [choice] alternative, as long as its failure doesn't end the whole parse.

## Usage

`IfStmt` commits after `if`, so on its own it would stop [choice] from trying `string('ifx')`. Wrapping it in `backtrack` restores backtracking.

```ts
const IfStmt = sequence(string('if'), commit(string('('), 'cond'))
const Parser = choice(backtrack(IfStmt), string('ifx'))
```

::: tip Success
```ts
run(Parser).with('ifx')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: 'ifx'
}
```
:::

When nothing catches the uncommitted failure it's reported as an ordinary one, without a label.

```ts
const Uncommitted = backtrack(commit(string('a'), 'x'))
```

::: danger Failure
```ts
run(Uncommitted).with('b')

{
  isOk: false,
  start: 0,
  end: 1,
  pos: 0,
  expected: 'a',
  label: null
}
```
:::

Unlike [recover], `backtrack` doesn't consume the malformed region or produce a stand-in value. It only changes how enclosing combinators treat the failure. The [error recovery] guide contrasts the two.

<!-- Links. -->

[choice]: ./choice
[commit]: ./commit
[error recovery]: ../guides/error-recovery
[recover]: ./recover
