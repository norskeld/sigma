import assert from 'node:assert/strict'

import { bench, group, run, summary } from 'mitata'

import { validate } from '../validate.ts'
import {
  BROKEN,
  BROKEN_ALL,
  BROKEN_COUNT,
  BROKEN_EVERY,
  BROKEN_LAST,
  CLEAN,
  COUNT,
  GROUPS_BROKEN,
  GROUPS_CLEAN,
  GROUP_BROKEN_COUNT,
  GROUP_BROKEN_EVERY,
  GROUP_COUNT,
  GROUP_NAMES,
  NAMES,
} from './@sample.ts'
import type { Group, Item, Node } from './sigma.ts'
import {
  countGroupsRecovered,
  countRecovered,
  failCommitted,
  parseCommitted,
  parseGroups,
  parseGroupsRecovering,
  parsePlain,
  parseRecovering,
  parseRecoveringTo,
} from './sigma.ts'

const lets: Array<Node> = NAMES.map((name) => ({ kind: 'let', name }))

const groups: Array<Group> = GROUP_NAMES.map(([a, b, c, d]) => ({
  kind: 'group',
  items: [a, { kind: 'group', items: [b, c] }, d],
}))

validate(lets, {
  plain: () => parsePlain(CLEAN),
  committed: () => parseCommitted(CLEAN),
  recovering: () => parseRecovering(CLEAN),
  recoveringTo: () => parseRecoveringTo(CLEAN),
})

validate(groups, { groups: () => parseGroups(GROUPS_CLEAN) })

// The recovery path must actually recover, and produce the tree it claims to, otherwise the
// benchmark measures the wrong thing.
const recovered: Array<Node> = NAMES.map((name, index) =>
  index % BROKEN_EVERY === 0 ? { kind: 'error' } : { kind: 'let', name },
)

const groupsRecovered: Array<Item> = groups.map((value, index) =>
  index % GROUP_BROKEN_EVERY === 0 ? { kind: 'error' } : value,
)

validate(recovered, {
  'recovering (broken)': () => parseRecovering(BROKEN),
  'recovering (broken, syncTo)': () => parseRecoveringTo(BROKEN),
})

validate(groupsRecovered, {
  'groups recovering (broken)': () => parseGroupsRecovering(GROUPS_BROKEN),
})

assert.equal(countRecovered(BROKEN), BROKEN_COUNT)
assert.equal(countRecovered(BROKEN_ALL), COUNT)
assert.equal(countGroupsRecovered(GROUPS_BROKEN), GROUP_BROKEN_COUNT)

// The unrecovered baseline must reach the end before it gives up, not bail on the first statement.
assert.equal(failCommitted(BROKEN_LAST), false)
assert.equal(parsePlain(BROKEN_LAST).length, COUNT - 1)

group('recovery', () => {
  summary(() => {
    bench('sigma:plain (no commit)', () => parsePlain(CLEAN))
    bench('sigma:committed (valid input)', () => parseCommitted(CLEAN))
    bench('sigma:recovering (valid input)', () => parseRecovering(CLEAN))
    bench('sigma:committed (fails at the end)', () => failCommitted(BROKEN_LAST))
    bench('sigma:recovering (5% broken)', () => parseRecovering(BROKEN))
    bench('sigma:recovering (5% broken, syncTo)', () => parseRecoveringTo(BROKEN))
    bench('sigma:recovering (100% broken)', () => parseRecovering(BROKEN_ALL))
  })
})

group('recovery (nested)', () => {
  summary(() => {
    bench('sigma:groups (valid input)', () => parseGroups(GROUPS_CLEAN))
    bench(`sigma:groups recovering (${GROUP_COUNT} groups, 5% broken)`, () =>
      parseGroupsRecovering(GROUPS_BROKEN),
    )
  })
})

if (import.meta.main) {
  await run()
}
