import { fileURLToPath } from 'node:url'

import { defineConfig } from 'tsdown'

function resolve(path: string): string {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  entry: ['./src/index.ts', './src/parsers.ts', './src/combinators.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2022',
  sourcemap: true,
  treeshake: true,
  clean: true,
  minify: Boolean(process.env.CI),
  tsconfig: './tsconfig.lib.json',
  alias: {
    '@combinators': resolve('./src/combinators'),
    '@core': resolve('./src/core'),
    '@lib': resolve('./src'),
    '@parsers': resolve('./src/parsers'),
    '@types': resolve('./src/types'),
    '@testing': resolve('./src/__tests__/@helpers'),
  },
})
