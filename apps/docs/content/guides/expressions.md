---
title: 'Expressions and precedence'
description: 'How to parse arithmetic in Sigma: removing left recursion, layering precedence, and building a tree with spans.'
order: 3
---

# Expressions and precedence

Arithmetic is the first thing you can't parse by writing the grammar down and translating it rule by rule. The obvious grammar for it is left recursive, and a recursive descent parser handed a left recursive rule loops until the stack runs out.

Sigma's answer is [chainl] and [chainr], which parse a flat run of operands and operators and fold it into whatever shape you want. This page starts from the grammar that doesn't work, gets to a calculator, and then turns the calculator into something that produces a tree with source positions on it.

## The grammar

Slightly simplified [EBNF], with the problem on the highlighted lines:

```haskell{8,12}
term
  = number
  = ('+' | '-') term
  = '(' expression ')'

factor
  = term
  = factor ('*' | '/') term

expression
  = factor
  = expression ('+' | '-') factor
```

`factor` and `expression` both mention themselves as the first thing on the right-hand side. That's left recursion, and it's how you say "an expression is an expression plus something". It's a perfectly good description of the language and a fatal one for this kind of parser.

`term` also refers to itself, on the third line, but only after consuming a `(` first. Recursion that happens after something has been consumed is fine and needs nothing special. Only recursion at the same position fails to terminate.

## Why left recursion loops

To parse `expression`, the parser tries the first alternative that could match, which is `expression`. To parse that, it tries `expression`. Nothing has been consumed, no state has changed, and the third call is identical to the first. Parser combinators are recursive descent, so this is a plain infinite recursion.

You can't fix it by reordering the alternatives, and no amount of backtracking helps, because the parser never gets far enough to backtrack from. The grammar has to change. Either rewrite it into an equivalent one without left recursion, or use a combinator built for the job.

## The tokens

Everything below shares these, with whitespace handled by the convention from the [first parser] guide: every token consumes what trails it.

```ts
const ws = optional(whitespace())

function token<T>(parser: Parser<T>): Parser<T> {
  return first(parser, ws)
}

const Open = token(string('('))
const Close = token(string(')'))
const Caret = token(string('^'))
const Minus = token(string('-'))

const Additive = token(choice(string('+'), string('-')))
const Multiplicative = token(choice(string('*'), string('/')))
```

## chainl

`chainl(parser, op, fn)` parses `parser (op parser)*`, one operand followed by as many operator-operand pairs as it can find, and reduces the run left-associatively with `fn`. The `op` parser matches only the operator. `fn` receives the values on both sides of it, as `(left, op, right)`.

```ts
function evalBinary(left: number, op: string, right: number): number {
  switch (op) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      return left / right
    default:
      throw new Error(`Unknown operator '${op}'.`)
  }
}
```

Fold `+` and `-` over integers and you have a calculator:

```ts
const Additive = token(choice(string('+'), string('-')))
const Parser = chainl(token(integer()), Additive, evalBinary)
```

```ts
run(Parser).with('10 + 10 - 5 + 15')
```

```ts
{
  isOk: true,
  start: 0,
  end: 16,
  pos: 16,
  value: 30,
  errors: []
}
```

Step by step, `chainl` consumes `10 + 10` and applies `evalBinary` to yield `20`, consumes `- 5` and applies it to the accumulated `20` to yield `15`, then consumes `+ 15` and yields `30`. The fold is eager: each pair is reduced as soon as it's read.

## Precedence as layers

One `chainl` gives one precedence level. More levels mean more rules, each one folding over the level below it, tightest-binding first. Parentheses come back to the top. That's mutually recursive, so it goes through [grammar]:

```ts
const Calculator = grammar({
  Expression(): Parser<number> {
    return chainl(this.Product, Additive, evalBinary)
  },

  Product(): Parser<number> {
    return chainl(this.Primary, Multiplicative, evalBinary)
  },

  Primary(): Parser<number> {
    return choice(token(integer()), inner(Open, this.Expression, Close))
  },
})
```

```ts
run(Calculator.Expression).with('10 + 10 + (2 * 30)')
```

```ts
{
  isOk: true,
  start: 0,
  end: 18,
  pos: 18,
  value: 80,
  errors: []
}
```

Compare that against the grammar at the top. `Product` is `factor`, `Expression` is `expression`, and the left recursion has become a `chainl` in each. The nesting order is the precedence: `Expression` folds over whatever `Product` returns, so `*` binds tighter than `+` because it was consumed at a lower level.

## Right associativity

`chainl` folds left, so `10 - 3 - 2` is `(10 - 3) - 2`. Exponentiation goes the other way: `2 ^ 3 ^ 2` should be `2 ^ (3 ^ 2)`, which is 512, not `(2 ^ 3) ^ 2`, which is 64. [chainr] is the same combinator folding the other direction.

The two differ in more than direction. `chainl` calls `fn` once per iteration as it goes. `chainr` can't, because the rightmost pair has to be reduced first, so it collects the whole run and folds it afterwards. For a pure function you'd never notice, but it matters if `fn` does anything observable.

## Building a tree instead of a number

Evaluating during the parse is fine for a calculator and no use for anything else. To get a tree, have `fn` build a node rather than a value.

```ts
type Expr =
  | { kind: 'number'; value: number; span: Span }
  | { kind: 'unary'; op: string; operand: Expr; span: Span }
  | { kind: 'binary'; op: string; left: Expr; right: Expr; span: Span }
```

[map]'s callback receives a `Span` as its second argument. `chainl` and `chainr` give you nothing of the sort: their `fn` is `(left, op, right) => T` and that's all. A chain has no single region to hand over, because it folds a run of things and each fold covers a different slice of it.

So spans have to come from the operands. Every node carries one, and a binary node derives its own from the two it joins:

```ts
function binary(left: Expr, op: string, right: Expr): Expr {
  return {
    kind: 'binary',
    op,
    left,
    right,
    span: { start: left.span.start, end: right.span.end },
  }
}
```

The only place a span is created from scratch is the leaf, where `map` supplies one:

```ts
map(token(integer()), (value, span): Expr => ({ kind: 'number', value, span }))
```

## Unary operators

A prefix operator is a rule that either consumes the operator and recurses, or falls through to the level below. It goes in the layer stack like any other precedence level, here between `Power` and `Product`, so `-2 ^ 2` parses as `-(2 ^ 2)`.

```ts
const Lang = grammar({
  Sum(): Parser<Expr> {
    return chainl(this.Product, Additive, binary)
  },

  Product(): Parser<Expr> {
    return chainl(this.Unary, Multiplicative, binary)
  },

  Unary(): Parser<Expr> {
    return choice(
      map(
        sequence(Minus, this.Unary),
        ([op, operand], span): Expr => ({ kind: 'unary', op, operand, span }),
      ),
      this.Power,
    )
  },

  Power(): Parser<Expr> {
    return chainr(this.Primary, Caret, binary)
  },

  Primary(): Parser<Expr> {
    return choice(
      map(token(integer()), (value, span): Expr => ({ kind: 'number', value, span })),
      inner(Open, this.Sum, Close),
    )
  },
})
```

`Unary` is the one rule that gets its span from `map` rather than composing it, because the `-` isn't part of any operand.

```ts
run(Lang.Sum).with('1 + 2 * 3')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: {
    kind: 'binary',
    op: '+',
    left: { kind: 'number', value: 1, span: { start: 0, end: 2 } },
    right: {
      kind: 'binary',
      op: '*',
      left: { kind: 'number', value: 2, span: { start: 4, end: 6 } },
      right: { kind: 'number', value: 3, span: { start: 8, end: 9 } },
      span: { start: 4, end: 9 } // [!code highlight]
    },
    span: { start: 0, end: 9 } // [!code highlight]
  },
  errors: []
}
```

The `*` node spans `2 * 3` and the `+` node spans all of it, both assembled from leaf spans without counting a single offset by hand.

Right associativity shows up in the shape rather than the numbers:

```ts
run(Lang.Sum).with('2 ^ 3 ^ 2')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: {
    kind: 'binary',
    op: '^',
    left: { kind: 'number', value: 2, span: { start: 0, end: 2 } },
    right: { // [!code highlight]
      kind: 'binary',
      op: '^',
      left: { kind: 'number', value: 3, span: { start: 4, end: 6 } },
      right: { kind: 'number', value: 2, span: { start: 8, end: 9 } },
      span: { start: 4, end: 9 }
    },
    span: { start: 0, end: 9 }
  },
  errors: []
}
```

The nested node is on the `right`. Under `chainl` it would be on the `left`.

## A chain of one

`chainl` requires one operand and any number of pairs, including none. With none, `fn` is never called at all and the operand comes back untouched:

```ts
run(Lang.Sum).with('42')
```

```ts
{
  isOk: true,
  start: 0,
  end: 2,
  pos: 2,
  value: { kind: 'number', value: 42, span: { start: 0, end: 2 } },
  errors: []
}
```

No binary node, because there was nothing to combine. This is why the signature is `chainl<T, L extends T, R>`: the operand type has to be assignable to the result type, since a one-operand chain returns an operand as its result. If your `fn` produces a type the operands can't inhabit, that constraint is what will complain.

## When the chain stops

A chain ends when it can't find another complete pair. The case to watch is a pair that starts but doesn't finish, an operator that matches with nothing valid after it.

```ts
run(Lang.Sum).with('1 + 2 +')
```

```ts
{
  isOk: true,
  start: 0,
  end: 6,
  pos: 6,
  value: {
    kind: 'binary',
    op: '+',
    left: { kind: 'number', value: 1, span: { start: 0, end: 2 } },
    right: { kind: 'number', value: 2, span: { start: 4, end: 6 } },
    span: { start: 0, end: 6 }
  },
  errors: []
}
```

It succeeded. The trailing `+` matched, the operand after it didn't, so the chain backtracked over the operator, kept `1 + 2`, and stopped at position 6 with the `+` left unconsumed for whatever comes next. That's the right behaviour in general, since an operator character may well belong to an enclosing rule, but it does mean a chain on its own won't tell you about a dangling operator. Anchor the parser with [eof] and the leftovers become a real failure:

```ts
run(inner(ws, Lang.Sum, eof())).with('1 + 2 +')
```

```ts
{
  isOk: false,
  start: 6,
  end: 6,
  pos: 6,
  expected: 'end of input',
  label: null,
  errors: []
}
```

## Committed failures in a chain

[commit] changes what a half-finished pair means. Commit the operator and it stops being a reason to backtrack and becomes a syntax error.

```ts
const CommittedOp = chainl(token(integer()), commit(Additive, 'operator'), evalBinary)
```

The dangling case is unchanged, because there the operator matched and only the operand ran out:

```ts
run(CommittedOp).with('1 + 2 +')
```

```ts
{ isOk: true, start: 0, end: 6, pos: 6, value: 3, errors: [] }
```

But feed it something the operator itself rejects and the commit fires:

```ts
run(CommittedOp).with('1 + 2 @')
```

```ts
{
  isOk: false,
  start: 6,
  end: 7,
  pos: 6,
  expected: '+',
  label: 'operator', // [!code highlight]
  errors: []
}
```

The whole chain fails, including the `1 + 2` it had already folded. The failure keeps its label and is reported at the position the commit fired, while the cursor is rewound all the way to where the chain began. An enclosing [choice] or [recover] therefore resumes from the start of the expression rather than the middle of one. The same holds for a commit inside an operand.

Commit an operator only where the language really does rule out every other reading. It's a good fit for a trailing binary operator in a statement-oriented language, and a bad one for a character that also means something to an enclosing rule.

## What to read next

The [error recovery] guide picks up where the last section left off: turning a committed failure into a diagnostic and carrying on, so a file with three bad expressions reports three errors instead of one. The [chainl] and [chainr] reference pages carry the signatures and the smaller examples.

<!-- Links. -->

[chainl]: ../combinators/chainl
[chainr]: ../combinators/chainr
[choice]: ../combinators/choice
[commit]: ../combinators/commit
[ebnf]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form 'Extended Backus–Naur form'
[eof]: ../parsers/eof
[error recovery]: ./error-recovery
[first parser]: ./first-parser
[grammar]: ../core/grammar
[map]: ../combinators/map
[recover]: ../combinators/recover
