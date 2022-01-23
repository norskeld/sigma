import { success, failure, type Parser } from '../state'
import { size } from '../utils/unicode'

export function string(match: string): Parser<string> {
  return {
    parse(state) {
      const index = state.index + match.length
      const slice = state.text.substring(state.index, index)

      switch (slice === match) {
        case true: {
          return success({ text: state.text, index }, match)
        }

        case false: {
          return failure(state, match)
        }
      }
    }
  }
}

export function ustring(match: string): Parser<string> {
  return {
    parse(state) {
      const index = state.index + size(match)
      const slice = state.text.substring(state.index, index)

      switch (slice === match) {
        case true: {
          return success({ text: state.text, index }, match)
        }

        case false: {
          return failure(state, match)
        }
      }
    }
  }
}
