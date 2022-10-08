import { defineConfig, type Options } from 'tsup'

const entry = ['src/index.ts', 'src/parsers.ts', 'src/combinators.ts']

const sharedConfig = defineConfig({
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  minify: false,
  bundle: true
})

const mainConfig = defineConfig({
  ...sharedConfig,
  entry,
  dts: false
}) as Options

const createDTSConfig = (e: string): Options =>
  defineConfig({
    ...sharedConfig,
    entry,
    dts: {
      entry: e,
      only: true
    }
  }) as Options

export default defineConfig([mainConfig, ...entry.map(createDTSConfig)])
