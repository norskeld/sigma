import { suite } from 'uvu'

import * as exposed from '../parsers'

import { should, expectedParsers } from './@helpers'

const it = suite('parsers exports')

it('should expose parsers', () => {
  should.expose(exposed, ...expectedParsers)
})

it.run()
