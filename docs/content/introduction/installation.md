---
title: 'Installation'
description: 'Learn how to install and use this library.'
---

Just use your favorite package manager.

```shell {{ withLineNumbers: false }}
npm i @nrsk/sigma
yarn add @nrsk/sigma
pnpm add @nrsk/sigma
```

## Bundles

This library comes both in **CommonJS** and **ESM** flavors. `package.json` has configured `exports` field, so no additional steps required: simply `import` or `require` whatever combinators and parsers you need.

## Structure

There are three self-contained entry points which you may use:

### @nrsk/sigma/combinators

Contains combinators and associated types only.

```typescript {{ withLineNumbers: false }}
import { chainl, choice, ... } from '@nrsk/sigma/combinators'
const { chainl, choice, ... } = require('@nrsk/sigma/combinators')
```

### @nrsk/sigma/parsers

Contains parsers, associated types, and `run` function to run parsers with given input.

```typescript {{ withLineNumbers: false }}
import { defer, string, ... } from '@nrsk/sigma/parsers'
const { defer, string, ... } = require('@nrsk/sigma/parsers')
```

### @nrsk/sigma

Contains public types, state helpers, and re-exports everything from `@nrsk/sigma/combinators` and `@nrsk/sigma/parsers`.
