---
title: 'recover'
description: "recover combinator applies parser and, if it fails while committed, resynchronises with strategy and resolves to a fallback value instead, recording the failure on the result's errors."
---

# recover

`recover` combinator applies `parser` and, if it fails *while committed*, applies `strategy` to consume the malformed region and resolves to a fallback value instead of failing. The failure is recorded on the `errors` of the result [run] returns, and the result itself stays `isOk: true`.

`fallback` receives the failure and the `span` of the consumed region, so it can build an error node for the tree being parsed. Omit it and the combinator resolves to `null`.

Only committed failures are handled. Ordinary ones pass through untouched, so a `recover` inside [many] stops the loop cleanly at the end of input instead of manufacturing a trailing error node for the leftovers. [commit] marks the point past which a failure is a real syntax error rather than a rejected alternative.

`strategy` runs from the position the failure was reported at, not from the start of the region, so the prefix `parser` already accepted is never rescanned. That matters whenever the resynchronisation point can also occur inside a valid construct: scanning for `;` from the start of `set a = "x;y" ?;` would stop inside the string literal and turn one error into a cascade. The `span` handed to `fallback` still covers the whole region.

`strategy` is an ordinary parser, usually [syncTo], [syncPast] or [syncNested]. If it fails there's no resynchronisation point, so the original failure is re-raised, still committed, along with anything recovered inside the region. To backtrack over a committed failure without consuming the region or standing in for it, use [backtrack].

The [error recovery] guide builds a grammar that uses all of this end to end.

::: warning
Inside a repetition combinator the recovery has to advance, or the zero-width guard stops the loop and the diagnostic goes with it. [syncPast] always advances unless it's already at the end of input; [syncTo] advances whenever the failure is reported past the start of the region, which is the normal case for a [commit] placed after a distinguishing token.
:::

## Usage

```ts
const Parser = recover(
  sequence(string('a'), commit(string('b'), 'inner')),
  syncPast(string(';')),
  (failure, span) => ({ failure: failure.expected, span })
)
```

::: tip Success
```ts
run(Parser).with('az;rest')

{
  isOk: true,
  start: 0,
  end: 3,
  pos: 3,
  value: { failure: 'b', span: { start: 0, end: 3 } },
  errors: [
    { isOk: false, start: 1, end: 2, pos: 1, expected: 'b', label: 'inner', errors: [] }
  ]
}
```
:::

## Standing in for a missing token

A `strategy` that consumes nothing turns `recover` into token insertion: [nothing] reports the missing token, a stand-in value takes its place, and the parse carries on where it left off. Use it in a fixed position, never inside a repetition.

```ts
const Semi = recover(commit(string(';'), 'semi'), nothing(), () => null)
```

::: tip Success
```ts
run(sequence(string('a'), Semi, string('b'))).with('ab')

{
  isOk: true,
  start: 0,
  end: 2,
  pos: 2,
  value: ['a', null, 'b'],
  errors: [
    { isOk: false, start: 1, end: 2, pos: 1, expected: ';', label: 'semi', errors: [] }
  ]
}
```
:::

## Collecting several errors

Wrapping a rule in `recover` and repeating it with [many] reports every malformed region in one pass, instead of stopping at the first one.

```ts
const Statement = map(
  sequence(string('let '), commit(first(letters(), string(';')), 'stmt')),
  ([, name]) => ({ kind: 'let', name })
)

const Program = many(
  recover(
    Statement,
    syncPast(string(';')),
    (_failure, span) => ({ kind: 'error', start: span.start, end: span.end })
  )
)
```

::: tip Success
```ts
run(Program).with('let a;let ;let c;')

{
  isOk: true,
  start: 0,
  end: 17,
  pos: 17,
  value: [
    { kind: 'let', name: 'a' },
    { kind: 'error', start: 6, end: 11 },
    { kind: 'let', name: 'c' }
  ],
  errors: [
    { isOk: false, start: 10, end: 10, pos: 10, expected: 'letters', label: 'stmt', errors: [] }
  ]
}
```
---
```ts
run(Program).with('let a;xyz')

{
  isOk: true,
  start: 0,
  end: 6,
  pos: 6,
  value: [ { kind: 'let', name: 'a' } ],
  errors: []
}
```
:::

The trailing `xyz` doesn't match `let `, so the failure is never committed, `many` stops, and no error node is produced for the rest of the input.

## Restricting by label

With `options.label` only failures committed with that exact label are handled; everything else stays committed for an outer `recover` to deal with. Here the failure carries `other`, so it's declined:

```ts
const Parser = recover(
  commit(string('a'), 'other'),
  syncPast(string(';')),
  () => 'recovered',
  { label: 'mine' }
)
```

::: danger Failure
```ts
run(Parser).with('z;')

{
  isOk: false,
  start: 0,
  end: 1,
  pos: 0,
  expected: 'a',
  label: 'other'
}
```
:::

The same happens when `strategy` can't find a resynchronisation point. Below `string('!')` fails, so the committed failure stands as it was, with its label intact:

```ts
const Parser = recover(commit(string('a'), 'x'), string('!'), () => 'recovered')
```

::: danger Failure
```ts
run(Parser).with('z')

{
  isOk: false,
  start: 0,
  end: 1,
  pos: 0,
  expected: 'a',
  label: 'x'
}
```
:::

<!-- Links. -->

[commit]: ./commit
[error recovery]: ../guides/error-recovery
[many]: ./many
[nothing]: ../parsers/nothing
[run]: ../core/run
[syncNested]: ./syncNested
[syncPast]: ./syncPast
[syncTo]: ./syncTo
[backtrack]: ./backtrack
