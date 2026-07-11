import { bench, group, summary } from 'mitata'

import { SAMPLE } from './@sample'
import { parse as parseParjs } from './parjs'
import { parse as parseSigma } from './sigma'

group('Tuple :: sigma vs parjs', () => {
  summary(() => {
    bench('sigma', () => parseSigma(SAMPLE)).gc('inner')
    bench('parjs', () => parseParjs(SAMPLE)).gc('inner')
  })
})
