import { handlers } from '@test'
import { suite, add } from 'benny'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigma } from './sigma'

suite(
  'many :: sigma vs parjs',

  add('sigma', () => parseSigma(SAMPLE)),
  add('parjs', () => parseParjs(SAMPLE)),

  ...handlers
)
