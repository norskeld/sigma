---
title: Getting started
description: Learn how to install and get started with Sigma.
---

# {{ $frontmatter.title }}

## Installation

Just use your favorite package manager.

```shell
npm i @nrsk/sigma
yarn add @nrsk/sigma
pnpm add @nrsk/sigma
```

## Bundles

### Node

Sigma comes both in **CommonJS** and **ESM** flavors. `package.json` has configured `exports` field, so no additional steps required: simply `import` or `require` whatever combinators you need:

```ts
// ESM
import { ... } from '@nrsk/sigma'
import { ... } from '@nrsk/sigma/parsers'
import { ... } from '@nrsk/sigma/combinators'

// CommonJS
const { ... } = require('@nrsk/sigma')
const { ... } = require('@nrsk/sigma/parsers')
const { ... } = require('@nrsk/sigma/combinators')
```

### Deno & Browsers

You can import the library via [Skypack] (note that `?dts` query parameter, that will pull types as well):

```ts
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma?dts'
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma/parsers?dts'
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma/combinators?dts'
```

Alternatively, you can use any other delivery network/service, e.g. [esm.run].

## Structure

There are three self-contained entry points which you may use:

| Entry point               | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| `@nrsk/sigma`             | Contains public types and re-exports all combinators and parsers. |
| `@nrsk/sigma/parsers`     | Contains only parsers and associated types.                       |
| `@nrsk/sigma/combinators` | Contains only combinators and associated types.                   |

<!-- Links. -->

[skypack]: https://skypack.dev
[esm.run]: https://esm.run
