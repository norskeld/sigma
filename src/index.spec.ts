import { identity } from './index'

describe('index.ts', () => {
  it('given a primitive, should return the same primitive', async () => {
    expect(await identity('string')).toBe('string')
    expect(await identity(1986)).toBe(1986)
    expect(await identity(true)).toBe(true)
    expect(await identity(undefined)).toBe(undefined)
  })

  it('given an object, should return the same object', async () => {
    const value = { foo: 'bar' }
    expect(await identity(value)).toBe(value)
  })
})
