import { suite } from 'uvu'

import * as exposed from '../'

import { should, expectedParsers, expectedCombinators } from './@helpers'

const it = suite('index exports')

it('should re-export combinators', () => {
  should.expose(exposed, ...expectedCombinators)
})

it('should re-export parsers', () => {
  should.expose(exposed, ...expectedParsers)
})

it.run()
