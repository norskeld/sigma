import { suite, add, cycle, complete } from 'benny'

import { parse as parseSigma } from './sigma'
import { parse as parseParjs } from './parjs'

import { SAMPLE } from './@sample'

const options = {
  minSamples: 50
}

suite(
  'JSON :: sigma vs parjs',

  add('sigma', () => parseSigma(SAMPLE), options),
  add('parjs', () => parseParjs(SAMPLE), options),

  cycle(),
  complete()
)
