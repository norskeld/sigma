import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { size } from '../../utils/unicode'

import { pangrams } from './unicode.data'

function check(locale: string) {
  const pangram = pangrams[locale]

  return Array.isArray(pangram)
    ? pangram.forEach((data) => assert.equal(size(data.text), data.size))
    : assert.equal(size(pangram.text), pangram.size)
}

const it = suite('unicode')

it('should correctly get length in bytes if given a unicode pangram', () => {
  check('da')
  check('en')
  check('fr')
  check('de')
  check('iw')
  check('hu')
  check('is')
  check('ga')
  check('ja')
  check('pl')
  check('ru')
  check('es')
})

it('should correctly get length in bytes if given an emoji', () => {
  assert.equal(size(`⚡`), 3)
  assert.equal(size(`🦶🏿`), 8)
  assert.equal(size(`👨‍👨‍👧‍👧`), 25)
  assert.equal(size(`🏴󠁧󠁢󠁥󠁮󠁧󠁿`), 28)
})

it('should correctly calculate length in bytes if given a char in range [E000, FFFF]', () => {
  ;[
    '\uE000', // Private Use Area
    '\uF900', // CJK Compatibility Ideographs
    '\uFB00', // Alphabetic Presentation Forms
    '\uFB50', // Arabic Presentation Forms
    '\uFE00', // Variation Selectors
    '\uFE10', // Vertical Forms
    '\uFE20', // Combining Half Marks
    '\uFE30', // CJK Compatibility Forms
    '\uFE50', // Small Form Variants
    '\uFE70', // Arabic Presentation Forms-B
    '\uFF00', // Half-Width and Fullwidth Forms
    '\uFFF0' // Specials
  ].forEach((char) => {
    assert.equal(size(char), 3)
  })
})

it('should throw if given an invalid single surrogate', () => {
  ;[
    '\uD800', // Missing low surrogate
    '\uDB7F', // Missing low surrogate
    '\uDB80', // Missing low surrogate
    '\uDBFF', // Missing low surrogate
    '\uDC00', // Invalid high surrogate
    '\uDF80', // Invalid high surrogate
    '\uDFFF' // Invalid high surrogate
  ].forEach((char) => {
    assert.throws(() => size(char))
  })
})

it.run()
