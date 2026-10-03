import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const resolve = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@combinators': resolve('./src/combinators'),
      '@core': resolve('./src/core'),
      '@lib': resolve('./src'),
      '@parsers': resolve('./src/parsers'),
      '@types': resolve('./src/types'),
      '@testing': resolve('./src/__tests__/@helpers'),
    },
  },
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.spec-d.ts', 'src/__tests__/**'],
    },
    typecheck: {
      tsconfig: './tsconfig.test.json',
      include: ['src/**/*.spec-d.ts'],
      ignoreSourceErrors: true,
    },
  },
})
