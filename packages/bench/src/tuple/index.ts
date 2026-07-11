import { bench, group, run, summary } from 'mitata'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigma } from './sigma'

group('Tuple — sigma vs parjs', () => {
  summary(() => {
    bench('sigma', () => parseSigma(SAMPLE))
    bench('parjs', () => parseParjs(SAMPLE))
  })
})

if (import.meta.main) {
  await run()
}
