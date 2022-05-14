import { complete, cycle } from 'benny'
import * as kleur from 'kleur'

export const handlers = [
  cycle(),

  complete((summary) => {
    const length = summary.results.length

    console.log()
    console.log(kleur.blue(`Finished ${length} case${length !== 1 ? 's' : ''}!`))

    if (length > 1) {
      console.log(kleur.blue('  Fastest:'), summary.fastest.name)
      console.log(kleur.blue('  Slowest:'), summary.slowest.name)
    }

    console.log()
    console.log('~~~')
    console.log()
  })
]
