---
title: 'nothing'
kind: 'primitive'
description: 'nothing simply resolves to null.'
---

# {{ $frontmatter.title }} <Primitive />

## Signature

```ts
function nothing(): Parser<null>
```

## Description

`nothing` simply resolves to `null`. It's used in [optional]'s implementation, but can be easily used in other combinators, e.g. [choice].

<!-- Combinators. -->

[optional]: ../combinators/optional
[choice]: ../combinators/choice
