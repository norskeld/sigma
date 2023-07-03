import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json']
    })
  ],
  test: {
    coverage: {
      all: true,
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts']
    },
    typecheck: {
      tsconfig: './tsconfig.test.json',
      include: ['src/**/*.spec-d.ts'],
      ignoreSourceErrors: true
    }
  }
})
