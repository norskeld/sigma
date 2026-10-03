import type { Parser } from '@nrsk/sigma'
import {
  choice,
  commit,
  defer,
  first,
  letters,
  many,
  map,
  recover,
  run,
  sepBy,
  sequence,
  string,
  syncNested,
  syncPast,
  syncTo,
} from '@nrsk/sigma'

export type Node = { kind: 'let'; name: string } | { kind: 'error' }

const body = first(letters(), string(';'))

const toLet = ([, name]: [string, string]): Node => ({ kind: 'let', name })

/** No commitment at all: the cost users pay who never touch recovery. */
const Plain = many(map(sequence(string('let '), body), toLet))

/** Committed, but run against valid input: isolates the cost of the commitment flag. */
const Committed = many(map(sequence(string('let '), commit(body, 'stmt')), toLet))

/** Committed plus a recovery point: the full recovery path. */
const Recovering = many(
  recover(
    map(sequence(string('let '), commit(body, 'stmt')), toLet),
    syncPast(string(';')),
    (): Node => ({ kind: 'error' }),
  ),
)

/** Same, resynchronising on the keyword that starts the next statement instead of the terminator. */
const RecoveringTo = many(
  recover(
    map(sequence(string('let '), commit(body, 'stmt')), toLet),
    syncTo(string('let ')),
    (): Node => ({ kind: 'error' }),
  ),
)

export type Group = { kind: 'group'; items: Array<Item> }
export type Item = string | Group | { kind: 'error' }

const Element = defer<Item>()

const Group: Parser<Group> = map(
  sequence(string('('), commit(first(sepBy(Element, string(',')), string(')')), 'group')),
  ([, items]): Group => ({ kind: 'group', items }),
)

Element.with(choice(letters(), Group))

const Groups = many(Group)

/** Recovers out of a bracketed region, where skipping to the first `)` would land inside it. */
const GroupsRecovering = many(
  recover(Group, syncNested(string('('), string(')')), (): Item => ({ kind: 'error' })),
)

function parseWith<T>(parser: Parser<Array<T>>, text: string): Array<T> {
  const result = run(parser).with(text)

  if (!result.isOk) {
    throw new Error(`sigma failed at ${result.pos}: expected ${result.expected}`)
  }

  return result.value
}

export function parsePlain(text: string): Array<Node> {
  return parseWith(Plain, text)
}

export function parseCommitted(text: string): Array<Node> {
  return parseWith(Committed, text)
}

export function parseRecovering(text: string): Array<Node> {
  return parseWith(Recovering, text)
}

export function parseRecoveringTo(text: string): Array<Node> {
  return parseWith(RecoveringTo, text)
}

export function parseGroups(text: string): Array<Group> {
  return parseWith(Groups, text)
}

export function parseGroupsRecovering(text: string): Array<Item> {
  return parseWith(GroupsRecovering, text)
}

/** Recovery path, returning the diagnostics rather than the tree. */
export function countRecovered(text: string): number {
  return run(Recovering).with(text).errors.length
}

export function countGroupsRecovered(text: string): number {
  return run(GroupsRecovering).with(text).errors.length
}

/** Hard-failure path: a committed grammar with no recovery point, bailing out at the end. */
export function failCommitted(text: string): boolean {
  return run(Committed).with(text).isOk
}
