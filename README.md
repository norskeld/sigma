# `𝝨` sigma

[![Checks](https://img.shields.io/github/actions/workflow/status/norskeld/sigma/checks.yaml?style=flat-square&colorA=22272d&colorB=22272d)](https://github.com/norskeld/sigma/actions 'Build and test workflows')
[![Coverage](https://img.shields.io/coverallsCoverage/github/norskeld/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://coveralls.io/github/norskeld/sigma 'Test coverage')
[![NPM](https://img.shields.io/npm/v/@nrsk/sigma?style=flat-square&colorA=22272d&colorB=22272d)](https://npm.im/@nrsk/sigma 'This package on NPM')

Monorepo for [`@nrsk/sigma`](packages/sigma), a TypeScript [parser combinator](https://en.wikipedia.org/wiki/Parser_combinator) library for building fast and convenient parsers.

## Structure

| Package | Description | Published |
| --- | --- | --- |
| [`packages/sigma`](packages/sigma) | The `@nrsk/sigma` library. | Yes |
| [`apps/docs`](apps/docs) | Documentation site ([VitePress](https://vitepress.dev)). | No |
| [`packages/benchmarks`](packages/benchmarks) | Performance benchmarks vs. similar libraries. | No |

## Development

Requires [pnpm](https://pnpm.io). Fork, clone, then:

```sh
pnpm install
```

| Command | Description |
| --- | --- |
| `pnpm build` | Build `@nrsk/sigma` with [tsdown](https://tsdown.dev). |
| `pnpm test` / `pnpm test:types` | Run unit and type tests. |
| `pnpm test:coverage` | Run tests with coverage. |
| `pnpm check` / `pnpm check:fix` | Lint and format with [Biome](https://biomejs.dev). |
| `pnpm docs:dev` / `pnpm docs:build` | Develop or build the docs site. |
| `pnpm bench` | Build the library and run benchmarks. |
| `pnpm changeset` | Record a changeset for a user-facing change. |

Git hooks are managed by [lefthook](https://lefthook.dev) and run Biome on staged files before each commit.

## Contributing

Pull request titles must follow the [Conventional Commits](https://conventionalcommits.org/en/v1.0.0/#summary) format (enforced in CI). Versioning and publishing are handled by [Changesets](https://github.com/changesets/changesets): add a changeset with `pnpm changeset` for any change that should trigger a release.

## License

[MIT](LICENSE).
