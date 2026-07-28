import { bench, group, run, summary } from 'mitata'

import { validate } from '../validate.ts'
import { EXPECTED_LARGE, EXPECTED_SMALL, SAMPLE_LARGE, SAMPLE_SMALL } from './@sample.ts'
import { parse as parseChevrotain } from './chevrotain.ts'
import { parse as parseParjs } from './parjs.ts'
import { parse as parseParsimmon } from './parsimmon.ts'
import { parse as parseSigma } from './sigma.ts'

validate(EXPECTED_SMALL, {
  sigma: () => parseSigma(SAMPLE_SMALL),
  parjs: () => parseParjs(SAMPLE_SMALL),
  parsimmon: () => parseParsimmon(SAMPLE_SMALL),
  chevrotain: () => parseChevrotain(SAMPLE_SMALL),
})

validate(EXPECTED_LARGE, {
  sigma: () => parseSigma(SAMPLE_LARGE),
  parjs: () => parseParjs(SAMPLE_LARGE),
  parsimmon: () => parseParsimmon(SAMPLE_LARGE),
  chevrotain: () => parseChevrotain(SAMPLE_LARGE),
})

group('Tuple', () => {
  summary(() => {
    bench('sigma', () => parseSigma(SAMPLE_SMALL))
    bench('parjs', () => parseParjs(SAMPLE_SMALL))
    bench('parsimmon', () => parseParsimmon(SAMPLE_SMALL))
    bench('chevrotain', () => parseChevrotain(SAMPLE_SMALL))
  })
})

group('Tuple (large)', () => {
  summary(() => {
    bench('sigma', () => parseSigma(SAMPLE_LARGE))
    bench('parjs', () => parseParjs(SAMPLE_LARGE))
    bench('parsimmon', () => parseParsimmon(SAMPLE_LARGE))
    bench('chevrotain', () => parseChevrotain(SAMPLE_LARGE))
  })
})

if (import.meta.main) {
  await run()
}
