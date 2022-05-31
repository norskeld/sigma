import { pangrams } from './unicode.data'
import { size } from '@lib/utils/unicode'

function check(locale: string) {
  const pangram = pangrams[locale]

  return Array.isArray(pangram)
    ? pangram.forEach((data) => expect(size(data.text)).toBe(data.size))
    : expect(size(pangram.text)).toBe(pangram.size)
}

describe(size, () => {
  it.each(['da', 'en', 'fr', 'de', 'iw', 'hu', 'is', 'ga', 'ja', 'pl', 'ru', 'es'])(
    'should correctly get length in bytes for %s unicode pangram',
    (locale) => {
      check(locale)
    }
  )

  it.each([
    [`⚡`, 3],
    [`🦶🏿`, 8],
    [`👨‍👨‍👧‍👧`, 25],
    [`🏴󠁧󠁢󠁥󠁮󠁧󠁿`, 28]
  ])('should correctly get length in bytes for %p emoji', (emoji, length) => {
    expect(size(emoji)).toBe(length)
  })

  it.each([
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
  ])('should correctly calculate length in bytes for %p', (char) => {
    expect(size(char)).toBe(3)
  })

  it.each([
    '\uD800', // Missing low surrogate
    '\uDB7F', // Missing low surrogate
    '\uDB80', // Missing low surrogate
    '\uDBFF', // Missing low surrogate
    '\uDC00', // Invalid high surrogate
    '\uDF80', // Invalid high surrogate
    '\uDFFF' //  Invalid high surrogate
  ])('should throw for a %p invalid single surrogate', (char) => {
    expect(() => size(char)).toThrow()
  })
})
