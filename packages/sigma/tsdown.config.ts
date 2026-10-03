import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2025',
  sourcemap: true,
  treeshake: true,
  clean: true,
  minify: Boolean(process.env.CI),
  tsconfig: './tsconfig.lib.json',
})
