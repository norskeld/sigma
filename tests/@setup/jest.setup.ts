/* eslint-disable @typescript-eslint/no-namespace */

import { Result } from '@lib/internal/state'

interface CustomState<T> {
  kind: 'success' | 'failure'
  value: T
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveState<T>(expected: CustomState<T>): R
    }
  }
}

expect.extend({
  toHaveState<T>(received: Result<unknown>, expected: CustomState<T>): jest.CustomMatcherResult {
    if (received.kind === expected.kind) {
      switch (received.kind) {
        case 'success': {
          if (received.value === expected.value) {
            return {
              pass: true,
              message: () =>
                `The result 'value' should not to be '${expected.value}'.\n\n` +
                `  Expected: ${expected.value}\n` +
                `  Received: ${received.value}`
            }
          } else {
            return {
              pass: false,
              message: () =>
                `The result 'value' should be '${expected.value}'.\n\n` +
                `  Expected: ${expected.value}\n` +
                `  Received: ${received.value}`
            }
          }
        }

        case 'failure': {
          // Ooof, this is ugly...
          if (received.expected === (expected.value as unknown as string)) {
            return {
              pass: true,
              message: () =>
                `The 'expected' value should not be '${expected.value}'.\n\n` +
                `  Expected: ${expected.value}\n` +
                `  Received: ${received.expected}`
            }
          } else {
            return {
              pass: false,
              message: () =>
                `The 'expected' value should be '${expected.value}'.\n\n` +
                `  Expected: ${expected.value}\n` +
                `  Received: ${received.expected}`
            }
          }
        }
      }
    }

    return {
      pass: false,
      message: () =>
        `The result 'kind' should be '${expected.kind}'.\n\n` +
        `  Expected: ${expected.kind}\n` +
        `  Received: ${received.kind}`
    }
  }
})

export default expect
