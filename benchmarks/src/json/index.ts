import { suite, add } from 'benny'

import { handlers } from '../@helpers'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigma } from './sigma'

suite(
  'JSON :: sigma vs parjs',

  add('sigma', () => parseSigma(SAMPLE)),
  add('parjs', () => parseParjs(SAMPLE)),

  ...handlers
)
