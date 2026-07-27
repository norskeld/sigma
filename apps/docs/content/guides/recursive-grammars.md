---
title: 'Recursive grammars'
description: 'How to write rules that refer to each other in Sigma, with defer and grammar, and what each one costs.'
order: 2
---

# Recursive grammars

Most formats nest. A JSON array holds values, and one of those values may be another array. A block holds statements, and one of those statements may be another block. Written out, the rules refer to each other in a circle, and at least one of them has to be mentioned before it exists.

JavaScript won't let you do that with a plain `const`, so Sigma offers two ways around it: [defer], which hands you a placeholder you fill in later, and [grammar], which defines a whole set of mutually recursive rules in one call. This page writes the same cut-down JSON parser both ways and explains when each one is the right tool.

## Why a plain const doesn't work

The rule to express is that a value is either a word or a parenthesised list of values.

```ts
const Value: Parser<unknown> = choice(
  string('x'),
  inner(string('('), sepBy(Value, string(',')), string(')')),
)
```

```ts
ReferenceError: Cannot access 'Value' before initialization
```

The right-hand side runs before the binding exists. Hoisting or a `let` won't help either: [choice] and [inner] take parser values, and at the moment they're called there is no value to pass. Something has to stand in for `Value` until it's built.

## The shared parts

Both versions below parse the same subset of JSON into the same tree, and share everything that isn't recursive. Whitespace follows the convention from the [first parser] guide: every token consumes what trails it.

```ts
type JsonValue =
  | { kind: 'object'; entries: Array<[string, JsonValue]> }
  | { kind: 'array'; items: Array<JsonValue> }
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'null' }

const ws = optional(whitespace())

function token<T>(parser: Parser<T>): Parser<T> {
  return first(parser, ws)
}

const OpenBrace = token(string('{'))
const CloseBrace = token(string('}'))
const OpenBracket = token(string('['))
const CloseBracket = token(string(']'))
const Colon = token(string(':'))
const Comma = token(string(','))

const Text = token(map(regexp(/"[^"]*"/g, 'string'), (text) => text.slice(1, -1)))
const Number_ = token(choice(float(), integer()))
const True = token(mapTo(string('true'), true))
const False = token(mapTo(string('false'), false))
const Null = token(string('null'))
```

Only the object, the array and the value rule are recursive, and they're the only part that differs between the two approaches.

## defer

`defer<T>()` gives you a parser you can pass around immediately and define afterwards. The type argument has to be written out, because there's nothing yet for TypeScript to infer it from.

```ts
const Value = defer<JsonValue>()
const JsonObject = defer<JsonValue>()
const JsonArray = defer<JsonValue>()
```

The circle closes, because each rule is built out of placeholders that already exist.

```ts
JsonObject.with(
  map(
    inner(OpenBrace, sepBy(sequence(first(Text, Colon), Value), Comma), CloseBrace),
    (entries): JsonValue => ({ kind: 'object', entries }),
  ),
)

JsonArray.with(
  map(
    inner(OpenBracket, sepBy(Value, Comma), CloseBracket),
    (items): JsonValue => ({ kind: 'array', items }),
  ),
)

Value.with(
  choice(
    JsonObject,
    JsonArray,
    map(Text, (value): JsonValue => ({ kind: 'string', value })),
    map(Number_, (value): JsonValue => ({ kind: 'number', value })),
    map(choice(True, False), (value): JsonValue => ({ kind: 'boolean', value })),
    mapTo(Null, { kind: 'null' } as JsonValue),
  ),
)

const Json = inner(ws, Value, eof())
```

```ts
run(Json).with('{ "a": [1, [2, [3]]] }')
```

```ts
{
  isOk: true,
  start: 0,
  end: 22,
  pos: 22,
  value: {
    kind: 'object',
    entries: [
      [
        'a',
        {
          kind: 'array',
          items: [
            { kind: 'number', value: 1 },
            {
              kind: 'array',
              items: [
                { kind: 'number', value: 2 },
                {
                  kind: 'array',
                  items: [ { kind: 'number', value: 3 } ]
                }
              ]
            }
          ]
        }
      ]
    ]
  },
  errors: []
}
```

### Gotchas

- `with` returns `void`, so it isn't chainable and its result is nothing you can pass along. It also isn't a one-shot: calling it twice silently replaces the parser, with no warning. The lookup happens on every parse rather than once at definition time, so a `defer` that has already been composed into something else still picks up the change.

- A `defer` you never define throws rather than failing.

  ```ts
  run(defer<string>()).with('x')
  ```

  ```ts
  Error: Deferred parser was not initialized
  ```

## grammar

The same rules through [grammar] are one object, with each rule reaching its siblings through `this`.

```ts
const Json = grammar({
  Value(): Parser<JsonValue> {
    return choice(this.Object, this.Array, this.String, this.Number, this.Boolean, this.Null)
  },

  Object(): Parser<JsonValue> {
    return map(
      inner(OpenBrace, sepBy(this.Entry, Comma), CloseBrace),
      (entries): JsonValue => ({ kind: 'object', entries }),
    )
  },

  Entry(): Parser<[string, JsonValue]> {
    return sequence(first(Text, Colon), this.Value)
  },

  Array(): Parser<JsonValue> {
    return map(
      inner(OpenBracket, sepBy(this.Value, Comma), CloseBracket),
      (items): JsonValue => ({ kind: 'array', items }),
    )
  },

  String(): Parser<JsonValue> {
    return map(Text, (value): JsonValue => ({ kind: 'string', value }))
  },

  Number(): Parser<JsonValue> {
    return map(Number_, (value): JsonValue => ({ kind: 'number', value }))
  },

  Boolean(): Parser<JsonValue> {
    return map(choice(True, False), (value): JsonValue => ({ kind: 'boolean', value }))
  },

  Null(): Parser<JsonValue> {
    return mapTo(Null, { kind: 'null' } as JsonValue)
  },
})
```

`Value` refers to `Object`, which refers to `Entry`, which refers back to `Value`, and none of that depends on the order the rules are written in. Feed it the same input as before and the result is identical.

The rules that come back are ordinary parsers, so you can destructure them and compose them with anything else:

```ts
const { Value } = Json
const Document = inner(ws, Value, eof())
```

`grammar` also catches more mistakes. With `defer` the declaration and the definition of every rule are separate, and nothing checks that you wrote the second half, so a rule you forgot to define surfaces at runtime. With `grammar` a rule is one thing, and a name that doesn't exist is a type error.


### Gotchas

Nonetheless, `grammar` also has its own gotchas.

- An initialiser has to return a parser whose `parse` doesn't depend on `this`.

  Sigma's own combinators are all fine, because each returns a plain object whose `parse` is a closure over its arguments. The state lives in the closure, and the closure travels with the function. A class instance is not fine. Its `parse` reads `this.something`, and once the method has been copied off the instance, `this` is the grammar's rule object, which holds nothing but `parse`. The state is gone, usually silently.

  If you have a parser that keeps state on the object, use `defer` for it. `defer` delegates through a closure and never detaches anything, so object identity is preserved.

- `this` is typed with TypeScript's `ThisType`, which is only honoured under `noImplicitThis`. That's implied by `strict` and on by default in most setups. Without it every `this.rule` collapses to `Parser<unknown>` and any rule with a concrete return type stops typechecking. The [grammar] reference page has the details.

  Annotate the return type of each rule, as in the example above. It's what makes `this.Value` useful to the rule that reads it, and it keeps a mistake reported in the rule that made it rather than three rules away.

## Choosing between them

Use `grammar` by default when you're writing a language. It keeps the rules together, the recursion is structural rather than something you wire by hand, and a grammar can't be half-finished.

Use `defer` when there's a single recursive rule inside otherwise flat code and a whole grammar object would be ceremony, when the parser you want to recurse through keeps its own state, or when the rules genuinely need to be built across several modules.

Mixing them is also fine. A `defer` can sit inside a grammar rule, and a grammar's rules can be composed into a `defer`-based parser.

## Left recursion

Neither one saves you from a rule that reaches itself before consuming anything:

```
expression = expression '+' term
```

`Expression` calls `Expression` at the same position, forever. This is inherent to recursive descent rather than a Sigma limitation, and it's why left recursion has to be removed from the grammar rather than worked around in the parser. Check out the guide on parsing [expressions] to see examples of dealing with it.

<!-- Links. -->

[choice]: ../combinators/choice
[defer]: ../parsers/defer
[expressions]: ./expressions
[first parser]: ./first-parser
[grammar]: ../core/grammar
[inner]: ../combinators/inner
