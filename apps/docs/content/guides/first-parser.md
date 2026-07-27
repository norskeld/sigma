---
title: 'First parser'
description: 'Build a small parser from scratch with Sigma.'
order: 1
---

# First parser

Sigma gives you a set of very small parsers and the functions to combine them. There is no separate grammar file and no code generation step. A parser is an ordinary value, and you build a bigger one by passing smaller ones to a function.

This page builds one up from a single literal to a parser for a small settings format, and explains what comes back at each step.

```
name = sigma
retries = 3
verbose = true
tags = [core, docs, bench]
```

## Running a parser

The smallest useful parser matches a literal. [string] builds one, and [run] feeds it some input.

```ts
const Parser = string('hello')
```

```ts
run(Parser).with('hello')
```

```ts
{
  isOk: true,
  start: 0,
  end: 5,
  pos: 5,
  value: 'hello',
  errors: []
}
```

`isOk` tells you which shape you're holding, and it narrows the type: inside an `if (result.isOk)` branch TypeScript knows `value` exists. `start` and `end` are offsets into the input describing the region the parser consumed. `pos` is where the cursor ended up. `errors` collects failures the parser recovered from, which the [error recovery] guide covers.

Nothing requires a parser to reach the end of the input. Given more to work with, it still stops after what it matched.

```ts
run(Parser).with('hello there')
```

```ts
{
  isOk: true,
  start: 0,
  end: 5,
  pos: 5,
  value: 'hello',
  errors: []
}
```

So a parser can report success on a file it only understood the first line of.

## When a parser fails

```ts
run(Parser).with('help')
```

```ts
{
  isOk: false,
  start: 0,
  end: 4,
  pos: 0,
  expected: 'hello',
  label: null,
  errors: []
}
```

`expected` is a short description of what would have matched, the kind of thing you'd put after "expected" in a message to a user. `label` stays `null` until something [commits][commit] to a parse, which the error recovery guide covers.

The three offsets do different jobs on a failure, and the difference matters once you start rendering diagnostics. `start` and `end` cover the region the parser attempted to match, clamped to the input, so here they span all four characters of `help`. `pos` is where the failure gets reported, rewound to the position the parser started from. A parser that fails leaves the cursor exactly where it found it, which is what makes backtracking work.

## Putting parsers in a row

[sequence] applies parsers one after another and collects the results into a tuple, typed per position.

```ts
const Setting = sequence(letters(), string('='), integer())
```

```ts
run(Setting).with('retries=3')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: [ 'retries', '=', 3 ],
  errors: []
}
```

[integer] gives back a `number` rather than the digits it matched, so the tuple's type is `[string, string, number]`.

The `'='` in the middle carries no information. Rather than destructure it away later, use a selector combinator to drop it up front. [outer] runs three parsers and keeps the outer two.

```ts
const Setting = sequence(letters(), string('='), integer()) // [!code --]
const Setting = outer(letters(), string('='), integer()) // [!code ++]
```

```ts
run(Setting).with('retries=3')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: [ 'retries', 3 ],
  errors: []
}
```

[inner] keeps the middle one and discards the delimiters around it, which is what you want for brackets. [first] and [last] do the same job for pairs.

## Shaping the result

Tuples get unreadable quickly. [map] applies a function to whatever a parser produced, and it hands that function a `Span` as a second argument, so a node can record where it came from.

```ts
const Setting = map(
  outer(letters(), string('='), integer()),
  ([name, value], span) => ({ name, value, span }),
)
```

```ts
run(Setting).with('retries=3')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: { name: 'retries', value: 3, span: { start: 0, end: 9 } },
  errors: []
}
```

`map` is where a span enters the tree. Attaching one as you build each node costs nothing, and it's what lets an error message point at a line.

## Choosing between alternatives

A setting's value isn't always a number. [choice] takes several parsers and returns the result of the first one that matches, with the result type being the union of theirs.

```ts
const Flag = map(choice(string('true'), string('false')), (text) => ({
  kind: 'flag' as const,
  value: text === 'true',
}))

const Num = map(integer(), (value) => ({ kind: 'number' as const, value }))
const Text = map(letters(), (value) => ({ kind: 'text' as const, value }))

const Value = choice(Flag, Num, Text)
```

`choice` is ordered. It doesn't look for the longest match or the best one, it takes the earliest alternative that succeeds and never reconsiders. Put `Text` first and `true` stops being a flag, because [letters] matches the whole word.

```ts
run(choice(Text, Flag, Num)).with('true')
```

```ts
{
  isOk: true,
  start: 0,
  end: 4,
  pos: 4,
  value: { kind: 'text', value: 'true' },
  errors: []
}
```

```ts
run(choice(Flag, Num, Text)).with('true')
```

```ts
{
  isOk: true,
  start: 0,
  end: 4,
  pos: 4,
  value: { kind: 'flag', value: true },
  errors: []
}
```

Neither run failed, which is what makes this kind of bug hard to track down. When two alternatives can match the same input, put the specific one first.

`Setting` can now take any of the three.

```ts
const Setting = map(
  outer(letters(), string('='), integer()), // [!code --]
  outer(letters(), string('='), Value), // [!code ++]
  ([name, value], span) => ({ name, value, span }),
)
```

## Whitespace

So far the grammar only accepts `retries=3` with no spaces. Sigma has no separate lexer, so whitespace is yours to handle. The usual approach is to pick a convention and apply it in one place: every token consumes the whitespace that follows it.

```ts
const ws = optional(whitespace())

function token<T>(parser: Parser<T>): Parser<T> {
  return first(parser, ws)
}
```

[whitespace] fails on an empty run, so [optional] wraps it to make the trailing space optional. [first] keeps the left result and discards the whitespace. With `token` in hand, the punctuation is defined once and the rules below never mention spacing again.

```ts
const Word = token(letters())
const Equals = token(string('='))
const Comma = token(string(','))
const Open = token(string('['))
const Close = string(']')
```

```ts
const Setting = map(
  outer(letters(), string('='), Value), // [!code --]
  outer(Word, Equals, Value), // [!code ++]
  ([name, value], span) => ({ name, value, span }),
)
```

```ts
run(Setting).with('retries = 3')
```

```ts
{
  isOk: true,
  start: 0,
  end: 11,
  pos: 11,
  value: {
    name: 'retries',
    value: { kind: 'number', value: 3 },
    span: { start: 0, end: 11 }
  },
  errors: []
}
```

`Close` is deliberately not a token. Whatever consumes the whitespace at the end of a setting also pulls it inside that setting's span, and a span that runs into the next line highlights badly. Leaving the last parser of a construct bare keeps the span tight and lets the enclosing rule deal with the gap.

## Lists

A bracketed list needs a value repeated with separators between them, which is [sepBy]. It returns an array, discards the separators, and succeeds on an empty run.

```ts
const List = map(inner(Open, sepBy(Word, Comma), Close), (value) => ({
  kind: 'list' as const,
  value,
}))

const Value = choice(List, Flag, Num, Text)
```

```ts
run(Setting).with('tags = [core, docs, bench]')
```

```ts
{
  isOk: true,
  start: 0,
  end: 26,
  pos: 26,
  value: {
    name: 'tags',
    value: { kind: 'list', value: [ 'core', 'docs', 'bench' ] },
    span: { start: 0, end: 26 }
  },
  errors: []
}
```

```ts
run(Setting).with('tags = []')
```

```ts
{
  isOk: true,
  start: 0,
  end: 9,
  pos: 9,
  value: {
    name: 'tags',
    value: { kind: 'list', value: [] },
    span: { start: 0, end: 9 }
  },
  errors: []
}
```

Use [sepBy1] instead when an empty list should be a syntax error rather than an empty array.

## More than one setting

[many] applies a parser until it stops matching and collects the results. Zero matches gives an empty array rather than a failure.

```ts
run(many(token(Setting))).with('name = sigma\nretries = 3\n')
```

```ts
{
  isOk: true,
  start: 0,
  end: 25,
  pos: 25,
  value: [
    {
      name: 'name',
      value: { kind: 'text', value: 'sigma' },
      span: { start: 0, end: 12 }
    },
    {
      name: 'retries',
      value: { kind: 'number', value: 3 },
      span: { start: 13, end: 24 }
    }
  ],
  errors: []
}
```

The `token` around `Setting` is what consumes the newlines between them. Each setting's own span still stops at its last character.

## The whole input

`many` stops at the first thing it can't parse, and that's the behaviour that lets a broken file look fine.

```ts
run(inner(ws, many(token(Setting)), ws)).with('\nname = sigma\n???\n')
```

```ts
{
  isOk: true,
  start: 0,
  end: 14,
  pos: 14,
  value: [
    {
      name: 'name',
      value: { kind: 'text', value: 'sigma' },
      span: { start: 1, end: 13 }
    }
  ],
  errors: []
}
```

`isOk: true`, one setting, and the `???` silently dropped. [eof] fixes this: it matches only at the end of the input, so putting it last forces the parser to account for every character.

```ts
const Settings = inner(ws, many(token(Setting)), ws) // [!code --]
const Settings = inner(ws, many(token(Setting)), eof()) // [!code ++]
```

```ts
run(Settings).with('\nname = sigma\n???\n')
```

```ts
{
  isOk: false,
  start: 14,
  end: 14,
  pos: 14,
  expected: 'end of input',
  label: null,
  errors: []
}
```

Now it's a failure, though not a good one. Position 14 is the start of `???`, and "expected end of input" describes the parser's predicament rather than the user's mistake. That's a fair summary of what the grammar knows. Turning it into a real diagnostic, and getting the rest of the file parsed anyway, is what the [error recovery] guide is about.

## Naming what you expected

Ask for a setting with nothing after the `=`:

```ts
run(Setting).with('retries = ')
```

```ts
{
  isOk: false,
  start: 10,
  end: 10,
  pos: 10,
  expected: '[',
  label: null,
  errors: []
}
```

Every alternative in `Value` failed at position 10, and when alternatives tie like that `choice` reports the first one, so the message names a bracket for a value that was never going to be a list. [error] replaces the expectation with one you chose.

```ts
const Value = choice(List, Flag, Num, Text) // [!code --]
const Value = error(choice(List, Flag, Num, Text), 'value') // [!code ++]
```

```ts
run(Setting).with('retries = ')
```

```ts
{
  isOk: false,
  start: 10,
  end: 10,
  pos: 10,
  expected: 'value', // [!code highlight]
  label: null,
  errors: []
}
```

Do this for anything a user will see. `error` deliberately leaves committed failures alone, so it relabels ordinary expectations without papering over real syntax errors.

## When you'd rather throw

[run] always returns a result and never throws, which suits code that wants to inspect the failure. When a failure is not something the caller can do anything about, [tryRun] returns the `Success` directly and throws a `ParserError` otherwise.

```ts
tryRun(Setting).with('retries = ')
```

```ts
ParserError {
  name: 'ParserError',
  message: 'value',
  span: { start: 10, end: 10 },
  pos: 10,
  label: null,
  errors: []
}
```

The message is the expectation, and the span, position and label are carried on the error. `tryRun` also throws when a parse succeeded but recovered from failures along the way, so a result you get back from it is always clean.

## Where to go next

The settings format is flat on purpose: no value contains another setting, so every rule could be defined before it was used. [Recursive grammars][recursive grammars] guide covers formats that nest, where a rule refers to itself and can't be written as a plain `const`.

[Expressions][expressions] guide covers arithmetic, which needs more than recursion because the obvious grammar for it loops forever.

And [error recovery] guide covers what to do when stopping at the first mistake isn't good enough.

<!-- Links. -->

[choice]: ../combinators/choice
[commit]: ../combinators/commit
[eof]: ../parsers/eof
[error]: ../combinators/error
[error recovery]: ./error-recovery
[expressions]: ./expressions
[first]: ../combinators/first
[inner]: ../combinators/inner
[integer]: ../parsers/integer
[last]: ../combinators/last
[letters]: ../parsers/letters
[many]: ../combinators/many
[map]: ../combinators/map
[optional]: ../combinators/optional
[outer]: ../combinators/outer
[recursive grammars]: ./recursive-grammars
[run]: ../core/run
[sepBy]: ../combinators/sepBy
[sepBy1]: ../combinators/sepBy1
[sequence]: ../combinators/sequence
[string]: ../parsers/string
[tryRun]: ../core/tryRun
[whitespace]: ../parsers/whitespace
