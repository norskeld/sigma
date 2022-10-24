---
title: 'chainl'
description: 'chainl combinator parses zero or more occurrences of parser, separated by op. Returns a value obtained by a recursive left-associative application of a function to the values returned by op and parser.'
---

# {{ $frontmatter.title }}

## Signature

```ts
type Fn<L, R> = (left: L, right: R) => L

function chainl<T, L extends T, R>(
  parser: Parser<L>,
  op: Parser<R>,
  fn: Fn<T, R>
): Parser<T>
```

## Description

`chainl` combinator parses _zero_ or more occurrences of `parser`, separated by `op` (in [EBNF] notation: `parser (op parser)*`). Returns a value obtained by a recursive left-associative application of `fn` to the values returned by `op` and `parser`. This combinator is particularly useful for eliminating left recursion, which typically occurs in expression grammars.

## Examples

### Simple calculator

::: info Combinators and parsers used in this section
- Combinators: [chainl], [choice], [sequence]
- Parsers: [integer], [string]
:::

The code below showcases an implementation of a simple calculator that supports addition and subtraction. [Read on](#eliminating-left-recursion) to see how to make it more useful by adding new operators, grouping, and operator precedence.

```ts
function mapBinary(left: number, [op, right]: [string, number]) {
  switch (op) {
    case '+': return left + right
    case '-': return left - right
    default: throw `Unknown operator '${op}'.`
  }
}

const Parser = chainl(
  integer(),
  sequence(
    choice(
      string('+'),
      string('-')
    ),
    integer()
  ),
  mapBinary
)
```

When you run `Parser` and feed it with input:

```ts
run(Parser).with('10+10-5+15')
```

You will get the following result:

::: tip Success
```ts{4}
{
  isOk: true,
  pos: 10,
  value: 30
}
```
:::

So what happens here? Let's unpack, step-by-step.

- **Consume** `10 ['+', 10]`, eagerly **evaluate** by applying `mapBinary`, **yield** `20`.
- **Consume** `20 ['-', 5]`, eagerly **evaluate** by applying `mapBinary`, **yield** `15`.
- **Consume** `15 ['+', 15]`, eagerly **evaluate** by applying `mapBinary`, and finally **yield** `30`.

As you can see, it directly maps to the [EBNF] notation given above: `parser (op parser)*`.

### Eliminating left recursion

::: info Combinators and parsers used in this section
- Combinators: [chainl], [choice], [map], [sequence], [takeMid], [takeRight]
- Parsers: [defer], [integer], [string]
:::

This example builds upon what we had earlier, but this time we will add notion of grouping (with parentheses), a couple of new operators (like multiplication (`*`) and division (`/`)), and operator precedence.

Before we see the actual code, let's first come up with some formal representation, a _grammar_ (I'll use the slightly simplified [EBNF]):

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

#### Problem

If you look at the highlighted lines, you will notice that `factor` and `expression` reference themselves on the left-hand side of the whole production rule, creating _left recursion_.

Why is this a problem? Well, this is a problem for _some_ parsers, namely **recursive descent parsers**. Recursive descent parsers will go into an infinite loop if the non-terminal keeps on expanding into itself, as it happens with `factor` and `expression` in our grammar. Parser combinators belong to this class of parsers, so you have to take ambiguity, which left recursion brings, into account.

::: info Note
You may have noticed already, that the `term` production rule refers to itself like the `factor` and `expression` production rules do, but it happens on the right-hand side, so it's fine (at least for our grammar), and we don't need to do anything special to deal with it.
:::

#### Solution

One way to avoid ambiguity is to transform the grammar into an equivalent one that has no left recursion. The other is to use specialized combinators like `chainl`.

To implement our grammar, we first need some means to represent mutual recursion. We can use the [defer] parser, that is designed exactly for that.

```ts
const Term = defer<number>()
const Factor = defer<number>()
const Expression = defer<number>()
```

Now we are ready to define parsers for the production rules. Let's start with the parser for the `term` production rule.

```ts
Term.with(
  choice(
    integer(),
    takeRight(choice(string('+'), string('-')), Term),
    takeMid(string('('), Expression, string(')'))
  )
)
```

That was easy, wasn't it? If you look closely, you will see that the parser definition directly maps to the grammar. This is almost true for `factor` and `expression`, except we don't encode these non-terminals in ambiguous fashion.

```ts
Factor.with(
  chainl(
    Term,
    sequence(choice(string('*'), string('/')), Term),
    mapBinary
  )
)

Expression.with(
  chainl(
    Factor,
    sequence(choice(string('+'), string('-')), Factor),
    mapBinary
  )
)
```

As you can see, we have added the multiplication and division operators, so we need to change the `mapBinary` function from the previous example a little bit.

```ts{5-6}
function mapBinary(left: number, [op, right]: [string, number]) {
  switch (op) {
    case '+': return left + right
    case '-': return left - right
    case '*': return left * right
    case '/': return left / right
    default: throw `Unknown operator '${op}'.`
  }
}
```

And this is it. Now, when we run our parser and feed it with input:

```ts
run(Expression).with('10+10+(2*30)')
```

We will get the following result:

::: tip Success
```ts
{
  isOk: true,
  pos: 12,
  value: 80
}
```
:::

::: details Complete example
```ts
import { chainl, choice, sequence, takeMid, takeRight } from '@nrsk/sigma/combinators'
import { defer, integer, string, run } from '@nrsk/sigma/parsers'

function mapBinary(left: number, [op, right]: [string, number]) {
  switch (op) {
    case '+': return left + right
    case '-': return left - right
    case '*': return left * right
    case '/': return left / right
    default: throw `Unknown operator '${op}'.`
  }
}

const Term = defer<number>()
const Factor = defer<number>()
const Expression = defer<number>()

Term.with(
  choice(
    integer(),
    takeRight(choice(string('+'), string('-')), Term),
    takeMid(string('('), Expression, string(')'))
  )
)

Factor.with(
  chainl(
    Term,
    sequence(choice(string('*'), string('/')), Term),
    mapBinary
  )
)

Expression.with(
  chainl(
    Factor,
    sequence(choice(string('+'), string('-')), Factor),
    mapBinary
  )
)

console.log(
  run(Expression).with('10+10+(2*30)')
)
```
:::

<!-- Links. -->

[ebnf]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form 'Extended Backus–Naur form'

<!-- Combinators. -->

[chainl]: ./chainl
[choice]: ./choice
[map]: ./map
[sequence]: ./sequence
[takemid]: ./takeMid
[takeright]: ./takeRight

<!-- Parsers. -->

[defer]: ../parsers/defer
[integer]: ../parsers/integer
[string]: ../parsers/string
