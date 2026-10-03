import { bench, group, run, summary } from 'mitata'

import { validate } from '../validate.ts'
import { COUNT, SAMPLE } from './@sample.ts'
import { parse as parseChevrotain } from './chevrotain.ts'
import { parse as parseParjs } from './parjs.ts'
import { parse as parseParsimmon } from './parsimmon.ts'
import { parse as parseSigma } from './sigma.ts'

validate(Array(COUNT).fill('x!'), {
  sigma: () => parseSigma(SAMPLE),
  parjs: () => parseParjs(SAMPLE),
  parsimmon: () => parseParsimmon(SAMPLE),
  chevrotain: () => parseChevrotain(SAMPLE),
})

group('many', () => {
  summary(() => {
    bench('sigma', () => parseSigma(SAMPLE))
    bench('parjs', () => parseParjs(SAMPLE))
    bench('parsimmon', () => parseParsimmon(SAMPLE))
    bench('chevrotain', () => parseChevrotain(SAMPLE))
  })
})

if (import.meta.main) {
  await run()
}
