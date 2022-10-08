import { defineConfig } from 'tsup'

const entry = ['src/index.ts', 'src/parsers.ts', 'src/combinators.ts']

export default defineConfig({
  entry,
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  dts: true,
  minify: false,
  bundle: true
})
