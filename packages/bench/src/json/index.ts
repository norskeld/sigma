import { bench, group, run, summary } from 'mitata'

import { validate } from '../validate.ts'
import { SAMPLE } from './@sample.ts'
import { parse as parseChevrotain } from './chevrotain.ts'
import { EXPECTED } from './expected.ts'
import { parse as parseParjs } from './parjs.ts'
import { parse as parseParsimmon } from './parsimmon.ts'
import { parse as parseSigmaDefer } from './sigma.ts'
import { parse as parseSigmaGrammar } from './sigma-grammar.ts'

validate(EXPECTED, {
  'sigma:defer': () => parseSigmaDefer(SAMPLE),
  'sigma:grammar': () => parseSigmaGrammar(SAMPLE),
  parjs: () => parseParjs(SAMPLE),
  parsimmon: () => parseParsimmon(SAMPLE),
  chevrotain: () => parseChevrotain(SAMPLE),
})

group('JSON', () => {
  summary(() => {
    bench('sigma:defer', () => parseSigmaDefer(SAMPLE))
    bench('sigma:grammar', () => parseSigmaGrammar(SAMPLE))
    bench('parjs', () => parseParjs(SAMPLE))
    bench('parsimmon', () => parseParsimmon(SAMPLE))
    bench('chevrotain', () => parseChevrotain(SAMPLE))
    bench('JSON.parse (native)', () => JSON.parse(SAMPLE))
  })
})

if (import.meta.main) {
  await run()
}
