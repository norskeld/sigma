import assert from 'node:assert/strict'

/** Runs every implementation once and asserts it produces the expected output. */
export function validate(expected: unknown, impls: Record<string, () => unknown>): void {
  for (const [name, run] of Object.entries(impls)) {
    try {
      assert.deepStrictEqual(run(), expected)
    } catch (cause) {
      throw new Error(`Implementation '${name}' failed validation.`, { cause })
    }
  }
}
