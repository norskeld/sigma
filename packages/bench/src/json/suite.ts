import { bench, group, summary } from 'mitata'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigmaDefer } from './sigma'
import { parse as parseSigmaGrammar } from './sigma-grammar'

group('JSON :: sigma vs parjs', () => {
  summary(() => {
    bench('sigma:defer', () => parseSigmaDefer(SAMPLE)).gc('inner')
    bench('sigma:grammar', () => parseSigmaGrammar(SAMPLE)).gc('inner')
    bench('parjs', () => parseParjs(SAMPLE)).gc('inner')
  })
})
