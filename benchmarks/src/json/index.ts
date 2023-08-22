import { suite, add } from 'benny'

import { handlers } from '../@helpers'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigmaDefer } from './sigma'
import { parse as parseSigmaGrammar } from './sigma-grammar'

suite(
  'JSON :: sigma vs parjs',

  add('sigma:defer', () => parseSigmaDefer(SAMPLE)),
  add('sigma:grammar', () => parseSigmaGrammar(SAMPLE)),
  add('parjs', () => parseParjs(SAMPLE)),

  ...handlers
)
