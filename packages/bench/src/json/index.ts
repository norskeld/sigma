import { bench, group, run, summary } from 'mitata'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigmaDefer } from './sigma'
import { parse as parseSigmaGrammar } from './sigma-grammar'

group('JSON — sigma vs parjs', () => {
  summary(() => {
    bench('sigma:defer', () => parseSigmaDefer(SAMPLE))
    bench('sigma:grammar', () => parseSigmaGrammar(SAMPLE))
    bench('parjs', () => parseParjs(SAMPLE))
  })
})

if (import.meta.main) {
  await run()
}
