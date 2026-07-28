---
title: 'Utility types'
description: 'Utility types that extract the inner types of parsers, used by the variadic combinators to type their results.'
order: 5
---

# Utility types

These types extract the inner `T` out of `Parser<T>`. The variadic combinators use them to type their results, and they're exported so your own helpers can do the same.

## ToTuple

Given a tuple of parsers, extracts their inner types into a tuple.

```ts
type U = [Parser<string>, Parser<number>, Parser<boolean>]
type R = ToTuple<U> // [string, number, boolean]
```

## ToTupleOrArray

The same, except an array of parsers stays an array. This is what [sequence] resolves to.

```ts
type T = ToTupleOrArray<Array<Parser<string>>> // string[]
```

## ToFirst, ToLast and ToInner

Extract the inner type of the first parser, the last one, or everything between them. These are the types behind [first], [last], [inner] and [outer].

```ts
type U = [Parser<string>, Parser<number>, Parser<boolean>, Parser<string>]

type F = ToFirst<U> // string
type L = ToLast<U>  // string
type I = ToInner<U> // [number, boolean]
```

## ToUnion

Folds a tuple or an array of parsers into a union of their inner types. This is what [choice] resolves to.

```ts
type U = [Parser<string>, Parser<number>, Parser<boolean>]
type R = ToUnion<U> // string | number | boolean
```

## UnwrapUnion and ToParser

`UnwrapUnion` turns a union of parsers into a tuple of their inner types, and `ToParser` folds that union into a single parser.

```ts
type U = Parser<string> | Parser<number> | Parser<boolean>

type R = UnwrapUnion<U> // [string, number, boolean]
type P = ToParser<U>    // Parser<string | number | boolean>
```

::: warning
`UnionToIntersection`, `UnionToTuplePreserving`, `UnwrapParserTuple` and `TupleToUnion` are exported too, but only as building blocks for the types above. Don't rely on them directly.
:::

<!-- Combinators. -->

[choice]: ../combinators/choice
[first]: ../combinators/first
[inner]: ../combinators/inner
[last]: ../combinators/last
[outer]: ../combinators/outer
[sequence]: ../combinators/sequence
