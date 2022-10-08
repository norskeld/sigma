import isCI from 'is-ci'
import { defineConfig, type Options } from 'tsup'

const entries = ['src/index.ts', 'src/parsers.ts', 'src/combinators.ts']

const sharedConfig = defineConfig({
  splitting: false,
  sourcemap: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  minify: isCI,
  bundle: true
})

const mainConfig = defineConfig({
  ...sharedConfig,
  entry: entries,
  dts: false
}) as Options

function createDTSConfig(entry: string): Options {
  return defineConfig({
    ...sharedConfig,
    entry: [entry],
    dts: {
      entry,
      only: true
    }
  }) as Options
}

export default defineConfig([mainConfig, ...entries.map(createDTSConfig)])
