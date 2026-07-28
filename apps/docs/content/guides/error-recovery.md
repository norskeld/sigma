---
title: 'Error recovery'
description: 'How Sigma reports several syntax errors from one run and still produces a usable tree.'
order: 4
---

# Error recovery

By default a run stops at the first failure. That's fine for a validator, but an editor or a compiler front-end needs every error in the file and a tree it can still work with. Sigma builds that out of two pieces: [commit] marks the point past which a failure is a real syntax error, and [recover] resynchronises when one happens.

This page grows one small grammar until it does both.

## The grammar

The language parsed below has three statements: a binding, a call, and a block.

```
let width = 320;
print(width, 2);
{ let scale = 2; }
```

Written out, the grammar is roughly this:

```text
program   = body
body      = statement*
statement = binding | print | block
binding   = "let" name "=" value ";"
print     = "print" "(" value ( "," value )* ")" ";"
block     = "{" body "}"
name      = letters
value     = letters | digits

letters   = ? letters ?
digits    = ? digits ?
```

The AST comes first, as a union of object shapes. The `error` node is in the union from the start, since that's what a recovered region resolves to later.

```ts
type Node =
  | { kind: 'let'; name: string; value: string | number }
  | { kind: 'print'; args: Array<string | number> }
  | { kind: 'block'; body: Array<Node> }
  | { kind: 'error'; span: Span }
```

Then the lexemes. `token` attaches trailing whitespace to whatever it wraps, so the rules below never mention it again.

```ts
const ws = optional(whitespace())

function token<T>(parser: Parser<T>): Parser<T> {
  return first(parser, ws)
}

const Semi = token(string(';'))
const Comma = token(string(','))
const Equals = token(string('='))
const Open = token(string('('))
const Close = token(string(')'))
const OpenBrace = token(string('{'))
const CloseBrace = token(string('}'))

const Name = token(letters())
const Num = token(integer())
const Value = choice(Num, Name)
```

Since blocks contain statements, the rules are mutually recursive.

```ts
const Lang = grammar({
  Program(): Parser<Array<Node>> {
    return inner(ws, this.Body, eof())
  },

  Body(): Parser<Array<Node>> {
    return many(this.Statement)
  },

  Statement(): Parser<Node> {
    return choice(this.Binding, this.Print, this.Block)
  },

  Binding(): Parser<Node> {
    return map(
      last(
        token(string('let')),
        outer(Name, Equals, first(Value, Semi)),
      ),
      ([name, value]) => ({ kind: 'let', name, value }),
    )
  },

  Print(): Parser<Node> {
    return map(
      last(
        token(string('print')),
        inner(Open, sepBy(Value, Comma), first(Close, Semi)),
      ),
      (args) => ({ kind: 'print', args }),
    )
  },

  Block(): Parser<Node> {
    return map(
      inner(OpenBrace, this.Body, CloseBrace),
      (body) => ({ kind: 'block', body }),
    )
  },
})
```

On valid input it does what you'd expect.

```ts
run(Lang.Program).with(`
let width = 320;
print(width, 2);
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 35,
  pos: 35,
  value: [
    { kind: 'let', name: 'width', value: 320 },
    { kind: 'print', args: [ 'width', 2 ] }
  ],
  errors: []
}
```

## The first failure wins

Add another statement and break it by dropping its name:

```ts
run(Lang.Program).with(`
let width = 320;
let = 240;
print(width, 2);
`)
```

```ts
{
  isOk: false,
  start: 18,
  end: 18,
  pos: 18,
  expected: 'end of input',
  label: null,
  errors: []
}
```

One error, and it's the wrong one. Position 18 is the start of `let = 240;`, and the complaint is that the file didn't end there.

That's the PEG evaluation model in action. [choice] tries `Binding`, which consumes `let` and fails on the missing name. A failed alternative is just an alternative that didn't apply, so `choice` rewinds and tries `Print`, then `Block`, and none of them match. [many] reads that as "no more statements" and stops, and [eof] then fails on the leftovers, overwriting what little was left of the original complaint. The real problem, a missing name after `let`, is discarded.

There's also nothing to recover from. As far as the grammar is concerned, no statement started here at all.

## Committing to a parse

[commit] says that once the parser is past a certain point, backtracking is not the answer. Here that point is each rule's opening token: after `let` the construct can only be a binding.

```ts
const Lang = grammar({
  // ...

  Binding(): Parser<Node> {
    return map(
      last(
        token(string('let')),
        outer(Name, Equals, first(Value, Semi)), // [!code --]
        commit(outer(Name, Equals, first(Value, Semi)), 'let'), // [!code ++]
      ),
      ([name, value]) => ({ kind: 'let', name, value }),
    )
  },

  Print(): Parser<Node> {
    return map(
      last(
        token(string('print')),
        inner(Open, sepBy(Value, Comma), first(Close, Semi)), // [!code --]
        commit(inner(Open, sepBy(Value, Comma), first(Close, Semi)), 'print'), // [!code ++]
      ),
      (args) => ({ kind: 'print', args }),
    )
  },

  Block(): Parser<Node> {
    return map(
      inner(OpenBrace, this.Body, CloseBrace), // [!code --]
      last(OpenBrace, commit(first(this.Body, CloseBrace), 'block')), // [!code ++]
      (body) => ({ kind: 'block', body }),
    )
  },
})
```

A committed failure stops being backtracked over, so `choice` gives up instead of trying `Print`, and the failure travels out with the label attached:

```ts
run(Lang.Program).with(`
let width = 320;
let = 240;
print(width, 2);
`)
```

```ts
{
  isOk: false,
  start: 22,
  end: 22,
  pos: 22,
  expected: 'letters',
  label: 'let',
  errors: []
}
```

Position 22 is the `=`, and the message names what was actually missing. See [commit] for what commitment does to each combinator.

The run still stops at the first error, but commitment produced a failure worth recovering from.

## Recovering

[recover] takes a parser, a resynchronisation strategy, and a fallback. On a committed failure it records the failure, runs the strategy to skip the malformed region, and resolves to the fallback value in its place.

For a statement list the natural boundary is the terminator, so the strategy is [syncPast] over `;`. Only `Body` changes:

```ts
function errorNode(_: Failure, span: Span): Node { // [!code ++]
  return { kind: 'error', span } // [!code ++]
} // [!code ++]

const Lang = grammar({
  // ...

  Body(): Parser<Array<Node>> {
    return many(this.Statement) // [!code --]
    return many(recover(this.Statement, syncPast(Semi), errorNode)) // [!code ++]
  },

  // ...
})
```

One pass over the same input now yields all three statements, with the broken one standing in as an error node:

```ts
run(Lang.Program).with(`
let width = 320;
let = 240;
print(width, 2);
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 46,
  pos: 46,
  value: [
    { kind: 'let', name: 'width', value: 320 },
    { kind: 'error', span: { start: 18, end: 29 } }, // [!code highlight]
    { kind: 'print', args: [ 'width', 2 ] }
  ],
  errors: [
    {
      isOk: false,
      start: 22,
      end: 22,
      pos: 22,
      expected: 'letters',
      label: 'let',
      errors: []
    }
  ]
}
```

The result stays `isOk: true` and the failure moves to `errors`. The error node's span covers the whole statement, from where `Statement` started to where the strategy stopped, not just the point the parser choked on.

`recover` deliberately ignores uncommitted failures, which is what keeps the loop terminating. At the end of the input `Statement` fails before reaching any `commit`, that failure passes straight through, and `many` stops instead of manufacturing a trailing error node for whatever is left.

## Choosing a resynchronisation point

The strategy is an ordinary parser, and which one you pick decides how much input a single error costs you. Here a terminator goes missing instead of a name:

```ts
run(Lang.Program).with(`
let width = 320
let height = 240;
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 35,
  pos: 35,
  value: [ { kind: 'error', span: { start: 1, end: 35 } } ], // [!code highlight]
  errors: [
    {
      isOk: false,
      start: 17,
      end: 18,
      pos: 17,
      expected: ';',
      label: 'let',
      errors: []
    }
  ]
}
```

Both statements collapsed into a single error node. `syncPast(Semi)` scans for the next `;`, and with the first one gone, the next one belongs to the following statement, which gets swallowed along with the broken one.

[syncTo] stops before its match instead of consuming it, which is what you want when the resynchronisation point starts the next construct rather than terminating the broken one. Sync on the statement keywords instead:

```ts
const StatementStart = choice(string('let'), string('print'), string('{'), string('}')) // [!code ++]

const Lang = grammar({
  // ...

  Body(): Parser<Array<Node>> {
    return many(recover(this.Statement, syncPast(Semi), errorNode)) // [!code --]
    return many(recover(this.Statement, syncTo(StatementStart), errorNode)) // [!code ++]
  },

  // ...
})
```

Now only the broken statement is lost:

```ts
run(Lang.Program).with(`
let width = 320
let height = 240;
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 35,
  pos: 35,
  value: [
    { kind: 'error', span: { start: 1, end: 17 } }, // [!code highlight]
    { kind: 'let', name: 'height', value: 240 } // [!code highlight]
  ],
  errors: [
    {
      isOk: false,
      start: 17,
      end: 18,
      pos: 17,
      expected: ';',
      label: 'let',
      errors: []
    }
  ]
}
```

Neither strategy can fail. `syncPast` always advances unless it's already at the end of input, which guarantees a recovery inside a loop makes progress. `syncTo` only advances when the failure is reported past the start of the region, which holds for a `commit` placed after a distinguishing token like the ones above.

## Recovering out of a block

Blocks nest, and a scan for the next `}` would stop at the wrong one. Take a stray token sitting before an inner block:

```
{ let x = 1; oops { let y = 2; } }
```

`Body` stops at `oops`, the `'block'` commit fires because `}` isn't there, and the malformed region runs to the end of the outer block. Skipping to the first `}` would land in the middle of it. [syncNested] tracks depth instead, so the inner `{ ... }` raises and lowers it again and the scan stops after the brace that actually balances.

The block gets its own recovery point, with `options.label` restricting it to failures committed as `'block'`:

```ts
const Lang = grammar({
  // ...

  Block(): Parser<Node> {
    return map( // [!code --]
      last(OpenBrace, commit(first(this.Body, CloseBrace), 'block')), // [!code --]
      (body) => ({ kind: 'block', body }), // [!code --]
    ) // [!code --]
    return recover( // [!code ++]
      map( // [!code ++]
        last(OpenBrace, commit(first(this.Body, CloseBrace), 'block')), // [!code ++]
        (body) => ({ kind: 'block', body }), // [!code ++]
      ), // [!code ++]
      syncNested(OpenBrace, CloseBrace), // [!code ++]
      errorNode, // [!code ++]
      { label: 'block' }, // [!code ++]
    ) // [!code ++]
  },

  // ...
})
```

Recovery points now nest. A `'block'` failure is handled here, while a `'let'` failure raised inside a block is declined and left committed for the `recover` in the block's own `Body`.

```ts
run(Lang.Program).with(`
{ let x = 1; oops { let y = 2; } }
let z = 3;
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 47,
  pos: 47,
  value: [
    { kind: 'error', span: { start: 1, end: 36 } }, // [!code highlight]
    { kind: 'let', name: 'z', value: 3 }
  ],
  errors: [
    {
      isOk: false,
      start: 14,
      end: 15,
      pos: 14,
      expected: '}',
      label: 'block',
      errors: []
    }
  ]
}
```

A broken statement inside an otherwise well-formed block is caught by `Body` instead, and the block itself survives:

```ts
run(Lang.Program).with(`
{ let x = 1;
  let = 2;
}
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 27,
  pos: 27,
  value: [
    {
      kind: 'block', // [!code highlight]
      body: [
        { kind: 'let', name: 'x', value: 1 },
        { kind: 'error', span: { start: 16, end: 25 } } // [!code highlight]
      ]
    }
  ],
  errors: [
    {
      isOk: false,
      start: 20,
      end: 20,
      pos: 20,
      expected: 'letters',
      label: 'let',
      errors: []
    }
  ]
}
```

## Inserting a missing token

A strategy that consumes nothing turns `recover` into token insertion: [nothing] reports the missing token and the parse carries on where it left off, with no region skipped at all.

```ts
const InsertedSemi = recover(commit(Semi, 'semi'), nothing(), () => null) // [!code ++]

const Lang = grammar({
  // ...

  Binding(): Parser<Node> {
    return map(
      last(
        token(string('let')),
        commit(outer(Name, Equals, first(Value, Semi)), 'let'), // [!code --]
        commit(outer(Name, Equals, first(Value, InsertedSemi)), 'let'), // [!code ++]
      ),
      ([name, value]) => ({ kind: 'let', name, value }),
    )
  },

  // ...
})
```

The file with the missing semicolon now parses completely, and the omission is properly reported:

```ts
run(Lang.Program).with(`
let width = 320
let height = 240;
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 35,
  pos: 35,
  value: [
    { kind: 'let', name: 'width', value: 320 }, // [!code highlight]
    { kind: 'let', name: 'height', value: 240 } // [!code highlight]
  ],
  errors: [
    {
      isOk: false,
      start: 17,
      end: 18,
      pos: 17,
      expected: ';',
      label: 'semi', // [!code highlight]
      errors: []
    }
  ]
}
```

::: warning
Use it in a fixed position such as a [sequence], never inside a repetition, where a zero-width recovery stops the loop.
:::

## Accounting for the whole file

`many` stops at the first uncommitted failure, which is what makes recovery terminate, but it also means input matching no rule at all is left unparsed, and [eof] fails on it:

```ts
run(Lang.Program).with(`
let a = 1;
xyz
`)
```

```ts
{
  isOk: false,
  start: 12,
  end: 12,
  pos: 12,
  expected: 'end of input', // [!code highlight]
  label: null,
  errors: []
}
```

Give the loop a last alternative that always fails, and commit to it. "Nothing matched here" turns into a real syntax error, which the recovery point then handles like any other:

```ts
const Unknown = commit(fail('statement'), 'unknown') // [!code ++]

const Lang = grammar({
  Program(): Parser<Array<Node>> {
    return inner(ws, this.Body, eof()) // [!code --]
    return inner( // [!code ++]
      ws, // [!code ++]
      many(recover(choice(this.Statement, Unknown), syncPast(Semi), errorNode)), // [!code ++]
      eof(), // [!code ++]
    ) // [!code ++]
  },

  // ...
})
```

```ts
run(Lang.Program).with(`
let a = 1;
xyz;
let b = 2;
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 28,
  pos: 28,
  value: [
    { kind: 'let', name: 'a', value: 1 },
    { kind: 'error', span: { start: 12, end: 17 } }, // [!code highlight]
    { kind: 'let', name: 'b', value: 2 }
  ],
  errors: [
    {
      isOk: false,
      start: 12,
      end: 12,
      pos: 12,
      expected: 'statement',
      label: 'unknown',
      errors: []
    }
  ]
}
```

Note that the catch-all goes in `Program` rather than `Body`. `Body` has to be able to stop at a block's `}`, and a rule committing to anything it doesn't recognise would consume that brace instead, so a well-formed `{ let x = 1; }` would come back as one error node.

## Falling back to another parse

`recover` answers a committed failure with an error node. Sometimes the right answer is a different parse instead.

Commitment is a property of the rule, so every use of `Statement` inherits it, including uses that only want to try it speculatively. Say a lenient mode should keep unrecognised lines as raw text:

```ts
type Node =
  | { kind: 'let'; name: string; value: string | number }
  | { kind: 'print'; args: Array<string | number> }
  | { kind: 'block'; body: Array<Node> }
  | { kind: 'error'; span: Span }
  | { kind: 'raw'; text: string } // [!code ++]

const Lang = grammar({
  Program(): Parser<Array<Node>> {
    return inner(ws, this.Body, eof()) // [!code --]
    return inner(ws, many(choice(this.Statement, this.Raw)), eof()) // [!code ++]
  },

  Raw(): Parser<Node> { // [!code ++]
    return map( // [!code ++]
      first(regexp(/[^;]*/, 'text'), Semi), // [!code ++]
      (text) => ({ kind: 'raw', text }), // [!code ++]
    ) // [!code ++]
  }, // [!code ++]

  // ...
})
```

That doesn't work, though. The committed failure ends the [choice] before `Raw` is ever reached:

```ts
run(Lang.Program).with(`
let width = 320;
let = 240;
print(width, 2);
`)
```

```ts
{
  isOk: false, // [!code highlight]
  start: 22,
  end: 22,
  pos: 22,
  expected: 'letters',
  label: 'let',
  errors: []
}
```

[backtrack] turns the failure back into an ordinary one for that one call site, leaving `Statement` committed everywhere else. `choice` backtracks again and `Raw` gets its turn:

```ts
const Lang = grammar({
  Program(): Parser<Array<Node>> {
    return inner(ws, many(choice(this.Statement, this.Raw)), eof()) // [!code --]
    return inner(ws, many(choice(backtrack(this.Statement), this.Raw)), eof()) // [!code ++]
  },

  // ...
})
```

```ts
run(Lang.Program).with(`
let width = 320;
let = 240;
print(width, 2);
`)
```

```ts
{
  isOk: true,
  start: 0,
  end: 46,
  pos: 46,
  value: [
    { kind: 'let', name: 'width', value: 320 },
    { kind: 'raw', text: 'let = 240' }, // [!code highlight]
    { kind: 'print', args: [ 'width', 2 ] }
  ],
  errors: [] // [!code highlight]
}
```

Note the empty `errors`. `backtrack` forgets the failure, it doesn't report it, and it neither consumes the region nor stands in for it. Reach for it when a committed rule has to be speculative somewhere, and for `recover` when the malformed region has to end up in the diagnostics.

## Reading the result

Every result carries `errors`, and a successful result with a non-empty `errors` is a partial parse: the value is usable, and each entry describes a syntax error. [run] tolerates recovered failures; [tryRun] throws on them.

Recoveries made inside a region that is then rejected go with it. Whatever a [choice] alternative, an [optional] or a speculative [lookahead] recovered along the way is dropped, so `errors` only ever describes input that made it into the result. A run that fails outright is the exception: `errors` still holds what was recovered before the parser gave up, including regions the failure rewound past.

## Placing commits

There is no single right answer, but two rules of thumb work well for most grammars.

1. Commit after a token that makes the construct unambiguous. A keyword, an opening bracket or an operator usually means the parser is no longer choosing between alternatives.

2. Put recovery points where the language has a natural boundary. Statement lists resynchronise on the terminator, argument lists on the closing bracket, block structures on balanced delimiters. Recovering at a level with no such boundary tends to produce noise.

Sigma doesn't deduplicate or suppress diagnostics, so every recovery you allow ends up in `errors`. A recovery point per statement gives one error per broken statement, one per token gives far more. If the output looks like a cascade, the fix is usually a coarser recovery point rather than a filter after the fact.

<!-- Links. -->

[choice]: ../combinators/choice
[commit]: ../combinators/commit
[eof]: ../parsers/eof
[grammar]: ../core/grammar
[lookahead]: ../combinators/lookahead
[many]: ../combinators/many
[nothing]: ../parsers/nothing
[optional]: ../combinators/optional
[recover]: ../combinators/recover
[run]: ../core/run
[sequence]: ../combinators/sequence
[syncNested]: ../combinators/syncNested
[syncPast]: ../combinators/syncPast
[syncTo]: ../combinators/syncTo
[tryRun]: ../core/tryRun
[backtrack]: ../combinators/backtrack
