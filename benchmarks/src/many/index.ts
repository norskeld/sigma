import { suite, add } from 'benny'

import { parse as parseSigma } from './sigma'
import { parse as parseParjs } from './parjs'
import { handlers } from '../@helpers'

import { SAMPLE } from './@sample'

suite(
  'many :: sigma vs parjs',

  add('sigma', () => parseSigma(SAMPLE)),
  add('parjs', () => parseParjs(SAMPLE)),

  ...handlers
)
