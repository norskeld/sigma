/**
 * Iterates over a given Unicode string and counts its length in bytes.
 *
 * Covers Basic Multilingual Plane with all 163 blocks in range from `0x0000` to `0xFFFF`.
 *
 * @internal
 */
export function size(string: string): number {
  const size = string.length
  let bytes = 0

  for (let index = 0; index < size; index++) {
    const high = string.charCodeAt(index)

    switch (true) {
      // [0x0000, 0x007F] - [Basic Latin]
      case high < 0x0080: {
        bytes += 1
        break
      }

      // [0x0080, 0x07FF] - [Latin-1 Supplement, NKo]
      case high < 0x0800: {
        bytes += 2
        break
      }

      // [0x0800, 0xD7FF] - [Samaritan, Hangul Jamo Extended-B]
      case high < 0xd800: {
        bytes += 3
        break
      }

      // [0xD800, 0xDBFF] - [High Surrogates, High Private Use Surrogates]
      case high < 0xdc00: {
        // Stepping into low surrogates territory. Here we should be using **two** code points.
        const low = string.charCodeAt(++index)

        // Followed by: [0xDC00, 0xDFFF] - [Low Surrogates]
        if (index < size && low >= 0xdc00 && low <= 0xdfff) {
          bytes += 4
          break
        } else {
          throw new Error('Malformed Unicode string with missing or invalid low surrogate.')
        }
      }

      // [0xDC00, 0xDFFF] - [Low Surrogates], but if we somehow get here, then the string is
      // malformed, because here we get only **one** code point.
      case high < 0xe000: {
        throw new Error('Malformed Unicode string with invalid high surrogate.')
      }

      // [0xE000, 0xFFFF] - [Private Use Area, Specials]
      default: {
        bytes += 3
        break
      }
    }
  }

  return bytes
}
