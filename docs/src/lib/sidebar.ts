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

export function getSidebarItems(): Array<SectionNode> {
  return [
    createSection('Introduction', null, [
      createItem('Getting started', '/introduction/getting-started'),
      createItem('Installation', '/introduction/installation')
    ]),
    createSection('Guides', null, [
      createItem('Parser combinators 101', '/guides/parser-combinators-101', true),
      createItem('Writing a JSON parser', '/guides/writing-a-json-parser', true)
    ]),
    createSection('Combinators', null, [
      createItem('chainl', '/combinators/chainl', true),
      createItem('choice', '/combinators/choice', true),
      createItem('error', '/combinators/error', true),
      createItem('list', '/combinators/list', true),
      createItem('many', '/combinators/many', true),
      createItem('map', '/combinators/map', true),
      createItem('mapTo', '/combinators/mapTo', true),
      createItem('optional', '/combinators/optional', true),
      createItem('sequence', '/combinators/sequence', true),
      createItem('takeLeft', '/combinators/takeLeft', true),
      createItem('takeMid', '/combinators/takeMid', true),
      createItem('takeRight', '/combinators/takeRight', true),
      createItem('takeSides', '/combinators/takeSides', true)
    ]),
    createSection('Parsers', null, [
      createItem('defer', '/parsers/defer', true),
      createItem('eof', '/parsers/eof', true),
      createItem('float', '/parsers/float', true),
      createItem('integer', '/parsers/integer', true),
      createItem('integerUnsigned', '/parsers/integerUnsigned', true),
      createItem('lazy', '/parsers/lazy', true),
      createItem('letter', '/parsers/letter', true),
      createItem('letters', '/parsers/letters', true),
      createItem('newline', '/parsers/newline', true),
      createItem('nothing', '/parsers/nothing', true),
      createItem('regexp', '/parsers/regexp', true),
      createItem('rest', '/parsers/rest', true),
      createItem('string', '/parsers/string', true),
      createItem('uniString', '/parsers/uniString', true),
      createItem('whitespace', '/parsers/whitespace', true),
      createItem('whitespaceOptional', '/parsers/whitespaceOptional', true)
    ])
  ]
}
