---
title: Primitives and composites
description: What is the difference?
---

# {{ $frontmatter.title }}

There are two types of parser and combinators: primitive and composite ones. Technically, you do not need to know any of that to use the library, but if you ever want or need to write a custom parser or combinator, knowing the difference may help to avoid some performance issues.

## Primitives

::: info
Marked in docs with this badge: <Primitive />
:::

These parsers and combinators are usually the very basic building blocks and written in plain and mostly imperative TypeScript *without using other parsers/combinators* to reduce performance overheads. After all, function calls have a price!

Examples: [choice], [many], [sequence], [string], [oneOf], [regexp], and others.

## Composites

::: info
Marked in docs with this badge: <Composite />
:::

These parsers and combinators *are built using other parsers/combinators*. Some of them, of course, could be rewritten to be primitive, but sometimes it is too impractical or does not bring significant enough performance gains, and one of the goals is to keep the footprint of the library as small as possible.

Examples: [chainl], [sepBy], [float], [letters], and others.

<!-- Links. -->

[choice]: ../combinators/choice
[many]: ../combinators/many
[sequence]: ../combinators/sequence
[string]: ../parsers/string
[oneOf]: ../parsers/oneOf
[regexp]: ../parsers/regexp
[chainl]: ../combinators/chainl
[sepBy]: ../combinators/sepBy
[float]: ../parsers/float
[letters]: ../parsers/letters
