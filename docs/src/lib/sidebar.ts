export interface ItemNode {
  kind: 'item'
  url: string
  label: string
  tbd: boolean
}

export interface SectionNode {
  kind: 'section'
  url: string | null
  label: string
  items: Array<ItemNode>
}

function createSection(label: string, url: string | null, items: Array<ItemNode>): SectionNode {
  return {
    kind: 'section',
    url,
    label,
    items
  }
}

function createItem(label: string, url: string, tbd = false): ItemNode {
  return {
    kind: 'item',
    url,
    label,
    tbd
  }
}

// TODO: This probably should be somewhere else.
export function getSidebarItems(): Array<SectionNode> {
  return [
    createSection('Introduction', null, [
      createItem('Getting started', '/introduction/getting-started', true),
      createItem('Installation', '/introduction/installation')
    ]),
    createSection('Guides', null, [
      createItem('Parser combinators 101', '/guides/parser-combinators-101', true),
      createItem('Writing a JSON parser', '/guides/writing-a-json-parser', true)
    ]),
    createSection('Combinators', null, [
      createItem('chainl', '/combinators/chainl'),
      createItem('choice', '/combinators/choice'),
      createItem('error', '/combinators/error'),
      createItem('many', '/combinators/many'),
      createItem('many1', '/combinators/many1'),
      createItem('map', '/combinators/map'),
      createItem('mapTo', '/combinators/mapTo'),
      createItem('optional', '/combinators/optional'),
      createItem('sepBy', '/combinators/sepBy'),
      createItem('sepBy1', '/combinators/sepBy1'),
      createItem('sequence', '/combinators/sequence'),
      createItem('skipUntil', '/combinators/skipUntil'),
      createItem('takeLeft', '/combinators/takeLeft'),
      createItem('takeMid', '/combinators/takeMid'),
      createItem('takeRight', '/combinators/takeRight'),
      createItem('takeSides', '/combinators/takeSides'),
      createItem('takeUntil', '/combinators/takeUntil'),
      createItem('when', '/combinators/when')
    ]),
    createSection('Parsers', null, [
      createItem('any', '/parsers/any'),
      createItem('binary', '/parsers/binary'),
      createItem('defer', '/parsers/defer'),
      createItem('eof', '/parsers/eof'),
      createItem('eol', '/parsers/eol'),
      createItem('float', '/parsers/float'),
      createItem('hex', '/parsers/hex'),
      createItem('letter', '/parsers/letter'),
      createItem('letters', '/parsers/letters'),
      createItem('noneOf', '/parsers/noneOf'),
      createItem('nothing', '/parsers/nothing'),
      createItem('octal', '/parsers/octal'),
      createItem('oneOf', '/parsers/oneOf'),
      createItem('regexp', '/parsers/regexp'),
      createItem('rest', '/parsers/rest'),
      createItem('run', '/parsers/run'),
      createItem('string', '/parsers/string'),
      createItem('ustring', '/parsers/ustring'),
      createItem('whitespace', '/parsers/whitespace'),
      createItem('whole', '/parsers/whole')
    ])
  ]
}
