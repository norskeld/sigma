import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const it = suite('index file')

it('', () => {
  assert.equal(2, 2)
})

it.run()
