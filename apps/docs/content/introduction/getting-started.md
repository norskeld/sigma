---
title: 'Getting started'
description: 'Learn how to install and get started with Sigma.'
---

# Getting started

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

// CommonJS
const { ... } = require('@nrsk/sigma')
```

### Deno & Browsers

You can import the library via [Skypack] (note that `?dts` query parameter, that will pull types as well):

```ts
import { ... } from 'https://cdn.skypack.dev/@nrsk/sigma?dts'
```

Alternatively, you can use any other delivery network/service, e.g. [esm.run].

<!-- Links. -->

[skypack]: https://skypack.dev
[esm.run]: https://esm.run
