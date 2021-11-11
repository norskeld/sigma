import * as exposed from '@lib/internal/state'

describe('state/index.ts', () => {
  it('exposes specific functions', () => {
    expect(exposed).toHaveProperty('success')
    expect(exposed).toHaveProperty('failure')
  })
})
